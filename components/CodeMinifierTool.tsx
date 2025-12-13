'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type CodeType = 'js' | 'css' | 'html'

export default function CodeMinifierTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [codeType, setCodeType] = useState<CodeType>('js')
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ before: 0, after: 0, reduction: 0 })

  const minifyJS = (code: string): string => {
    let minified = code
    // Remove single-line comments
    minified = minified.replace(/\/\/.*$/gm, '')
    // Remove multi-line comments
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around operators
    minified = minified.replace(/\s*([+\-*/%=<>!&|^~?:,;{}()\[\]])\s*/g, '$1')
    // Remove line breaks and extra spaces
    minified = minified.replace(/\s+/g, ' ')
    // Remove spaces around semicolons
    minified = minified.replace(/\s*;\s*/g, ';')
    // Trim
    return minified.trim()
  }

  const minifyCSS = (code: string): string => {
    let minified = code
    // Remove comments
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around special characters
    minified = minified.replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove line breaks and extra spaces
    minified = minified.replace(/\s+/g, ' ')
    // Remove spaces around semicolons
    minified = minified.replace(/\s*;\s*/g, ';')
    // Remove last semicolon in block
    minified = minified.replace(/;}/g, '}')
    // Trim
    return minified.trim()
  }

  const minifyHTML = (code: string): string => {
    let minified = code
    // Remove HTML comments
    minified = minified.replace(/<!--[\s\S]*?-->/g, '')
    // Remove whitespace between tags
    minified = minified.replace(/>\s+</g, '><')
    // Remove extra spaces
    minified = minified.replace(/\s+/g, ' ')
    // Trim
    return minified.trim()
  }

  const handleMinify = () => {
    if (!input.trim()) {
      setError(t('codeMinifier.error.emptyInput'))
      setOutput('')
      return
    }

    setError('')

    try {
      let minified = ''

      switch (codeType) {
        case 'js':
          minified = minifyJS(input)
          break
        case 'css':
          minified = minifyCSS(input)
          break
        case 'html':
          minified = minifyHTML(input)
          break
      }

      setOutput(minified)

      const beforeSize = new Blob([input]).size
      const afterSize = new Blob([minified]).size
      const reduction = beforeSize > 0 ? Math.round(((beforeSize - afterSize) / beforeSize) * 100) : 0

      setStats({
        before: beforeSize,
        after: afterSize,
        reduction,
      })
    } catch (err) {
      setError(t('codeMinifier.error.minifyFailed'))
    }
  }

  const handleBeautify = () => {
    if (!input.trim()) {
      setError(t('codeMinifier.error.emptyInput'))
      setOutput('')
      return
    }

    setError('')

    try {
      let beautified = input

      if (codeType === 'js') {
        // Basic JS beautification
        beautified = input
          .replace(/([{;])/g, '$1\n')
          .replace(/([}])/g, '\n$1\n')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n')
      } else if (codeType === 'css') {
        // Basic CSS beautification
        beautified = input
          .replace(/([{;])/g, '$1\n  ')
          .replace(/([}])/g, '\n$1\n')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n')
      } else if (codeType === 'html') {
        // Basic HTML beautification
        beautified = input
          .replace(/></g, '>\n<')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n')
      }

      setOutput(beautified)
      setStats({ before: 0, after: 0, reduction: 0 })
    } catch (err) {
      setError(t('codeMinifier.error.beautifyFailed'))
    }
  }

  return (
    <ToolCard
      title={t('codeMinifier.title')}
      description={t('codeMinifier.description')}
    >
      <div className="space-y-6">
        {/* Code Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('codeMinifier.codeType')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['js', 'css', 'html'] as CodeType[]).map(type => (
              <button
                key={type}
                onClick={() => setCodeType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  codeType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('codeMinifier.input')}
          placeholder={t('codeMinifier.inputPlaceholder')}
          rows={12}
        />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleMinify}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {t('codeMinifier.minify')}
          </button>
          <button
            onClick={handleBeautify}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            {t('codeMinifier.beautify')}
          </button>
          <button
            onClick={() => {
              setInput('')
              setOutput('')
              setError('')
              setStats({ before: 0, after: 0, reduction: 0 })
            }}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
          >
            {t('common.clear')}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Stats */}
        {stats.before > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="text-sm font-medium text-green-900 dark:text-green-300 mb-2">
              {t('codeMinifier.stats')}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-green-700 dark:text-green-400">{t('codeMinifier.before')}</p>
                <p className="font-mono font-bold text-green-900 dark:text-green-200">
                  {stats.before.toLocaleString()} bytes
                </p>
              </div>
              <div>
                <p className="text-green-700 dark:text-green-400">{t('codeMinifier.after')}</p>
                <p className="font-mono font-bold text-green-900 dark:text-green-200">
                  {stats.after.toLocaleString()} bytes
                </p>
              </div>
              <div>
                <p className="text-green-700 dark:text-green-400">{t('codeMinifier.reduction')}</p>
                <p className="font-mono font-bold text-green-900 dark:text-green-200">
                  {stats.reduction}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Output */}
        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('codeMinifier.output')}
          placeholder={t('codeMinifier.outputPlaceholder')}
          rows={12}
        />

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            {t('codeMinifier.infoTitle')}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>{t('codeMinifier.info1')}</li>
            <li>{t('codeMinifier.info2')}</li>
            <li>{t('codeMinifier.info3')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
