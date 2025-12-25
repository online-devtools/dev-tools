'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface CertificateInfo {
    subject: {
        CN?: string
        O?: string
        OU?: string
        C?: string
        ST?: string
        L?: string
    }
    issuer: {
        CN?: string
        O?: string
        C?: string
    }
    validity: {
        notBefore: string
        notAfter: string
        daysRemaining: number
        isExpired: boolean
    }
    serialNumber: string
    version: number
    signatureAlgorithm: string
    keyInfo: {
        algorithm: string
        keySize?: number
    }
    extensions: {
        san?: string[]
        keyUsage?: string[]
        extKeyUsage?: string[]
        isCA?: boolean
    }
    fingerprints: {
        sha256: string
        sha1: string
    }
    raw: string
}

// Simple ASN.1 DER parser for X.509 certificates
function parseAsn1Length(data: Uint8Array, offset: number): { length: number; bytesRead: number } {
    const firstByte = data[offset]
    if (firstByte < 0x80) {
        return { length: firstByte, bytesRead: 1 }
    }
    const numBytes = firstByte & 0x7f
    let length = 0
    for (let i = 0; i < numBytes; i++) {
        length = (length << 8) | data[offset + 1 + i]
    }
    return { length, bytesRead: 1 + numBytes }
}

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(':')
        .toUpperCase()
}

async function hashBytes(algorithm: string, data: Uint8Array): Promise<string> {
    // Create a copy of the data as ArrayBuffer to ensure compatibility
    const buffer = new Uint8Array(data).buffer as ArrayBuffer
    const hashBuffer = await crypto.subtle.digest(algorithm, buffer)
    return bytesToHex(new Uint8Array(hashBuffer))
}

function parsePemCertificate(pem: string): Uint8Array | null {
    const pemRegex = /-----BEGIN CERTIFICATE-----\s*([\s\S]*?)\s*-----END CERTIFICATE-----/
    const match = pem.match(pemRegex)
    if (!match) return null

    const base64 = match[1].replace(/\s/g, '')
    try {
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i)
        }
        return bytes
    } catch {
        return null
    }
}

function decodeOID(bytes: Uint8Array): string {
    if (bytes.length === 0) return ''

    const first = bytes[0]
    const components: number[] = [Math.floor(first / 40), first % 40]

    let value = 0
    for (let i = 1; i < bytes.length; i++) {
        value = (value << 7) | (bytes[i] & 0x7f)
        if ((bytes[i] & 0x80) === 0) {
            components.push(value)
            value = 0
        }
    }

    return components.join('.')
}

function oidToName(oid: string): string {
    const oidMap: Record<string, string> = {
        '2.5.4.3': 'CN',
        '2.5.4.6': 'C',
        '2.5.4.7': 'L',
        '2.5.4.8': 'ST',
        '2.5.4.10': 'O',
        '2.5.4.11': 'OU',
        '1.2.840.113549.1.1.11': 'SHA256withRSA',
        '1.2.840.113549.1.1.12': 'SHA384withRSA',
        '1.2.840.113549.1.1.13': 'SHA512withRSA',
        '1.2.840.113549.1.1.5': 'SHA1withRSA',
        '1.2.840.10045.4.3.2': 'ECDSA-SHA256',
        '1.2.840.10045.4.3.3': 'ECDSA-SHA384',
        '1.2.840.10045.4.3.4': 'ECDSA-SHA512',
        '1.2.840.113549.1.1.1': 'RSA',
        '1.2.840.10045.2.1': 'ECDSA',
        '2.5.29.17': 'subjectAltName',
        '2.5.29.15': 'keyUsage',
        '2.5.29.37': 'extendedKeyUsage',
        '2.5.29.19': 'basicConstraints',
        '1.3.6.1.5.5.7.3.1': 'serverAuth',
        '1.3.6.1.5.5.7.3.2': 'clientAuth',
    }
    return oidMap[oid] || oid
}

interface Asn1Node {
    tag: number
    length: number
    value: Uint8Array
    children?: Asn1Node[]
    offset: number
}

