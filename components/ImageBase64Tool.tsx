'use client'

import { useState, useRef, DragEvent } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ImageBase64Tool() {
  const { t } = useLanguage()
  const [base64, setBase64] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [mimeType, setMimeType] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError('')

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t('imageBase64.notImage'))
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError(t('imageBase64.tooLarge'))
      return
    }

    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(2) + ' KB')
    setMimeType(file.type)

    const reader = new FileReader()

    reader.onload = (e) => {
      const result = e.target?.result as string
      setBase64(result)
      setImagePreview(result)
    }

    reader.onerror = () => {
      setError(t('imageBase64.readError'))
    }

    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClear = () => {
    setBase64('')
    setImagePreview(null)
    setFileName('')
    setFileSize('')
    setMimeType('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  const getDataUrlOnly = () => {
    return base64.split(',')[1] || ''
  }

  return (
    <ToolCard
      title={t('tool.imageBase64')}
      description={t('imageBase64.description')}
    >
      <div className="space-y-4">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClickUpload}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="space-y-2">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {t('imageBase64.dropZone')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('imageBase64.clickToUpload')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t('imageBase64.supportedFormats')}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Image Info */}
        {fileName && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('imageBase64.fileName')}:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{fileName}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('imageBase64.fileSize')}:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{fileSize}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600 dark:text-gray-400">{t('imageBase64.mimeType')}:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{mimeType}</span>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview */}
        {imagePreview && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('imageBase64.preview')}
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-auto max-h-96 mx-auto"
              />
            </div>
          </div>
        )}

        {/* Base64 Output */}
        {base64 && (
          <>
            <TextAreaWithCopy
              value={base64}
              readOnly
              label={t('imageBase64.fullDataUrl')}
              rows={6}
            />

            <TextAreaWithCopy
              value={getDataUrlOnly()}
              readOnly
              label={t('imageBase64.base64Only')}
              rows={6}
            />

            <button
              onClick={handleClear}
              className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              {t('common.clear')}
            </button>
          </>
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {t('imageBase64.infoTitle')}
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>{t('imageBase64.info1')}</li>
            <li>{t('imageBase64.info2')}</li>
            <li>{t('imageBase64.info3')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
