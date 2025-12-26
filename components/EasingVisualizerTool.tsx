'use client'

import { useEffect, useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { sampleCubicBezier } from '@/utils/easing'

// Common CSS timing function presets so users can quickly load known curves.
const PRESETS = [
  { key: 'ease', values: [0.25, 0.1, 0.25, 1] },
  { key: 'easeIn', values: [0.42, 0, 1, 1] },
  { key: 'easeOut', values: [0, 0, 0.58, 1] },
  { key: 'easeInOut', values: [0.42, 0, 0.58, 1] },
  { key: 'linear', values: [0, 0, 1, 1] },
]

export default function EasingVisualizerTool() {
  const { t } = useLanguage()
  // Keep the control points in state so input changes redraw the curve immediately.
  const [x1, setX1] = useState(0.25)
  const [y1, setY1] = useState(0.1)
  const [x2, setX2] = useState(0.25)
  const [y2, setY2] = useState(1)
  const [forward, setForward] = useState(true)

  useEffect(() => {
    // Toggle the preview dot back and forth so users can see the easing motion.
    const interval = window.setInterval(() => {
      setForward((prev) => !prev)
    }, 1600)

    return () => window.clearInterval(interval)
  }, [])

  // Build the CSS cubic-bezier string that represents the chosen control points.
  const easingString = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`

  // Sample the curve so we can draw it in the SVG preview.
  const points = useMemo(() => sampleCubicBezier(x1, y1, x2, y2, 32), [x1, y1, x2, y2])

  const path = useMemo(() => {
    // Convert sampled points to an SVG path (0-100 viewBox with inverted Y axis).
    return points
      .map((point, index) => {
        const x = point.x * 100
        const y = (1 - point.y) * 100
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
  }, [points])

  const previewStyle = useMemo(() => {
    // Translate the preview dot so the easing function is visible.
    const distance = 260
    return {
      transform: `translateX(${forward ? distance : 0}px)`,
      transitionProperty: 'transform',
      transitionDuration: '1200ms',
      transitionTimingFunction: easingString,
    } as const
  }, [forward, easingString])

  // Provide a ready-to-copy CSS snippet that uses the selected easing.
  const cssSnippet = `transition: transform 1.2s ${easingString};`

  return (
    <ToolCard
      title={`🧭 ${t('easing.title')}`}
      description={t('easing.description')}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.key}
              onClick={() => {
                setX1(preset.values[0])
                setY1(preset.values[1])
                setX2(preset.values[2])
                setY2(preset.values[3])
              }}
              className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors"
            >
              {t(`easing.preset.${preset.key}`)}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">x1</label>
            <input
              type="number"
              step="0.05"
              value={x1}
              onChange={(e) => setX1(Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">y1</label>
            <input
              type="number"
              step="0.05"
              value={y1}
              onChange={(e) => setY1(Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">x2</label>
            <input
              type="number"
              step="0.05"
              value={x2}
              onChange={(e) => setX2(Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">y2</label>
            <input
              type="number"
              step="0.05"
              value={y2}
              onChange={(e) => setY2(Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('easing.curve.title')}
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900/40 p-4">
              <svg viewBox="0 0 100 100" className="w-full h-56">
                <rect x="0" y="0" width="100" height="100" fill="none" stroke="#CBD5F5" strokeWidth="0.5" />
                {[25, 50, 75].map((pos) => (
                  <g key={pos}>
                    <line x1={pos} y1="0" x2={pos} y2="100" stroke="#E2E8F0" strokeWidth="0.5" />
                    <line x1="0" y1={pos} x2="100" y2={pos} stroke="#E2E8F0" strokeWidth="0.5" />
                  </g>
                ))}
                <path d={path} fill="none" stroke="#2563EB" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('easing.preview.title')}
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/40">
              <div className="relative h-16">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 shadow"
                  style={previewStyle}
                />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t('easing.preview.note')}
              </div>
            </div>
          </div>
        </div>

        <TextAreaWithCopy
          value={easingString}
          label={t('easing.output.curve')}
          placeholder={t('easing.output.curvePlaceholder')}
          rows={2}
          readOnly
        />

        <TextAreaWithCopy
          value={cssSnippet}
          label={t('easing.output.css')}
          placeholder={t('easing.output.cssPlaceholder')}
          rows={2}
          readOnly
        />
      </div>
    </ToolCard>
  )
}
