'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

interface Shadow {
  id: number
  x: number
  y: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

export default function BoxShadowTool() {
  const { t } = useLanguage()
  const [shadows, setShadows] = useState<Shadow[]>([
    {
      id: 1,
      x: 0,
      y: 4,
      blur: 6,
      spread: 0,
      color: '#000000',
      opacity: 0.1,
      inset: false,
    },
  ])
  const [nextId, setNextId] = useState(2)
  const [previewBg, setPreviewBg] = useState('#f3f4f6')

  const addShadow = () => {
    if (shadows.length >= 5) return

    setShadows([
      ...shadows,
      {
        id: nextId,
        x: 0,
        y: 2,
        blur: 4,
        spread: 0,
        color: '#000000',
        opacity: 0.1,
        inset: false,
      },
    ])
    setNextId(nextId + 1)
  }

  const removeShadow = (id: number) => {
    if (shadows.length <= 1) return
    setShadows(shadows.filter(s => s.id !== id))
  }

  const updateShadow = (id: number, updates: Partial<Shadow>) => {
    setShadows(shadows.map(s => (s.id === id ? { ...s, ...updates } : s)))
  }

  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  const generateShadowString = (shadow: Shadow) => {
    const { x, y, blur, spread, color, opacity, inset } = shadow
    const rgba = hexToRgba(color, opacity)
    const insetStr = inset ? 'inset ' : ''
    return `${insetStr}${x}px ${y}px ${blur}px ${spread}px ${rgba}`
  }

  const generateCSS = () => {
    const shadowStr = shadows.map(generateShadowString).join(',\n  ')
    return `box-shadow: ${shadowStr};`
  }

  const generateCSSWithPrefixes = () => {
    const shadowStr = shadows.map(generateShadowString).join(', ')
    return [
      `box-shadow: ${shadowStr};`,
      `-webkit-box-shadow: ${shadowStr};`,
      `-moz-box-shadow: ${shadowStr};`,
    ].join('\n')
  }

  return (
    <ToolCard
      title={t('boxShadow.title')}
      description={t('boxShadow.description')}
    >
      <div className="space-y-6">
        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('boxShadow.preview')}
            </label>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">
                {t('boxShadow.backgroundColor')}:
              </label>
              <input
                type="color"
                value={previewBg}
                onChange={(e) => setPreviewBg(e.target.value)}
                className="w-10 h-6 rounded cursor-pointer"
              />
            </div>
          </div>
          <div
            className="w-full h-64 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: previewBg }}
          >
            <div
              className="w-48 h-32 bg-white dark:bg-gray-800 rounded-lg"
              style={{ boxShadow: shadows.map(generateShadowString).join(', ') }}
            />
          </div>
        </div>

        {/* Shadows Controls */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('boxShadow.shadows')} ({shadows.length}/5)
            </label>
            <button
              onClick={addShadow}
              disabled={shadows.length >= 5}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              + {t('boxShadow.addShadow')}
            </button>
          </div>

          <div className="space-y-4">
            {shadows.map((shadow, index) => (
              <div
                key={shadow.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('boxShadow.shadowLayer')} #{index + 1}
                  </h3>
                  <button
                    onClick={() => removeShadow(shadow.id)}
                    disabled={shadows.length <= 1}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t('boxShadow.remove')}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Horizontal Offset */}
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('boxShadow.horizontalOffset')}: {shadow.x}px
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadow.x}
                      onChange={(e) => updateShadow(shadow.id, { x: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Vertical Offset */}
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('boxShadow.verticalOffset')}: {shadow.y}px
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadow.y}
                      onChange={(e) => updateShadow(shadow.id, { y: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Blur Radius */}
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('boxShadow.blur')}: {shadow.blur}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={shadow.blur}
                      onChange={(e) => updateShadow(shadow.id, { blur: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Spread Radius */}
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('boxShadow.spread')}: {shadow.spread}px
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={shadow.spread}
                      onChange={(e) => updateShadow(shadow.id, { spread: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('boxShadow.color')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={shadow.color}
                        onChange={(e) => updateShadow(shadow.id, { color: e.target.value })}
                        className="w-12 h-9 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={shadow.color}
                        onChange={(e) => updateShadow(shadow.id, { color: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Opacity */}
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('boxShadow.opacity')}: {Math.round(shadow.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={shadow.opacity}
                      onChange={(e) => updateShadow(shadow.id, { opacity: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Inset Checkbox */}
                <div className="mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shadow.inset}
                      onChange={(e) => updateShadow(shadow.id, { inset: e.target.checked })}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('boxShadow.inset')}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CSS Output */}
        <TextAreaWithCopy
          value={generateCSS()}
          readOnly
          label={t('boxShadow.cssOutput')}
          rows={shadows.length + 1}
        />

        {/* CSS with Prefixes */}
        <TextAreaWithCopy
          value={generateCSSWithPrefixes()}
          readOnly
          label={t('boxShadow.cssWithPrefixes')}
          rows={3}
        />

        {/* Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('boxShadow.presets')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setShadows([
                  { id: nextId, x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 0.1, inset: false },
                ])
                setNextId(nextId + 1)
              }}
              className="h-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs"
              style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
            >
              {t('boxShadow.presetSmall')}
            </button>
            <button
              onClick={() => {
                setShadows([
                  { id: nextId, x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1, inset: false },
                ])
                setNextId(nextId + 1)
              }}
              className="h-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs"
              style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              {t('boxShadow.presetMedium')}
            </button>
            <button
              onClick={() => {
                setShadows([
                  { id: nextId, x: 0, y: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.1, inset: false },
                ])
                setNextId(nextId + 1)
              }}
              className="h-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs"
              style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            >
              {t('boxShadow.presetLarge')}
            </button>
            <button
              onClick={() => {
                setShadows([
                  { id: nextId, x: 0, y: 20, blur: 25, spread: -5, color: '#000000', opacity: 0.1, inset: false },
                  { id: nextId + 1, x: 0, y: 10, blur: 10, spread: -5, color: '#000000', opacity: 0.04, inset: false },
                ])
                setNextId(nextId + 2)
              }}
              className="h-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs"
              style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            >
              {t('boxShadow.presetXLarge')}
            </button>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
