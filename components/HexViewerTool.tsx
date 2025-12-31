'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolCard from './ToolCard'

/**
 * Hex Viewer 컴포넌트
 *
 * 바이너리 파일을 16진수(Hex) 형식으로 표시하는 도구입니다.
 * 파일 분석, 바이너리 데이터 검사, 파일 시그니처 확인 등에 사용됩니다.
 *
 * 기능:
 * - 파일 업로드 후 16진수 뷰 표시
 * - ASCII 문자 동시 표시
 * - 오프셋(주소) 표시
 * - 바이트 검색
 * - 파일 시그니처 감지
 */

// 파일 매직 바이트 (시그니처) 정의
const FILE_SIGNATURES: Record<string, { magic: number[]; name: string }> = {
  PDF: { magic: [0x25, 0x50, 0x44, 0x46], name: 'PDF Document' },
  PNG: { magic: [0x89, 0x50, 0x4E, 0x47], name: 'PNG Image' },
  JPEG: { magic: [0xFF, 0xD8, 0xFF], name: 'JPEG Image' },
  GIF: { magic: [0x47, 0x49, 0x46, 0x38], name: 'GIF Image' },
  ZIP: { magic: [0x50, 0x4B, 0x03, 0x04], name: 'ZIP Archive' },
  RAR: { magic: [0x52, 0x61, 0x72, 0x21], name: 'RAR Archive' },
  '7Z': { magic: [0x37, 0x7A, 0xBC, 0xAF], name: '7-Zip Archive' },
  EXE: { magic: [0x4D, 0x5A], name: 'Windows Executable' },
  ELF: { magic: [0x7F, 0x45, 0x4C, 0x46], name: 'Linux Executable (ELF)' },
  MP3: { magic: [0x49, 0x44, 0x33], name: 'MP3 Audio' },
  MP4: { magic: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], name: 'MP4 Video' },
  WASM: { magic: [0x00, 0x61, 0x73, 0x6D], name: 'WebAssembly' },
  SQLITE: { magic: [0x53, 0x51, 0x4C, 0x69, 0x74, 0x65], name: 'SQLite Database' },
  GZIP: { magic: [0x1F, 0x8B], name: 'GZIP Compressed' },
  TAR: { magic: [0x75, 0x73, 0x74, 0x61, 0x72], name: 'TAR Archive' }, // at offset 257
}

// 표시할 바이트 수 (한 줄에 16바이트)
const BYTES_PER_LINE = 16

