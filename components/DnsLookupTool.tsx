'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface DnsRecord {
    type: string
    name: string
    value: string
    ttl?: number
}

interface DnsResult {
    domain: string
    records: DnsRecord[]
    timestamp: Date
    provider: string
}

// Using public DNS-over-HTTPS APIs for lookup
const DNS_PROVIDERS = {
    google: 'https://dns.google/resolve',
    cloudflare: 'https://cloudflare-dns.com/dns-query',
}

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'PTR']

async function queryDns(domain: string, type: string, provider: 'google' | 'cloudflare'): Promise<DnsRecord[]> {
    const url = provider === 'google'
        ? `${DNS_PROVIDERS.google}?name=${encodeURIComponent(domain)}&type=${type}`
        : `${DNS_PROVIDERS.cloudflare}?name=${encodeURIComponent(domain)}&type=${type}`

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/dns-json',
        },
    })

    if (!response.ok) {
        throw new Error(`DNS query failed: ${response.status}`)
    }

    const data = await response.json()

    if (data.Status !== 0) {
        // NXDOMAIN or other DNS errors - not necessarily an error
        return []
    }

    if (!data.Answer || !Array.isArray(data.Answer)) {
        return []
    }

    return data.Answer.map((answer: { name: string; type: number; data: string; TTL?: number }) => ({
        type: getRecordTypeName(answer.type),
        name: answer.name,
        value: answer.data,
        ttl: answer.TTL,
    }))
}

function getRecordTypeName(typeCode: number): string {
    const typeMap: Record<number, string> = {
        1: 'A',
        5: 'CNAME',
        6: 'SOA',
        12: 'PTR',
        15: 'MX',
        16: 'TXT',
        28: 'AAAA',
        2: 'NS',
    }
    return typeMap[typeCode] || `TYPE${typeCode}`
}

export default function DnsLookupTool() {
    const { t } = useLanguage()
    const [domain, setDomain] = useState('')
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['A', 'AAAA', 'MX', 'TXT', 'NS'])
    const [provider, setProvider] = useState<'google' | 'cloudflare'>('google')
    const [results, setResults] = useState<DnsResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const toggleRecordType = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        )
    }

    const lookup = useCallback(async () => {
        if (!domain.trim()) {
            setError(t('dnsLookup.error.required'))
            return
        }

        // Simple domain validation
        const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
        if (!domainRegex.test(domain.trim())) {
            setError(t('dnsLookup.error.invalidDomain'))
            return
        }

        if (selectedTypes.length === 0) {
            setError(t('dnsLookup.error.noTypes'))
            return
        }

        setIsLoading(true)
        setError('')
        setResults(null)

        try {
            const allRecords: DnsRecord[] = []

            for (const type of selectedTypes) {
                try {
                    const records = await queryDns(domain.trim(), type, provider)
                    allRecords.push(...records)
                } catch {
                    // Individual type query failed, continue with others
                    console.warn(`Failed to query ${type} records for ${domain}`)
                }
            }

            setResults({
                domain: domain.trim(),
                records: allRecords,
                timestamp: new Date(),
                provider: provider === 'google' ? 'Google DNS' : 'Cloudflare DNS',
            })
        } catch (err) {
            setError(t('dnsLookup.error.lookupFailed') + ': ' + (err instanceof Error ? err.message : 'Unknown error'))
        } finally {
            setIsLoading(false)
        }
    }, [domain, selectedTypes, provider, t])

    const groupedRecords = results?.records.reduce((acc, record) => {
        if (!acc[record.type]) {
            acc[record.type] = []
        }
        acc[record.type].push(record)
        return acc
    }, {} as Record<string, DnsRecord[]>)

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                🌐 {t('dnsLookup.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('dnsLookup.description')}
            </p>

            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dnsLookup.domain.label')}
                    </label>
                    <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="example.com"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyDown={(e) => e.key === 'Enter' && lookup()}
                    />
                </div>

                {/* Record Types */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dnsLookup.recordTypes.label')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {RECORD_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => toggleRecordType(type)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedTypes.includes(type)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Provider Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dnsLookup.provider.label')}
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="google"
                                checked={provider === 'google'}
                                onChange={() => setProvider('google')}
                                className="text-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Google DNS</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="cloudflare"
                                checked={provider === 'cloudflare'}
                                onChange={() => setProvider('cloudflare')}
                                className="text-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Cloudflare DNS</span>
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={lookup}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium 
                   rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? t('dnsLookup.looking') : t('dnsLookup.lookup')}
                </button>
            </div>

            {/* Results Section */}
            {results && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            📋 {t('dnsLookup.results.title')}
                        </h2>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {results.provider} • {results.timestamp.toLocaleTimeString()}
                        </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('dnsLookup.results.domain')}: </span>
                        <span className="font-mono font-medium text-gray-800 dark:text-white">{results.domain}</span>
                    </div>

                    {results.records.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            {t('dnsLookup.results.noRecords')}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {groupedRecords && Object.entries(groupedRecords).map(([type, records]) => (
                                <div key={type} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 font-medium text-gray-800 dark:text-white flex items-center justify-between">
                                        <span>{type} Records ({records.length})</span>
                                    </div>
                                    <div className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {records.map((record, idx) => (
                                            <div key={idx} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                                                        {record.value}
                                                    </p>
                                                    {record.ttl && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            TTL: {record.ttl}s
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(record.value)}
                                                    className="ml-2 p-2 text-gray-400 hover:text-blue-500 transition-colors shrink-0"
                                                    title={t('common.copy')}
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                    💡 {t('dnsLookup.info.title')}
                </h3>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li>• {t('dnsLookup.info.item1')}</li>
                    <li>• {t('dnsLookup.info.item2')}</li>
                    <li>• {t('dnsLookup.info.item3')}</li>
                    <li>• {t('dnsLookup.info.item4')}</li>
                </ul>

                <h4 className="text-md font-semibold text-blue-800 dark:text-blue-300 mt-4 mb-2">
                    {t('dnsLookup.info.recordTypes')}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div><span className="font-mono bg-blue-100 dark:bg-blue-800/30 px-1 rounded">A</span> - IPv4 주소</div>
                    <div><span className="font-mono bg-blue-100 dark:bg-blue-800/30 px-1 rounded">AAAA</span> - IPv6 주소</div>
                    <div><span className="font-mono bg-blue-100 dark:bg-blue-800/30 px-1 rounded">MX</span> - 메일 서버</div>
                    <div><span className="font-mono bg-blue-100 dark:bg-blue-800/30 px-1 rounded">TXT</span> - 텍스트 레코드</div>
                    <div><span className="font-mono bg-blue-100 dark:bg-blue-800/30 px-1 rounded">NS</span> - 네임서버</div>
                    <div><span className="font-mono bg-blue-100 dark:bg-blue-800/30 px-1 rounded">CNAME</span> - 별칭</div>
                    <div><span className="font-mono bg-blue-100 dark:bg-blue-800/30 px-1 rounded">SOA</span> - 권한 시작</div>
                    <div><span className="font-mono bg-blue-100 dark:bg-blue-800/30 px-1 rounded">PTR</span> - 역방향 조회</div>
                </div>
            </div>
        </div>
    )
}
