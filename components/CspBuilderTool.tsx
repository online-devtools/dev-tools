'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { buildCspHeader } from '@/utils/csp'

type DirectiveState = Record<string, string>

const DEFAULT_DIRECTIVES: Array<{ key: string; labelKey: string }> = [
  { key: 'default-src', labelKey: 'csp.directive.defaultSrc' },
  { key: 'script-src', labelKey: 'csp.directive.scriptSrc' },
  { key: 'style-src', labelKey: 'csp.directive.styleSrc' },
  { key: 'img-src', labelKey: 'csp.directive.imgSrc' },
  { key: 'connect-src', labelKey: 'csp.directive.connectSrc' },
  { key: 'font-src', labelKey: 'csp.directive.fontSrc' },
  { key: 'frame-src', labelKey: 'csp.directive.frameSrc' },
]

export default function CspBuilderTool() {
  const { t } = useLanguage()
  // Store directive values as raw strings so users can paste space-separated sources.
  const [directives, setDirectives] = useState<DirectiveState>({
    'default-src': "'self'",
  })
  const [customName, setCustomName] = useState('')
  const [customValue, setCustomValue] = useState('')

  const output = useMemo(() => {
    // Convert raw string values into arrays for the CSP builder utility.
    const directiveEntries: Record<string, string[]> = {}
    Object.entries(directives).forEach(([key, value]) => {
      const sources = value.split(/\s+/).map((item) => item.trim()).filter(Boolean)
      if (sources.length > 0) {
        directiveEntries[key] = sources
      }
    })
    return buildCspHeader(directiveEntries)
  }, [directives])

  const updateDirective = (key: string, value: string) => {
    // Update a single directive without mutating the existing state object.
    setDirectives((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const addCustomDirective = () => {
    const trimmed = customName.trim()
    if (!trimmed) {
      return
    }

    // Add the custom directive so it participates in output generation.
    setDirectives((prev) => ({
      ...prev,
      [trimmed]: customValue,
    }))
    setCustomName('')
    setCustomValue('')
  }

  const clearAll = () => {
    // Reset the builder to a minimal default directive set.
    setDirectives({ 'default-src': "'self'" })
    setCustomName('')
    setCustomValue('')
  }

  return (
    <ToolCard
      title={`🛡️ ${t('csp.title')}`}
      description={t('csp.description')}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          {DEFAULT_DIRECTIVES.map((directive) => (
            <div key={directive.key} className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(directive.labelKey)}
              </label>
              <input
                value={directives[directive.key] ?? ''}
                onChange={(e) => updateDirective(directive.key, e.target.value)}
                placeholder={t('csp.input.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          ))}
        </div>

        <div className="grid gap-2 md:grid-cols-3 items-end">
          <div className="md:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('csp.custom.name')}
            </label>
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="worker-src"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('csp.custom.value')}
            </label>
            <input
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder={t('csp.input.placeholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={addCustomDirective}
            className="md:col-span-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('csp.actions.add')}
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('csp.actions.clear')}
          </button>
        </div>

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('csp.output.label')}
          placeholder={t('csp.output.placeholder')}
          rows={4}
        />
      </div>
    </ToolCard>
  )
}
