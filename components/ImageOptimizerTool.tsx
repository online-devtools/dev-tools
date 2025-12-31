'use client'

import { useState, useCallback, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolCard from './ToolCard'
// browser-image-compression: 클라이언트 사이드 이미지 압축 라이브러리
import imageCompression from 'browser-image-compression'

/**
 * Image Optimizer 컴포넌트
 *
 * 클라이언트 사이드에서 이미지를 압축하고 최적화합니다.
 * 서버로 업로드하지 않으므로 프라이버시가 보장됩니다.
 *
 * 기능:
 * - 이미지 압축 (품질 조절)
 * - 리사이즈 (최대 너비/높이)
 * - 포맷 변환 (WebP, JPEG, PNG)
 * - 압축률 및 크기 비교 표시
 */

// 지원하는 출력 포맷
type OutputFormat = 'webp' | 'jpeg' | 'png'

interface ImageInfo {
  file: File
  preview: string
  width: number
  height: number
}

interface OptimizedImage {
  file: File
  preview: string
  width: number
  height: number
  compressionRatio: number
}

export default function ImageOptimizerTool() {
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 원본 이미지 정보
  const [originalImage, setOriginalImage] = useState<ImageInfo | null>(null)
  // 최적화된 이미지 정보
  const [optimizedImage, setOptimizedImage] = useState<OptimizedImage | null>(null)
  // 압축 옵션
  const [maxSizeMB, setMaxSizeMB] = useState(1)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [quality, setQuality] = useState(0.8)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('webp')
  // 상태
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 파일 선택 핸들러
   * 선택된 이미지 파일을 읽어 미리보기 생성
   */
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setOptimizedImage(null)

    const file = e.target.files?.[0]
    if (!file) return

    // 이미지 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setError(t('imageOptimizer.error.notImage'))
      return
    }

    // 파일 크기 제한 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError(t('imageOptimizer.error.tooLarge'))
      return
    }

    try {
      // 이미지 치수 가져오기
      const dimensions = await getImageDimensions(file)
      const preview = URL.createObjectURL(file)

      setOriginalImage({
        file,
        preview,
        width: dimensions.width,
        height: dimensions.height,
      })
    } catch {
      setError(t('imageOptimizer.error.readFailed'))
    }
  }, [t])

  /**
   * 이미지 파일에서 너비/높이 추출
   */
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
        URL.revokeObjectURL(img.src)
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * 이미지 최적화 실행
   */
  const handleOptimize = useCallback(async () => {
    if (!originalImage) return

    setIsProcessing(true)
    setError(null)

    try {
      // browser-image-compression 옵션 설정
      const options = {
        maxSizeMB,
        maxWidthOrHeight: maxWidth,
        initialQuality: quality,
        useWebWorker: true, // 웹 워커 사용으로 UI 블로킹 방지
        fileType: `image/${outputFormat}` as const,
      }

      // 압축 실행
      const compressedFile = await imageCompression(originalImage.file, options)

      // 압축된 이미지 치수 가져오기
      const dimensions = await getImageDimensions(compressedFile)
      const preview = URL.createObjectURL(compressedFile)

      // 압축률 계산
      const compressionRatio = ((1 - compressedFile.size / originalImage.file.size) * 100)

      setOptimizedImage({
        file: compressedFile,
        preview,
        width: dimensions.width,
        height: dimensions.height,
        compressionRatio,
      })
    } catch (err) {
      console.error('Compression error:', err)
      setError(t('imageOptimizer.error.compressionFailed'))
    } finally {
      setIsProcessing(false)
    }
  }, [originalImage, maxSizeMB, maxWidth, quality, outputFormat, t])

  /**
   * 최적화된 이미지 다운로드
   */
  const handleDownload = useCallback(() => {
    if (!optimizedImage) return

    const a = document.createElement('a')
    a.href = optimizedImage.preview
    const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat
    a.download = `optimized.${extension}`
    a.click()
  }, [optimizedImage, outputFormat])

  /**
   * 초기화
   */
  const handleClear = useCallback(() => {
    if (originalImage?.preview) URL.revokeObjectURL(originalImage.preview)
    if (optimizedImage?.preview) URL.revokeObjectURL(optimizedImage.preview)

    setOriginalImage(null)
    setOptimizedImage(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [originalImage, optimizedImage])

  /**
   * 파일 크기 포맷팅 (bytes → KB/MB)
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  /**
   * 드래그 앤 드롭 핸들러
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && fileInputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      fileInputRef.current.files = dt.files
      const event = new Event('change', { bubbles: true })
      fileInputRef.current.dispatchEvent(event)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  return (
    <ToolCard
      title={`🖼️ ${t('imageOptimizer.title')}`}
      description={t('imageOptimizer.description')}
    >
      <div className="space-y-6">
        {/* 파일 업로드 영역 */}
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="space-y-2">
            <p className="text-4xl">📁</p>
            <p className="text-gray-600 dark:text-gray-400">
              {t('imageOptimizer.dropzone.text')}
            </p>
            <p className="text-sm text-gray-500">
              {t('imageOptimizer.dropzone.hint')}
            </p>
          </div>
        </div>

        {/* 원본 이미지 정보 */}
        {originalImage && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {t('imageOptimizer.original.title')}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* 미리보기 */}
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={originalImage.preview}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              {/* 정보 */}
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600 dark:text-gray-400">{t('imageOptimizer.info.filename')}: </span>
                  <span className="font-mono">{originalImage.file.name}</span>
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">{t('imageOptimizer.info.size')}: </span>
                  <span className="font-semibold">{formatFileSize(originalImage.file.size)}</span>
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">{t('imageOptimizer.info.dimensions')}: </span>
                  <span className="font-mono">{originalImage.width} × {originalImage.height}</span>
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">{t('imageOptimizer.info.type')}: </span>
                  <span className="font-mono">{originalImage.file.type}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 압축 옵션 */}
        {originalImage && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {t('imageOptimizer.options.title')}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* 최대 파일 크기 */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('imageOptimizer.options.maxSize')}
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                />
              </div>

              {/* 최대 너비 */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('imageOptimizer.options.maxWidth')}
                </label>
                <input
                  type="number"
                  min="100"
                  max="4096"
                  step="100"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                />
              </div>

              {/* 품질 */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('imageOptimizer.options.quality')} ({Math.round(quality * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 출력 포맷 */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('imageOptimizer.options.format')}
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                >
                  <option value="webp">WebP (권장)</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                </select>
              </div>
            </div>

            {/* 최적화 버튼 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleOptimize}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isProcessing ? t('imageOptimizer.actions.processing') : t('imageOptimizer.actions.optimize')}
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
              >
                {t('imageOptimizer.actions.clear')}
              </button>
            </div>
          </div>
        )}

        {/* 최적화 결과 */}
        {optimizedImage && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-4">
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              {t('imageOptimizer.result.title')}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* 미리보기 */}
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={optimizedImage.preview}
                  alt="Optimized"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              {/* 정보 */}
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600 dark:text-gray-400">{t('imageOptimizer.info.size')}: </span>
                  <span className="font-semibold">{formatFileSize(optimizedImage.file.size)}</span>
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">{t('imageOptimizer.info.dimensions')}: </span>
                  <span className="font-mono">{optimizedImage.width} × {optimizedImage.height}</span>
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">{t('imageOptimizer.result.saved')}: </span>
                  <span className={`font-semibold ${optimizedImage.compressionRatio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {optimizedImage.compressionRatio > 0 ? '-' : '+'}{Math.abs(optimizedImage.compressionRatio).toFixed(1)}%
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(originalImage!.file.size)} → {formatFileSize(optimizedImage.file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              {t('imageOptimizer.actions.download')}
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
            {t('imageOptimizer.info.title')}
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li>{t('imageOptimizer.info.item1')}</li>
            <li>{t('imageOptimizer.info.item2')}</li>
            <li>{t('imageOptimizer.info.item3')}</li>
            <li>{t('imageOptimizer.info.item4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
