'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
// MessagePack 라이브러리: 바이너리 직렬화 포맷으로 JSON보다 작고 빠름
import { encode, decode } from '@msgpack/msgpack'

/**
 * MessagePackTool 컴포넌트
 *
 * MessagePack은 JSON과 유사한 데이터 구조를 바이너리로 직렬화하는 포맷입니다.
 * JSON보다 작은 크기와 빠른 파싱 속도가 특징입니다.
 *
 * 이 도구는 다음 기능을 제공합니다:
 * 1. JSON → MessagePack 인코딩 (Base64 출력)
 * 2. MessagePack (Base64) → JSON 디코딩
 * 3. 압축률 표시
 */
export default function MessagePackTool() {
  const { t } = useLanguage()

  // 입력 JSON 문자열 상태
  const [jsonInput, setJsonInput] = useState('')
  // MessagePack Base64 인코딩 결과
  const [msgpackOutput, setMsgpackOutput] = useState('')
  // 디코딩된 JSON 결과
  const [decodedOutput, setDecodedOutput] = useState('')
  // 에러 메시지
  const [error, setError] = useState<string | null>(null)
  // 압축률 정보 (원본 크기, 압축 크기, 절감률)
  const [stats, setStats] = useState<{ original: number; compressed: number; ratio: number } | null>(null)

  /**
   * JSON 문자열을 MessagePack으로 인코딩
   * 결과는 브라우저에서 복사 가능하도록 Base64로 변환하여 출력
   */
  const handleEncode = useCallback(() => {
    setError(null)
    setStats(null)

    // 빈 입력 체크
    if (!jsonInput.trim()) {
      setError(t('msgpack.error.empty'))
      return
    }

    try {
      // 1. JSON 문자열을 JavaScript 객체로 파싱
      const data = JSON.parse(jsonInput)

      // 2. MessagePack 바이너리로 인코딩 (Uint8Array 반환)
      const encoded = encode(data)

      // 3. Uint8Array를 Base64 문자열로 변환
      //    - btoa()는 binary string만 받으므로 각 바이트를 문자로 변환
      const base64 = btoa(String.fromCharCode(...encoded))

      setMsgpackOutput(base64)

      // 압축률 계산: JSON 문자열 길이 vs MessagePack 바이트 길이
      const originalSize = new TextEncoder().encode(jsonInput).length
      const compressedSize = encoded.length
      const ratio = ((1 - compressedSize / originalSize) * 100)

      setStats({
        original: originalSize,
        compressed: compressedSize,
        ratio: ratio
      })
    } catch {
      // JSON 파싱 실패시 에러 메시지 표시
      setError(t('msgpack.error.invalidJson'))
    }
  }, [jsonInput, t])

  /**
   * MessagePack Base64 문자열을 JSON으로 디코딩
   */
  const handleDecode = useCallback(() => {
    setError(null)
    setStats(null)

    // 빈 입력 체크
    if (!msgpackOutput.trim()) {
      setError(t('msgpack.error.emptyMsgpack'))
      return
    }

    try {
      // 1. Base64 문자열을 binary string으로 변환
      const binaryString = atob(msgpackOutput)

      // 2. Binary string을 Uint8Array로 변환
      //    - charCodeAt으로 각 문자의 바이트 값을 추출
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // 3. MessagePack 디코딩 (바이너리 → JavaScript 객체)
      const decoded = decode(bytes)

      // 4. JavaScript 객체를 포맷된 JSON 문자열로 변환
      setDecodedOutput(JSON.stringify(decoded, null, 2))
    } catch {
      // Base64 또는 MessagePack 디코딩 실패
      setError(t('msgpack.error.invalidMsgpack'))
    }
  }, [msgpackOutput, t])

  /**
   * 모든 상태 초기화
   */
  const handleClear = useCallback(() => {
    setJsonInput('')
    setMsgpackOutput('')
    setDecodedOutput('')
    setError(null)
    setStats(null)
  }, [])

  /**
   * 샘플 JSON 데이터 로드
   * MessagePack의 장점을 보여줄 수 있는 중첩 구조 예시
   */
  const loadSample = useCallback(() => {
    const sample = {
      user: {
        id: 12345,
        name: "John Doe",
        email: "john@example.com",
        active: true
      },
      permissions: ["read", "write", "admin"],
      metadata: {
        createdAt: "2024-01-15T09:30:00Z",
        version: 2.1
      }
    }
    setJsonInput(JSON.stringify(sample, null, 2))
    setError(null)
  }, [])

  return (
    <ToolCard
      title={`📦 ${t('msgpack.title')}`}
      description={t('msgpack.description')}
    >
      <div className="space-y-4">
        {/* JSON 입력 영역 */}
        <TextAreaWithCopy
          value={jsonInput}
          onChange={setJsonInput}
          placeholder={t('msgpack.input.placeholder')}
          label={t('msgpack.input.label')}
          rows={8}
        />

        {/* 인코딩 버튼 그룹 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleEncode}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            {t('msgpack.actions.encode')}
          </button>
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {t('msgpack.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            {t('msgpack.actions.clear')}
          </button>
        </div>

        {/* 압축률 통계 표시 */}
        {stats && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('msgpack.stats.original')}: </span>
                <span className="font-mono font-semibold">{stats.original} bytes</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('msgpack.stats.compressed')}: </span>
                <span className="font-mono font-semibold">{stats.compressed} bytes</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('msgpack.stats.ratio')}: </span>
                <span className={`font-mono font-semibold ${stats.ratio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.ratio > 0 ? '-' : '+'}{Math.abs(stats.ratio).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MessagePack Base64 출력 영역 */}
        <TextAreaWithCopy
          value={msgpackOutput}
          onChange={setMsgpackOutput}
          placeholder={t('msgpack.output.placeholder')}
          label={t('msgpack.output.label')}
          rows={4}
        />

        {/* 디코딩 버튼 */}
        <button
          onClick={handleDecode}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          {t('msgpack.actions.decode')}
        </button>

        {/* 디코딩된 JSON 출력 */}
        <TextAreaWithCopy
          value={decodedOutput}
          readOnly
          placeholder={t('msgpack.decoded.placeholder')}
          label={t('msgpack.decoded.label')}
          rows={8}
        />

        {/* 에러 메시지 표시 */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* MessagePack 정보 섹션 */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            {t('msgpack.info.title')}
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li>{t('msgpack.info.item1')}</li>
            <li>{t('msgpack.info.item2')}</li>
            <li>{t('msgpack.info.item3')}</li>
            <li>{t('msgpack.info.item4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
