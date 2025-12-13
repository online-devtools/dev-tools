'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SVGOptimizerTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [precision, setPrecision] = useState(2)
  const [removeComments, setRemoveComments] = useState(true)
  const [removeMetadata, setRemoveMetadata] = useState(true)
  const [originalSize, setOriginalSize] = useState(0)
  const [optimizedSize, setOptimizedSize] = useState(0)

  const optimizeSVG = () => {
    try {
      setError('')

      if (!input.trim()) {
        setError(t('svgOptimizer.emptyInput'))
        setOutput('')
        return
      }

      // Check if it's valid SVG
      if (!input.includes('<svg')) {
        setError(t('svgOptimizer.notSVG'))
        setOutput('')
        return
      }

      let optimized = input

      // Remove comments
      if (removeComments) {
        optimized = optimized.replace(/<!--[\s\S]*?-->/g, '')
      }

      // Remove metadata tags
      if (removeMetadata) {
        optimized = optimized.replace(/<metadata[\s\S]*?<\/metadata>/g, '')
        optimized = optimized.replace(/<title[\s\S]*?<\/title>/g, '')
        optimized = optimized.replace(/<desc[\s\S]*?<\/desc>/g, '')
      }

      // Remove editor-specific tags
      optimized = optimized.replace(/<(sodipodi|inkscape|rdf|cc|dc):[^>]*>/g, '')
      optimized = optimized.replace(/xmlns:(sodipodi|inkscape|rdf|cc|dc)="[^"]*"/g, '')
      optimized = optimized.replace(/(sodipodi|inkscape):[^=]*="[^"]*"/g, '')

      // Round decimal numbers to specified precision
      if (precision >= 0) {
        optimized = optimized.replace(/(\d+\.\d+)/g, (match) => {
          return parseFloat(match).toFixed(precision)
        })
      }

      // Remove unnecessary whitespace
      optimized = optimized.replace(/\s+/g, ' ')
      optimized = optimized.replace(/>\s+</g, '><')
      optimized = optimized.trim()

      // Remove empty attributes
      optimized = optimized.replace(/\s[a-z-]+=""\s/g, ' ')

      setOutput(optimized)

      // Calculate sizes
      const originalBytes = new Blob([input]).size
      const optimizedBytes = new Blob([optimized]).size
      setOriginalSize(originalBytes)
      setOptimizedSize(optimizedBytes)
    } catch (err) {
      setError(t('svgOptimizer.optimizationError') + ': ' + (err as Error).message)
      setOutput('')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setOriginalSize(0)
    setOptimizedSize(0)
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getReduction = (): string => {
    if (originalSize === 0) return '0%'
    const reduction = ((originalSize - optimizedSize) / originalSize) * 100
    return reduction.toFixed(1) + '%'
  }

  return (
    <ToolCard
      title={t('tool.svgOptimizer')}
      description={t('svgOptimizer.description')}
    >
      <div className="space-y-4">
        {/* Options */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {t('svgOptimizer.options')}
          </h3>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remove-comments"
              checked={removeComments}
              onChange={(e) => setRemoveComments(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="remove-comments" className="text-sm text-gray-700 dark:text-gray-300">
              {t('svgOptimizer.removeComments')}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remove-metadata"
              checked={removeMetadata}
              onChange={(e) => setRemoveMetadata(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="remove-metadata" className="text-sm text-gray-700 dark:text-gray-300">
              {t('svgOptimizer.removeMetadata')}
            </label>
          </div>

          <div>
            <label htmlFor="precision" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              {t('svgOptimizer.precision')}: {precision}
            </label>
            <input
              type="range"
              id="precision"
              min="0"
              max="5"
              value={precision}
              onChange={(e) => setPrecision(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        </div>

        {/* Input */}
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('svgOptimizer.inputSVG')}
          placeholder={t('svgOptimizer.placeholder')}
          rows={10}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={optimizeSVG}
            className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('svgOptimizer.optimize')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('common.clear')}
          </button>
        </div>

        {/* Statistics */}
        {output && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t('svgOptimizer.originalSize')}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatBytes(originalSize)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t('svgOptimizer.optimizedSize')}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatBytes(optimizedSize)}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <div className="text-sm text-green-600 dark:text-green-400 mb-1">
                {t('svgOptimizer.reduction')}
              </div>
              <div className="text-lg font-bold text-green-700 dark:text-green-300">
                {getReduction()}
              </div>
            </div>
          </div>
        )}

        {/* Output */}
        {output && (
          <TextAreaWithCopy
            value={output}
            readOnly
            label={t('svgOptimizer.optimizedSVG')}
            rows={10}
          />
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {t('svgOptimizer.infoTitle')}
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>{t('svgOptimizer.info1')}</li>
            <li>{t('svgOptimizer.info2')}</li>
            <li>{t('svgOptimizer.info3')}</li>
            <li>{t('svgOptimizer.info4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
