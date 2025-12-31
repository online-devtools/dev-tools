'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

/**
 * PEM/DER 변환 도구 컴포넌트
 *
 * PEM (Privacy Enhanced Mail) 형식:
 * - Base64로 인코딩된 DER 데이터
 * - -----BEGIN/END CERTIFICATE----- 같은 헤더/푸터로 감싸짐
 * - 텍스트 파일로 쉽게 다룰 수 있음
 *
 * DER (Distinguished Encoding Rules) 형식:
 * - ASN.1 구조의 바이너리 인코딩
 * - 더 작은 크기
 * - Windows에서 주로 사용 (.cer, .crt 확장자)
 *
 * 이 도구는 두 형식 간 변환을 제공합니다.
 */

// PEM 형식의 헤더/푸터 패턴 정의
const PEM_TYPES = [
  { label: 'Certificate', begin: '-----BEGIN CERTIFICATE-----', end: '-----END CERTIFICATE-----' },
  { label: 'Private Key', begin: '-----BEGIN PRIVATE KEY-----', end: '-----END PRIVATE KEY-----' },
  { label: 'RSA Private Key', begin: '-----BEGIN RSA PRIVATE KEY-----', end: '-----END RSA PRIVATE KEY-----' },
  { label: 'EC Private Key', begin: '-----BEGIN EC PRIVATE KEY-----', end: '-----END EC PRIVATE KEY-----' },
  { label: 'Public Key', begin: '-----BEGIN PUBLIC KEY-----', end: '-----END PUBLIC KEY-----' },
  { label: 'CSR', begin: '-----BEGIN CERTIFICATE REQUEST-----', end: '-----END CERTIFICATE REQUEST-----' },
] as const

type PemType = typeof PEM_TYPES[number]

