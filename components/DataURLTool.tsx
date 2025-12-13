'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DataURLTool() {
  const { t } = useLanguage()
  // 파일→데이터URL, 데이터URL→파일 변환을 위한 상태입니다.
  const [dataUrl, setDataUrl] = useState('')
  const [fileName, setFileName] = useState('download')
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    try {
      setError('')
      const reader = new FileReader()
      reader.onload = () => setDataUrl(reader.result as string)
      reader.onerror = () => setError(t('dataUrl.error.read'))
      reader.readAsDataURL(file)
      setFileName(file.name)
    } catch {
      setError(t('dataUrl.error.read'))
    }
  }

  const handleDownload = () => {
    try {
      if (!dataUrl.startsWith('data:')) {
        setError(t('dataUrl.error.invalid'))
        return
      }
      setError('')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = fileName || 'download'
      link.click()
    } catch {
      setError(t('dataUrl.error.download'))
    }
  }

  return (
    <ToolCard
      title={`🖼️ ${t('dataUrl.title')}`}
      description={t('dataUrl.description')}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('dataUrl.input.file')}
          </label>
          <input
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="w-full"
          />
        </div>

        <TextAreaWithCopy
          value={dataUrl}
          onChange={setDataUrl}
          label={t('dataUrl.input.dataUrl')}
          placeholder={t('dataUrl.input.placeholder')}
          rows={6}
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleDownload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('dataUrl.actions.download')}
          </button>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={t('dataUrl.actions.filename')}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
