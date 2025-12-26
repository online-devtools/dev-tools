'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { SamlError, decodeAndParseSaml } from '@/utils/saml'

export default function SamlDebuggerTool() {
  const { t } = useLanguage()
  // Store raw input and parsed output for the debugging view.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [issuer, setIssuer] = useState('')
  const [nameId, setNameId] = useState('')
  const [audience, setAudience] = useState('')
  const [attributes, setAttributes] = useState<Record<string, string[]>>({})
  const [error, setError] = useState('')

  const handleDecode = () => {
    try {
      setError('')
      // Decode base64 (or raw XML) input and parse key SAML fields.
      const result = decodeAndParseSaml(input)
      setOutput(result.rawXml)
      setIssuer(result.issuer ?? '')
      setNameId(result.nameId ?? '')
      setAudience(result.audience ?? '')
      setAttributes(result.attributes)
    } catch (err) {
      if (err instanceof SamlError) {
        if (err.code === 'empty') {
          setError(t('saml.error.empty'))
        } else {
          setError(t('saml.error.invalid'))
        }
      } else {
        setError(t('saml.error.unknown'))
      }
      setOutput('')
      setIssuer('')
      setNameId('')
      setAudience('')
      setAttributes({})
    }
  }

  const handleClear = () => {
    // Clear all fields to start a new debug session.
    setInput('')
    setOutput('')
    setIssuer('')
    setNameId('')
    setAudience('')
    setAttributes({})
    setError('')
  }

  return (
    <ToolCard
      title={`🧾 ${t('saml.title')}`}
      description={t('saml.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('saml.input.label')}
          placeholder={t('saml.input.placeholder')}
          rows={10}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDecode}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('saml.actions.decode')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('saml.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!error && output && (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3 text-sm">
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-gray-500 dark:text-gray-400">{t('saml.result.issuer')}</div>
                <div className="font-mono text-gray-800 dark:text-gray-100">{issuer || '-'}</div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-gray-500 dark:text-gray-400">{t('saml.result.nameId')}</div>
                <div className="font-mono text-gray-800 dark:text-gray-100">{nameId || '-'}</div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-gray-500 dark:text-gray-400">{t('saml.result.audience')}</div>
                <div className="font-mono text-gray-800 dark:text-gray-100">{audience || '-'}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('saml.result.attributes')}
              </h3>
              {Object.keys(attributes).length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('saml.result.noAttributes')}
                </div>
              )}
              {Object.entries(attributes).map(([key, values]) => (
                <div key={key} className="text-sm text-gray-700 dark:text-gray-200">
                  <span className="font-mono">{key}</span>: {values.join(', ')}
                </div>
              ))}
            </div>

            <TextAreaWithCopy
              value={output}
              readOnly
              label={t('saml.output.label')}
              placeholder={t('saml.output.placeholder')}
              rows={10}
            />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
