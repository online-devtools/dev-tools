'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

type Base = 'binary' | 'octal' | 'decimal' | 'hexadecimal'

export default function BaseConverterTool() {
  const { t } = useLanguage()
  // 입력 값, 입력 진법, 변환 결과, 에러 상태를 관리합니다.
  const [inputValue, setInputValue] = useState('255')
  const [inputBase, setInputBase] = useState<Base>('decimal')
  const [results, setResults] = useState<Record<Base, string>>({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: ''
  })
  const [error, setError] = useState('')

  const convert = (value: string, fromBase: Base) => {
    try {
      setError('')

      if (!value.trim()) {
        setResults({ binary: '', octal: '', decimal: '', hexadecimal: '' })
        return
      }

      // Convert to decimal first
      let decimalValue: number

      switch (fromBase) {
        case 'binary':
          if (!/^[01]+$/.test(value)) {
            setError(t('baseConv.error.binary'))
            return
          }
          decimalValue = parseInt(value, 2)
          break
        case 'octal':
          if (!/^[0-7]+$/.test(value)) {
            setError(t('baseConv.error.octal'))
            return
          }
          decimalValue = parseInt(value, 8)
          break
        case 'decimal':
          if (!/^\d+$/.test(value)) {
            setError(t('baseConv.error.decimal'))
            return
          }
          decimalValue = parseInt(value, 10)
          break
        case 'hexadecimal':
          if (!/^[0-9A-Fa-f]+$/.test(value)) {
            setError(t('baseConv.error.hex'))
            return
          }
          decimalValue = parseInt(value, 16)
          break
      }

      if (isNaN(decimalValue) || decimalValue < 0) {
        setError(t('baseConv.error.invalidNumber'))
        return
      }

      // Convert to all bases
      setResults({
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        decimal: decimalValue.toString(10),
        hexadecimal: decimalValue.toString(16).toUpperCase()
      })
    } catch (e) {
      setError(t('baseConv.error.generic'))
      setResults({ binary: '', octal: '', decimal: '', hexadecimal: '' })
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    convert(value, inputBase)
  }

  const handleBaseChange = (base: Base) => {
    setInputBase(base)
    convert(inputValue, base)
  }

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
  }

  const baseInfo = {
    binary: { label: t('baseConv.label.binary'), placeholder: '11111111', prefix: '0b' },
    octal: { label: t('baseConv.label.octal'), placeholder: '377', prefix: '0o' },
    decimal: { label: t('baseConv.label.decimal'), placeholder: '255', prefix: '' },
    hexadecimal: { label: t('baseConv.label.hex'), placeholder: 'FF', prefix: '0x' }
  }

  return (
    <ToolCard
      title={`🔢 ${t('baseConv.title')}`}
      description={t('baseConv.description')}
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('baseConv.inputBase')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(Object.keys(baseInfo) as Base[]).map((base) => (
                <button
                  key={base}
                  onClick={() => handleBaseChange(base)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    inputBase === base
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {baseInfo[base].label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {baseInfo[inputBase].label}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={baseInfo[inputBase].placeholder}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200 font-mono text-lg"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Results Grid */}
        {results.decimal && (
          <div className="grid md:grid-cols-2 gap-4">
            {(Object.keys(baseInfo) as Base[]).map((base) => (
              <div
                key={base}
                className={`rounded-lg p-4 border ${
                  base === 'binary'
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : base === 'octal'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : base === 'decimal'
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                    : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {baseInfo[base].label}
                  </div>
                  <button
                    onClick={() => copyToClipboard(results[base])}
                    className="px-2 py-1 text-xs bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded transition-colors"
                  >
                    {t('common.copy')}
                  </button>
                </div>
                <div className="font-mono text-lg font-bold text-gray-800 dark:text-white break-all">
                  {baseInfo[base].prefix}{results[base]}
                </div>
                {base === 'binary' && results[base].length > 8 && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {results[base].match(/.{1,8}/g)?.join(' ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Reference */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            {t('baseConv.referenceTitle')}
          </h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">
                10 (Dec) = 1010 (Bin) = 12 (Oct) = A (Hex)
              </div>
              <div className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">
                15 (Dec) = 1111 (Bin) = 17 (Oct) = F (Hex)
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">
                255 (Dec) = 11111111 (Bin) = 377 (Oct) = FF (Hex)
              </div>
              <div className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">
                1024 (Dec) = 10000000000 (Bin) = 2000 (Oct) = 400 (Hex)
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