export default function PemDerTool() {
  const { t } = useLanguage()

  // PEM 입력 (텍스트)
  const [pemInput, setPemInput] = useState('')
  // DER 입력 (Base64 문자열로 표시)
  const [derInput, setDerInput] = useState('')
  // 변환 결과
  const [output, setOutput] = useState('')
  // 선택된 PEM 타입 (DER → PEM 변환 시 사용)
  const [selectedType, setSelectedType] = useState<PemType>(PEM_TYPES[0])
  // 에러 메시지
  const [error, setError] = useState<string | null>(null)
  // 감지된 PEM 타입 정보
  const [detectedType, setDetectedType] = useState<string | null>(null)

  /**
   * PEM 형식에서 Base64 본문만 추출
   * 헤더/푸터와 줄바꿈을 제거하고 순수 Base64 문자열 반환
   */
  const extractBase64FromPem = useCallback((pem: string): { base64: string; type: PemType | null } => {
    const trimmed = pem.trim()

    // 각 PEM 타입에 대해 매칭 시도
    for (const type of PEM_TYPES) {
      if (trimmed.includes(type.begin) && trimmed.includes(type.end)) {
        // 헤더와 푸터 사이의 내용 추출
        const startIdx = trimmed.indexOf(type.begin) + type.begin.length
        const endIdx = trimmed.indexOf(type.end)
        const base64Content = trimmed.substring(startIdx, endIdx)

        // 줄바꿈과 공백 제거하여 순수 Base64 문자열 생성
        const cleanBase64 = base64Content.replace(/[\s\r\n]/g, '')

        return { base64: cleanBase64, type }
      }
    }

    return { base64: '', type: null }
  }, [])

  /**
   * PEM → DER 변환
   * PEM의 Base64 본문을 추출하여 DER(바이너리)로 변환
   * 브라우저에서 표시하기 위해 결과는 Base64로 출력
   */
  const handlePemToDer = useCallback(() => {
    setError(null)
    setDetectedType(null)

    if (!pemInput.trim()) {
      setError(t('pemder.error.emptyPem'))
      return
    }

    try {
      const { base64, type } = extractBase64FromPem(pemInput)

      if (!type) {
        setError(t('pemder.error.invalidPem'))
        return
      }

      // PEM의 Base64를 검증 (디코딩 시도)
      try {
        atob(base64)
      } catch {
        setError(t('pemder.error.invalidBase64'))
        return
      }

      setDetectedType(type.label)
      // DER은 바이너리이므로 Base64로 표시 (PEM의 본문과 동일)
      setOutput(base64)
      setDerInput(base64)
    } catch {
      setError(t('pemder.error.conversionFailed'))
    }
  }, [pemInput, extractBase64FromPem, t])

  /**
   * DER → PEM 변환
   * Base64 DER 데이터를 PEM 형식으로 변환 (헤더/푸터 추가, 64자 줄바꿈)
   */
  const handleDerToPem = useCallback(() => {
    setError(null)
    setDetectedType(null)

    if (!derInput.trim()) {
      setError(t('pemder.error.emptyDer'))
      return
    }

    try {
      // Base64 유효성 검증
      const cleanBase64 = derInput.replace(/[\s\r\n]/g, '')
      try {
        atob(cleanBase64)
      } catch {
        setError(t('pemder.error.invalidBase64'))
        return
      }

      // PEM 형식으로 변환: 64자마다 줄바꿈 추가
      const lines: string[] = []
      for (let i = 0; i < cleanBase64.length; i += 64) {
        lines.push(cleanBase64.substring(i, i + 64))
      }

      // 헤더 + 본문 + 푸터 조합
      const pem = `${selectedType.begin}\n${lines.join('\n')}\n${selectedType.end}`

      setOutput(pem)
      setPemInput(pem)
    } catch {
      setError(t('pemder.error.conversionFailed'))
    }
  }, [derInput, selectedType, t])

  /**
   * 모든 상태 초기화
   */
  const handleClear = useCallback(() => {
    setPemInput('')
    setDerInput('')
    setOutput('')
    setError(null)
    setDetectedType(null)
  }, [])

  /**
   * 샘플 인증서 로드 (테스트용 자체 서명 인증서)
   */
  const loadSample = useCallback(() => {
    // 테스트용 샘플 인증서 (실제 인증서 아님)
    const samplePem = `-----BEGIN CERTIFICATE-----
MIIBkTCB+wIJAKHBfpegPj0vMA0GCSqGSIb3DQEBCwUAMBExDzANBgNVBAMMBnNh
bXBsZTAeFw0yNDAxMDEwMDAwMDBaFw0yNTAxMDEwMDAwMDBaMBExDzANBgNVBAMM
BnNhbXBsZTBcMA0GCSqGSIb3DQEBAQUAA0sAMEgCQQC7o96HtiXpfpzLbJTNzPiV
y9rPqoKZ7j5/OVNz7lGJmPxHpKbPKmHVh8zvXM5MO5mu7Zu7bqLyyPsEcdu9s4Wj
AgMBAAGjUzBRMB0GA1UdDgQWBBQExample0000000000000000000zAfBgNVHSME
GDAWgBQExample0000000000000000000zAPBgNVHRMBAf8EBTADAQH/MA0GCSqG
SIb3DQEBCwUAA0EA
-----END CERTIFICATE-----`
    setPemInput(samplePem)
    setError(null)
  }, [])

  /**
   * DER 파일 다운로드
   */
  const downloadDer = useCallback(() => {
    if (!output || output.includes('-----BEGIN')) {
      setError(t('pemder.error.noDerToDownload'))
      return
    }

    try {
      // Base64를 바이너리로 변환
      const binaryString = atob(output)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Blob 생성 및 다운로드
      const blob = new Blob([bytes], { type: 'application/x-x509-ca-cert' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'certificate.der'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError(t('pemder.error.downloadFailed'))
    }
  }, [output, t])

  return (
    <ToolCard
      title={`🔐 ${t('pemder.title')}`}
      description={t('pemder.description')}
    >
      <div className="space-y-6">
        {/* PEM 입력 섹션 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('pemder.section.pemToDer')}
          </h3>
          <TextAreaWithCopy
            value={pemInput}
            onChange={setPemInput}
            placeholder={t('pemder.pem.placeholder')}
            label={t('pemder.pem.label')}
            rows={8}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePemToDer}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              {t('pemder.actions.pemToDer')}
            </button>
            <button
              onClick={loadSample}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {t('pemder.actions.sample')}
            </button>
          </div>
        </div>

        {/* DER 입력 섹션 */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('pemder.section.derToPem')}
          </h3>
          <TextAreaWithCopy
            value={derInput}
            onChange={setDerInput}
            placeholder={t('pemder.der.placeholder')}
            label={t('pemder.der.label')}
            rows={4}
          />
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedType.label}
              onChange={(e) => {
                const type = PEM_TYPES.find(t => t.label === e.target.value)
                if (type) setSelectedType(type)
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {PEM_TYPES.map(type => (
                <option key={type.label} value={type.label}>{type.label}</option>
              ))}
            </select>
            <button
              onClick={handleDerToPem}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              {t('pemder.actions.derToPem')}
            </button>
          </div>
        </div>

        {/* 결과 출력 */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {detectedType && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {t('pemder.detected')}: <span className="font-semibold">{detectedType}</span>
              </p>
            </div>
          )}

          <TextAreaWithCopy
            value={output}
            readOnly
            placeholder={t('pemder.output.placeholder')}
            label={t('pemder.output.label')}
            rows={8}
          />

          <div className="flex flex-wrap gap-2">
            {output && !output.includes('-----BEGIN') && (
              <button
                onClick={downloadDer}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                {t('pemder.actions.downloadDer')}
              </button>
            )}
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              {t('pemder.actions.clear')}
            </button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* 정보 섹션 */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            {t('pemder.info.title')}
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li>{t('pemder.info.item1')}</li>
            <li>{t('pemder.info.item2')}</li>
            <li>{t('pemder.info.item3')}</li>
            <li>{t('pemder.info.item4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