function parseAsn1(data: Uint8Array, offset: number = 0): Asn1Node | null {
    if (offset >= data.length) return null

    const tag = data[offset]
    const { length, bytesRead } = parseAsn1Length(data, offset + 1)
    const valueStart = offset + 1 + bytesRead
    const value = data.slice(valueStart, valueStart + length)

    const node: Asn1Node = { tag, length, value, offset }

    // Constructed types (SEQUENCE, SET)
    if ((tag & 0x20) !== 0 || tag === 0x30 || tag === 0x31 || (tag & 0xa0) !== 0) {
        node.children = []
        let childOffset = 0
        while (childOffset < value.length) {
            const child = parseAsn1(value, childOffset)
            if (!child) break
            node.children.push(child)
            childOffset += 1 + parseAsn1Length(value, childOffset + 1).bytesRead + child.length
        }
    }

    return node
}

function decodeUtf8(bytes: Uint8Array): string {
    try {
        return new TextDecoder('utf-8').decode(bytes)
    } catch {
        return Array.from(bytes).map(b => String.fromCharCode(b)).join('')
    }
}

function parseTime(node: Asn1Node): Date {
    const str = decodeUtf8(node.value)
    if (node.tag === 0x17) { // UTCTime
        const year = parseInt(str.slice(0, 2))
        const fullYear = year >= 50 ? 1900 + year : 2000 + year
        return new Date(
            fullYear,
            parseInt(str.slice(2, 4)) - 1,
            parseInt(str.slice(4, 6)),
            parseInt(str.slice(6, 8)),
            parseInt(str.slice(8, 10)),
            parseInt(str.slice(10, 12))
        )
    } else { // GeneralizedTime
        return new Date(
            parseInt(str.slice(0, 4)),
            parseInt(str.slice(4, 6)) - 1,
            parseInt(str.slice(6, 8)),
            parseInt(str.slice(8, 10)),
            parseInt(str.slice(10, 12)),
            parseInt(str.slice(12, 14))
        )
    }
}

function parseName(node: Asn1Node): Record<string, string> {
    const result: Record<string, string> = {}
    if (!node.children) return result

    for (const rdn of node.children) {
        if (!rdn.children) continue
        for (const atv of rdn.children) {
            if (!atv.children || atv.children.length < 2) continue
            const oid = decodeOID(atv.children[0].value)
            const name = oidToName(oid)
            const value = decodeUtf8(atv.children[1].value)
            result[name] = value
        }
    }

    return result
}

