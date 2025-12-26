'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { extractPdfMetadata } from '@/utils/pdfMetadata'

export default function PdfMetadataTool() {
  const { t } = useLanguage()
  // Store parsed metadata and raw JSON output for copy.
  const [metadata, setMetadata] = useState<Record<string, string>>({})
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    try {
      setError('')
      setMetadata({})
      setOutput('')

      // Read the PDF as ArrayBuffer so we can scan for Info dictionary text.
      const buffer = await file.arrayBuffer()
      const decoder = new TextDecoder('latin1')
      const text = decoder.decode(buffer)
      const result = extractPdfMetadata(text)

      const filtered = Object.entries(result)
        .filter(([, value]) => Boolean(value))
        .reduce<Record<string, string>>((acc, [key, value]) => {
          acc[key] = value as string
          return acc
        }, {})

      setMetadata(filtered)
      setOutput(JSON.stringify(filtered, null, 2))
    } catch (err) {
      setError(t('pdfMetadata.error.failed'))
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    handleFile(file)
  }

  const handleClear = () => {
    // Reset all output so the user can load another PDF.
    setMetadata({})
    setOutput('')
    setError('')
  }

  return (
    <ToolCard
      title={`📄 ${t('pdfMetadata.title')}`}
      description={t('pdfMetadata.description')}
    >
      <div className="space-y-4">
        <div>
          <label className="px-4 py-2 inline-flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-sm text-gray-700 dark:text-gray-300">
            📄 {t('pdfMetadata.input.label')}
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {Object.keys(metadata).length === 0 && !error && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('pdfMetadata.results.empty')}
          </div>
        )}

        {Object.keys(metadata).length > 0 && (
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-gray-500 dark:text-gray-400">{key}</div>
                <div className="font-mono text-gray-800 dark:text-gray-100">{value}</div>
              </div>
            ))}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('pdfMetadata.output.label')}
          placeholder={t('pdfMetadata.output.placeholder')}
          rows={6}
        />

        <button
          onClick={handleClear}
          className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {t('pdfMetadata.actions.clear')}
        </button>
      </div>
    </ToolCard>
  )
}