export default function HexViewerTool() {
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 파일 데이터 (Uint8Array)
  const [fileData, setFileData] = useState<Uint8Array | null>(null)
  // 파일 정보
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  // 감지된 파일 타입
  const [detectedType, setDetectedType] = useState<string | null>(null)
  // 현재 페이지 (대용량 파일 처리용)
  const [currentPage, setCurrentPage] = useState(0)
  // 검색어
  const [searchHex, setSearchHex] = useState('')
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)
  // 에러 메시지
  const [error, setError] = useState<string | null>(null)

  // 한 페이지에 표시할 바이트 수 (16바이트 × 32줄 = 512바이트)
  const BYTES_PER_PAGE = BYTES_PER_LINE * 32

  /**
   * 파일 시그니처 감지
   * 파일의 처음 몇 바이트를 확인하여 파일 타입 추정
   */
  const detectFileType = useCallback((data: Uint8Array): string | null => {
    for (const [type, { magic, name }] of Object.entries(FILE_SIGNATURES)) {
      // 특수한 경우: TAR는 오프셋 257에서 시작
      if (type === 'TAR' && data.length > 262) {
        const tarCheck = data.slice(257, 262)
        if (magic.every((byte, i) => byte === tarCheck[i])) {
          return name
        }
        continue
      }

      // 일반적인 경우: 파일 시작 부분에서 매직 바이트 확인
      if (data.length >= magic.length) {
        const match = magic.every((byte, i) => byte === data[i])
        if (match) return name
      }
    }
    return null
  }, [])

  /**
   * 파일 선택 핸들러
   */
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setSearchResults([])
    setSearchHex('')
    setCurrentPage(0)

    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(t('hexViewer.error.tooLarge'))
      return
    }

    try {
      // 파일을 ArrayBuffer로 읽기
      const buffer = await file.arrayBuffer()
      const data = new Uint8Array(buffer)

      setFileData(data)
      setFileName(file.name)
      setFileSize(file.size)

      // 파일 타입 감지
      const type = detectFileType(data)
      setDetectedType(type)
    } catch {
      setError(t('hexViewer.error.readFailed'))
    }
  }, [detectFileType, t])

  /**
   * 바이트 값을 2자리 16진수 문자열로 변환
   */
  const toHex = (byte: number): string => {
    return byte.toString(16).padStart(2, '0').toUpperCase()
  }

  /**
   * 바이트 값을 ASCII 문자로 변환 (출력 불가능한 문자는 . 으로 표시)
   */
  const toAscii = (byte: number): string => {
    return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.'
  }

  /**
   * 오프셋을 8자리 16진수로 포맷
   */
  const formatOffset = (offset: number): string => {
    return offset.toString(16).padStart(8, '0').toUpperCase()
  }

  /**
   * 현재 페이지의 Hex 라인 생성
   */
  const hexLines = useMemo(() => {
    if (!fileData) return []

    const startOffset = currentPage * BYTES_PER_PAGE
    const endOffset = Math.min(startOffset + BYTES_PER_PAGE, fileData.length)
    const lines: { offset: number; hex: string[]; ascii: string }[] = []

    for (let i = startOffset; i < endOffset; i += BYTES_PER_LINE) {
      const lineBytes = fileData.slice(i, Math.min(i + BYTES_PER_LINE, fileData.length))
      const hex = Array.from(lineBytes).map(toHex)
      const ascii = Array.from(lineBytes).map(toAscii).join('')

      lines.push({
        offset: i,
        hex,
        ascii,
      })
    }

    return lines
  }, [fileData, currentPage, BYTES_PER_PAGE])

  /**
   * 16진수 패턴 검색
   */
  const handleSearch = useCallback(() => {
    if (!fileData || !searchHex.trim()) return

    setError(null)
    setSearchResults([])

    // 검색어 파싱 (공백으로 구분된 16진수 값)
    const hexPattern = searchHex.trim().split(/\s+/)
    const bytes: number[] = []

    for (const hex of hexPattern) {
      const value = parseInt(hex, 16)
      if (isNaN(value) || value < 0 || value > 255) {
        setError(t('hexViewer.error.invalidSearch'))
        return
      }
      bytes.push(value)
    }

    if (bytes.length === 0) return

    // 패턴 검색
    const results: number[] = []
    for (let i = 0; i <= fileData.length - bytes.length; i++) {
      let match = true
      for (let j = 0; j < bytes.length; j++) {
        if (fileData[i + j] !== bytes[j]) {
          match = false
          break
        }
      }
      if (match) results.push(i)
    }

    setSearchResults(results)
    setCurrentSearchIndex(0)

    // 첫 번째 결과로 페이지 이동
    if (results.length > 0) {
      setCurrentPage(Math.floor(results[0] / BYTES_PER_PAGE))
    }
  }, [fileData, searchHex, BYTES_PER_PAGE, t])

  /**
   * 다음/이전 검색 결과로 이동
   */
  const navigateSearchResult = useCallback((direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return

    let newIndex = currentSearchIndex
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length
    } else {
      newIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length
    }

    setCurrentSearchIndex(newIndex)
    setCurrentPage(Math.floor(searchResults[newIndex] / BYTES_PER_PAGE))
  }, [searchResults, currentSearchIndex, BYTES_PER_PAGE])

  /**
   * 초기화
   */
  const handleClear = useCallback(() => {
    setFileData(null)
    setFileName('')
    setFileSize(0)
    setDetectedType(null)
    setCurrentPage(0)
    setSearchHex('')
    setSearchResults([])
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  /**
   * 파일 크기 포맷팅
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  // 총 페이지 수
  const totalPages = fileData ? Math.ceil(fileData.length / BYTES_PER_PAGE) : 0

  /**
   * 특정 오프셋이 검색 결과에 포함되는지 확인
   */
  const isHighlighted = useCallback((offset: number): boolean => {
    return searchResults.some(result => offset >= result && offset < result + searchHex.trim().split(/\s+/).length)
  }, [searchResults, searchHex])

  return (
    <ToolCard
      title={`🔬 ${t('hexViewer.title')}`}
      description={t('hexViewer.description')}
    >
      <div className="space-y-6">
        {/* 파일 업로드 */}
        <div className="flex flex-wrap items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
          />
          {fileData && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors text-sm"
            >
              {t('hexViewer.actions.clear')}
            </button>
          )}
        </div>

        {/* 파일 정보 */}
        {fileData && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('hexViewer.info.filename')}: </span>
                <span className="font-mono">{fileName}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('hexViewer.info.size')}: </span>
                <span className="font-semibold">{formatFileSize(fileSize)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('hexViewer.info.bytes')}: </span>
                <span className="font-mono">{fileSize.toLocaleString()}</span>
              </div>
              {detectedType && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('hexViewer.info.type')}: </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{detectedType}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 검색 */}
        {fileData && (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchHex}
              onChange={(e) => setSearchHex(e.target.value)}
              placeholder={t('hexViewer.search.placeholder')}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-mono"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
            >
              {t('hexViewer.actions.search')}
            </button>
            {searchResults.length > 0 && (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {currentSearchIndex + 1} / {searchResults.length}
                </span>
                <button
                  onClick={() => navigateSearchResult('prev')}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
                >
                  ◀
                </button>
                <button
                  onClick={() => navigateSearchResult('next')}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
                >
                  ▶
                </button>
              </>
            )}
          </div>
        )}

        {/* Hex 뷰 */}
        {fileData && (
          <div className="overflow-x-auto">
            <div className="font-mono text-xs bg-gray-900 text-gray-100 p-4 rounded-lg min-w-[700px]">
              {/* 헤더 */}
              <div className="flex border-b border-gray-700 pb-2 mb-2 text-gray-500">
                <span className="w-20">Offset</span>
                <span className="flex-1">
                  {Array.from({ length: BYTES_PER_LINE }, (_, i) => toHex(i)).join(' ')}
                </span>
                <span className="w-40 pl-4">ASCII</span>
              </div>

              {/* 데이터 행 */}
              {hexLines.map((line, idx) => (
                <div key={idx} className="flex hover:bg-gray-800">
                  {/* 오프셋 */}
                  <span className="w-20 text-blue-400">{formatOffset(line.offset)}</span>

                  {/* Hex 값 */}
                  <span className="flex-1">
                    {line.hex.map((hex, i) => {
                      const byteOffset = line.offset + i
                      const highlighted = isHighlighted(byteOffset)
                      return (
                        <span
                          key={i}
                          className={`${highlighted ? 'bg-yellow-500 text-black' : ''} ${i === 7 ? 'mr-1' : ''}`}
                        >
                          {hex}{i < line.hex.length - 1 ? ' ' : ''}
                        </span>
                      )
                    })}
                    {/* 마지막 줄 패딩 */}
                    {line.hex.length < BYTES_PER_LINE && (
                      <span className="text-gray-700">
                        {'   '.repeat(BYTES_PER_LINE - line.hex.length)}
                      </span>
                    )}
                  </span>

                  {/* ASCII */}
                  <span className="w-40 pl-4 text-green-400">{line.ascii}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 페이지네이션 */}
        {fileData && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 text-sm"
            >
              ⏮
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 text-sm"
            >
              ◀
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('hexViewer.page')} {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 text-sm"
            >
              ▶
            </button>
            <button
              onClick={() => setCurrentPage(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 text-sm"
            >
              ⏭
            </button>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* 정보 섹션 */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            {t('hexViewer.info.title')}
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li>{t('hexViewer.info.item1')}</li>
            <li>{t('hexViewer.info.item2')}</li>
            <li>{t('hexViewer.info.item3')}</li>
            <li>{t('hexViewer.info.item4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