async function parseCertificate(pem: string): Promise<CertificateInfo> {
    const der = parsePemCertificate(pem)
    if (!der) {
        throw new Error('Invalid PEM format')
    }

    const root = parseAsn1(der)
    if (!root || !root.children || root.children.length < 1) {
        throw new Error('Invalid certificate structure')
    }

    const tbsCertificate = root.children[0]
    if (!tbsCertificate.children) {
        throw new Error('Invalid TBS certificate')
    }

    let idx = 0

    // Version (optional, context-specific [0])
    let version = 1
    if (tbsCertificate.children[idx]?.tag === 0xa0) {
        const versionNode = tbsCertificate.children[idx].children?.[0]
        if (versionNode) {
            version = versionNode.value[0] + 1
        }
        idx++
    }

    // Serial number
    const serialNode = tbsCertificate.children[idx++]
    const serialNumber = bytesToHex(serialNode.value)

    // Signature algorithm
    const sigAlgNode = tbsCertificate.children[idx++]
    const sigAlgOid = sigAlgNode.children?.[0]?.value
    const signatureAlgorithm = sigAlgOid ? oidToName(decodeOID(sigAlgOid)) : 'Unknown'

    // Issuer
    const issuerNode = tbsCertificate.children[idx++]
    const issuer = parseName(issuerNode)

    // Validity
    const validityNode = tbsCertificate.children[idx++]
    const notBefore = parseTime(validityNode.children![0])
    const notAfter = parseTime(validityNode.children![1])
    const now = new Date()
    const daysRemaining = Math.floor((notAfter.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    // Subject
    const subjectNode = tbsCertificate.children[idx++]
    const subject = parseName(subjectNode)

    // Subject Public Key Info
    const spkiNode = tbsCertificate.children[idx++]
    const keyAlgNode = spkiNode.children?.[0]?.children?.[0]
    const keyAlgorithm = keyAlgNode ? oidToName(decodeOID(keyAlgNode.value)) : 'Unknown'

    // Estimate key size from public key
    let keySize: number | undefined
    const pubKeyNode = spkiNode.children?.[1]
    if (pubKeyNode && keyAlgorithm === 'RSA') {
        // RSA public key size estimation
        keySize = (pubKeyNode.value.length - 1) * 8
        if (keySize > 4096) keySize = 4096
        else if (keySize > 2048) keySize = 2048
        else if (keySize > 1024) keySize = 1024
    }

    // Extensions (optional, context-specific [3])
    const extensions: CertificateInfo['extensions'] = {}
    for (let i = idx; i < tbsCertificate.children.length; i++) {
        const child = tbsCertificate.children[i]
        if (child.tag === 0xa3 && child.children) {
            const extsSeq = child.children[0]
            if (extsSeq.children) {
                for (const ext of extsSeq.children) {
                    if (!ext.children || ext.children.length < 2) continue
                    const oid = decodeOID(ext.children[0].value)
                    const extName = oidToName(oid)
                    const valueNode = ext.children[ext.children.length - 1]

                    if (extName === 'subjectAltName' && valueNode.tag === 0x04) {
                        const sanSeq = parseAsn1(valueNode.value)
                        if (sanSeq?.children) {
                            extensions.san = sanSeq.children.map(n => decodeUtf8(n.value))
                        }
                    } else if (extName === 'basicConstraints' && valueNode.tag === 0x04) {
                        const bcSeq = parseAsn1(valueNode.value)
                        if (bcSeq?.children && bcSeq.children.length > 0) {
                            extensions.isCA = bcSeq.children[0].value[0] === 0xff
                        }
                    }
                }
            }
        }
    }

    // Calculate fingerprints
    const sha256 = await hashBytes('SHA-256', der)
    const sha1 = await hashBytes('SHA-1', der)

    return {
        subject,
        issuer,
        validity: {
            notBefore: notBefore.toISOString(),
            notAfter: notAfter.toISOString(),
            daysRemaining,
            isExpired: now > notAfter
        },
        serialNumber,
        version,
        signatureAlgorithm,
        keyInfo: {
            algorithm: keyAlgorithm,
            keySize
        },
        extensions,
        fingerprints: {
            sha256,
            sha1
        },
        raw: pem
    }
}

export default function SslCertAnalyzer() {
    const { t } = useLanguage()
    const [pemInput, setPemInput] = useState('')
    const [certInfo, setCertInfo] = useState<CertificateInfo | null>(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const analyzeCertificate = useCallback(async () => {
        if (!pemInput.trim()) {
            setError(t('sslCert.error.required'))
            return
        }

        setIsLoading(true)
        setError('')
        setCertInfo(null)

        try {
            const info = await parseCertificate(pemInput)
            setCertInfo(info)
        } catch (err) {
            setError(t('sslCert.error.invalid') + ': ' + (err instanceof Error ? err.message : 'Unknown error'))
        } finally {
            setIsLoading(false)
        }
    }, [pemInput, t])

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const content = event.target?.result as string
            setPemInput(content)
        }
        reader.readAsText(file)
    }, [])

    const getValidityColor = (daysRemaining: number, isExpired: boolean) => {
        if (isExpired) return 'text-red-600 dark:text-red-400'
        if (daysRemaining <= 30) return 'text-yellow-600 dark:text-yellow-400'
        return 'text-green-600 dark:text-green-400'
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                🔐 {t('sslCert.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('sslCert.description')}
            </p>

            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('sslCert.input.label')}
                    </label>
                    <label className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                         dark:hover:bg-gray-600 rounded-lg cursor-pointer transition-colors
                         text-sm text-gray-700 dark:text-gray-300">
                        📁 {t('sslCert.uploadFile')}
                        <input
                            type="file"
                            accept=".pem,.crt,.cer"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                </div>

                <textarea
                    value={pemInput}
                    onChange={(e) => setPemInput(e.target.value)}
                    placeholder={t('sslCert.input.placeholder')}
                    className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   font-mono text-sm resize-none"
                />

                {error && (
                    <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={analyzeCertificate}
                    disabled={isLoading}
                    className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium 
                   rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? t('sslCert.analyzing') : t('sslCert.analyze')}
                </button>
            </div>

            {/* Result Section */}
            {certInfo && (
                <div className="space-y-4">
                    {/* Summary Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            📋 {t('sslCert.result.summary')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{t('sslCert.result.commonName')}</span>
                                <p className="text-lg font-medium text-gray-800 dark:text-white">
                                    {certInfo.subject.CN || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{t('sslCert.result.issuer')}</span>
                                <p className="text-lg font-medium text-gray-800 dark:text-white">
                                    {certInfo.issuer.CN || certInfo.issuer.O || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{t('sslCert.result.validFrom')}</span>
                                <p className="text-gray-800 dark:text-white">
                                    {new Date(certInfo.validity.notBefore).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{t('sslCert.result.validUntil')}</span>
                                <p className={getValidityColor(certInfo.validity.daysRemaining, certInfo.validity.isExpired)}>
                                    {new Date(certInfo.validity.notAfter).toLocaleDateString()}
                                    {certInfo.validity.isExpired
                                        ? ` (${t('sslCert.result.expired')})`
                                        : ` (${certInfo.validity.daysRemaining} ${t('sslCert.result.daysRemaining')})`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            🔍 {t('sslCert.result.details')}
                        </h2>

                        <div className="space-y-4">
                            {/* Subject */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('sslCert.result.subject')}
                                </h3>
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 font-mono text-sm">
                                    {Object.entries(certInfo.subject).map(([key, value]) => (
                                        <div key={key}>
                                            <span className="text-gray-500">{key}:</span> {value}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Issuer */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('sslCert.result.issuerDetails')}
                                </h3>
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 font-mono text-sm">
                                    {Object.entries(certInfo.issuer).map(([key, value]) => (
                                        <div key={key}>
                                            <span className="text-gray-500">{key}:</span> {value}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Technical Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('sslCert.result.version')}</span>
                                    <p className="font-mono">v{certInfo.version}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('sslCert.result.signatureAlgorithm')}</span>
                                    <p className="font-mono">{certInfo.signatureAlgorithm}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('sslCert.result.keyAlgorithm')}</span>
                                    <p className="font-mono">{certInfo.keyInfo.algorithm} {certInfo.keyInfo.keySize && `(${certInfo.keyInfo.keySize} bits)`}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('sslCert.result.serialNumber')}</span>
                                    <p className="font-mono text-xs break-all">{certInfo.serialNumber}</p>
                                </div>
                            </div>

                            {/* SAN */}
                            {certInfo.extensions.san && certInfo.extensions.san.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('sslCert.result.san')}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {certInfo.extensions.san.map((name, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm font-mono">
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fingerprints Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            🔒 {t('sslCert.result.fingerprints')}
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">SHA-256</span>
                                    <button
                                        onClick={() => copyToClipboard(certInfo.fingerprints.sha256)}
                                        className="text-xs text-blue-500 hover:text-blue-600"
                                    >
                                        {t('common.copy')}
                                    </button>
                                </div>
                                <p className="font-mono text-xs break-all bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                                    {certInfo.fingerprints.sha256}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">SHA-1</span>
                                    <button
                                        onClick={() => copyToClipboard(certInfo.fingerprints.sha1)}
                                        className="text-xs text-blue-500 hover:text-blue-600"
                                    >
                                        {t('common.copy')}
                                    </button>
                                </div>
                                <p className="font-mono text-xs break-all bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                                    {certInfo.fingerprints.sha1}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                    💡 {t('sslCert.info.title')}
                </h3>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li>• {t('sslCert.info.item1')}</li>
                    <li>• {t('sslCert.info.item2')}</li>
                    <li>• {t('sslCert.info.item3')}</li>
                    <li>• {t('sslCert.info.item4')}</li>
                </ul>
            </div>
        </div>
    )
}
