'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { HashAlgorithm, hashArrayBuffer } from '@/utils/fileHash'

const ALGORITHMS: HashAlgorithm[] = ['SHA-256', 'SHA-1', 'SHA-384', 'SHA-512']

export default function FileHashTool() {
  const { t } = useLanguage()
  // Store selected file, selected algorithm, and output hash.
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256')
  const [hash, setHash] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFile = async (file: File) => {
    try {
      setError('')
      setIsLoading(true)
      setFileName(file.name)
      setFileSize(file.size)

      // Read the file as ArrayBuffer so it can be hashed by Web Crypto.
      const buffer = await file.arrayBuffer()
      const digest = await hashArrayBuffer(buffer, algorithm, 'hex')
      setHash(digest)
    } catch (err) {
      setError(t('fileHash.error.failed'))
      setHash('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    handleFile(file)
  }

  const handleClear = () => {
    // Reset file metadata and computed hash.
    setFileName('')
    setFileSize(0)
    setHash('')
    setError('')
    setIsLoading(false)
  }

  return (
    <ToolCard
      title={`#️⃣ ${t('fileHash.title')}`}
      description={t('fileHash.description')}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('fileHash.algorithm.label')}
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {ALGORITHMS.map((algo) => (
              <option key={algo} value={algo}>
                {algo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="px-4 py-2 inline-flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-sm text-gray-700 dark:text-gray-300">
            📁 {t('fileHash.input.label')}
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {fileName && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('fileHash.fileInfo', { name: fileName, size: fileSize })}
          </div>
        )}

        {isLoading && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('fileHash.loading')}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={hash}
          readOnly
          label={t('fileHash.output.label')}
          placeholder={t('fileHash.output.placeholder')}
          rows={3}
        />

        <button
          onClick={handleClear}
          className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {t('fileHash.actions.clear')}
        </button>
      </div>
    </ToolCard>
  )
}
