'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { compareDnsRecords, DnsCompareResult, DnsRecord } from '@/utils/dnsCompare'

// Sample DNS records for comparing two environments quickly.
const sampleLeft = [
  'example.com. 300 IN A 1.1.1.1',
  'example.com. 300 IN MX 10 mail.example.com.',
  'www.example.com. 300 IN CNAME example.com.',
].join('\n')

const sampleRight = [
  'example.com. 300 IN A 1.1.1.1',
  'example.com. 300 IN A 2.2.2.2',
  'api.example.com. 300 IN A 3.3.3.3',
].join('\n')

const formatRecord = (record: DnsRecord): string => {
  // Display TTL only when it exists to reduce visual noise.
  const ttl = record.ttl ? `${record.ttl} ` : ''
  return `${record.name} ${ttl}${record.className} ${record.type} ${record.value}`.trim()
}

export default function DnsCompareTool() {
  const { t } = useLanguage()
  // Track both inputs and the comparison result for rendering.
  const [leftInput, setLeftInput] = useState('')
  const [rightInput, setRightInput] = useState('')
  const [result, setResult] = useState<DnsCompareResult | null>(null)

  const handleCompare = () => {
    // Compare locally without network requests.
    const output = compareDnsRecords(leftInput, rightInput)
    setResult(output)
  }

  const handleSample = () => {
    // Populate inputs with a sample diff to preview the output.
    setLeftInput(sampleLeft)
    setRightInput(sampleRight)
    setResult(null)
  }

  const handleClear = () => {
    // Clear inputs and results for a fresh comparison.
    setLeftInput('')
    setRightInput('')
    setResult(null)
  }

  return (
    <ToolCard title={`🌐 ${t('dnsCompare.title')}`} description={t('dnsCompare.description')}>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <TextAreaWithCopy
            value={leftInput}
            onChange={setLeftInput}
            label={t('dnsCompare.input.left')}
            placeholder={t('dnsCompare.input.leftPlaceholder')}
            rows={10}
          />
          <TextAreaWithCopy
            value={rightInput}
            onChange={setRightInput}
            label={t('dnsCompare.input.right')}
            placeholder={t('dnsCompare.input.rightPlaceholder')}
            rows={10}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCompare}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('dnsCompare.actions.compare')}
          </button>
          <button
            onClick={handleSample}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('dnsCompare.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('dnsCompare.actions.clear')}
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-700 dark:text-green-200">
                {t('dnsCompare.summary.common', { count: result.summary.common })}
              </div>
              <div className="rounded-lg border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-200">
                {t('dnsCompare.summary.onlyLeft', { count: result.summary.onlyLeft })}
              </div>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-sm text-blue-700 dark:text-blue-200">
                {t('dnsCompare.summary.onlyRight', { count: result.summary.onlyRight })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {t('dnsCompare.sections.onlyLeft')}
                </div>
                <div className="space-y-2">
                  {result.onlyLeft.length === 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t('dnsCompare.empty')}
                    </div>
                  )}
                  {result.onlyLeft.map((record) => (
                    <div
                      key={`left-${record.raw}`}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-mono text-gray-700 dark:text-gray-200"
                    >
                      {formatRecord(record)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {t('dnsCompare.sections.common')}
                </div>
                <div className="space-y-2">
                  {result.common.length === 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t('dnsCompare.empty')}
                    </div>
                  )}
                  {result.common.map((record) => (
                    <div
                      key={`common-${record.raw}`}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-mono text-gray-700 dark:text-gray-200"
                    >
                      {formatRecord(record)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {t('dnsCompare.sections.onlyRight')}
                </div>
                <div className="space-y-2">
                  {result.onlyRight.length === 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t('dnsCompare.empty')}
                    </div>
                  )}
                  {result.onlyRight.map((record) => (
                    <div
                      key={`right-${record.raw}`}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-mono text-gray-700 dark:text-gray-200"
                    >
                      {formatRecord(record)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
