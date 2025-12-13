'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type GradientType = 'linear' | 'radial' | 'conic'

interface ColorStop {
  id: number
  color: string
  position: number
}

export default function CSSGradientTool() {
  const { t } = useLanguage()
  const [gradientType, setGradientType] = useState<GradientType>('linear')
  const [angle, setAngle] = useState(90)
  const [radialShape, setRadialShape] = useState<'circle' | 'ellipse'>('circle')
  const [radialPosition, setRadialPosition] = useState({ x: 50, y: 50 })
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: 1, color: '#667eea', position: 0 },
    { id: 2, color: '#764ba2', position: 100 },
  ])
  const [nextId, setNextId] = useState(3)

  const addColorStop = () => {
    if (colorStops.length >= 10) return

    const newPosition = colorStops.length > 0
      ? Math.round((colorStops[colorStops.length - 1].position + 100) / 2)
      : 50

    setColorStops([
      ...colorStops,
      { id: nextId, color: '#000000', position: newPosition }
    ])
    setNextId(nextId + 1)
  }

  const removeColorStop = (id: number) => {
    if (colorStops.length <= 2) return
    setColorStops(colorStops.filter(stop => stop.id !== id))
  }

  const updateColorStop = (id: number, field: 'color' | 'position', value: string | number) => {
    setColorStops(colorStops.map(stop =>
      stop.id === id ? { ...stop, [field]: value } : stop
    ))
  }

  const generateGradient = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position)
    const colorString = sortedStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ')

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${colorString})`
      case 'radial':
        return `radial-gradient(${radialShape} at ${radialPosition.x}% ${radialPosition.y}%, ${colorString})`
      case 'conic':
        return `conic-gradient(from ${angle}deg at ${radialPosition.x}% ${radialPosition.y}%, ${colorString})`
    }
  }

  const generateCSS = () => {
    const gradient = generateGradient()
    return `background: ${gradient};`
  }

  const generateCSSWithPrefixes = () => {
    const gradient = generateGradient()
    return [
      `background: ${gradient};`,
      `-webkit-background: ${gradient};`,
      `-moz-background: ${gradient};`,
      `-o-background: ${gradient};`,
    ].join('\n')
  }

  return (
    <ToolCard
      title={t('cssGradient.title')}
      description={t('cssGradient.description')}
    >
      <div className="space-y-6">
        {/* Gradient Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('cssGradient.type')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['linear', 'radial', 'conic'] as GradientType[]).map(type => (
              <button
                key={type}
                onClick={() => setGradientType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  gradientType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t(`cssGradient.${type}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Linear/Conic Angle */}
        {(gradientType === 'linear' || gradientType === 'conic') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('cssGradient.angle')}: {angle}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {/* Radial Shape */}
        {gradientType === 'radial' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('cssGradient.shape')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['circle', 'ellipse'] as const).map(shape => (
                <button
                  key={shape}
                  onClick={() => setRadialShape(shape)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    radialShape === shape
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {t(`cssGradient.${shape}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Position (for radial and conic) */}
        {(gradientType === 'radial' || gradientType === 'conic') && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('cssGradient.position')}
            </label>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                {t('cssGradient.horizontalPosition')}: {radialPosition.x}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={radialPosition.x}
                onChange={(e) => setRadialPosition({ ...radialPosition, x: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                {t('cssGradient.verticalPosition')}: {radialPosition.y}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={radialPosition.y}
                onChange={(e) => setRadialPosition({ ...radialPosition, y: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Color Stops */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('cssGradient.colorStops')}
            </label>
            <button
              onClick={addColorStop}
              disabled={colorStops.length >= 10}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              + {t('cssGradient.addStop')}
            </button>
          </div>
          <div className="space-y-2">
            {colorStops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-2">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  placeholder="#000000"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) => updateColorStop(stop.id, 'position', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
                <button
                  onClick={() => removeColorStop(stop.id)}
                  disabled={colorStops.length <= 2}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('cssGradient.preview')}
          </label>
          <div
            className="w-full h-48 rounded-lg border-2 border-gray-300 dark:border-gray-600"
            style={{ background: generateGradient() }}
          />
        </div>

        {/* CSS Output */}
        <TextAreaWithCopy
          value={generateCSS()}
          readOnly
          label={t('cssGradient.cssOutput')}
          rows={1}
        />

        {/* CSS with Prefixes */}
        <TextAreaWithCopy
          value={generateCSSWithPrefixes()}
          readOnly
          label={t('cssGradient.cssWithPrefixes')}
          rows={5}
        />

        {/* Preset Gradients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('cssGradient.presets')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => {
                setGradientType('linear')
                setAngle(135)
                setColorStops([
                  { id: nextId, color: '#667eea', position: 0 },
                  { id: nextId + 1, color: '#764ba2', position: 100 },
                ])
                setNextId(nextId + 2)
              }}
              className="h-16 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            />
            <button
              onClick={() => {
                setGradientType('linear')
                setAngle(90)
                setColorStops([
                  { id: nextId, color: '#f093fb', position: 0 },
                  { id: nextId + 1, color: '#f5576c', position: 100 },
                ])
                setNextId(nextId + 2)
              }}
              className="h-16 rounded-lg"
              style={{ background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)' }}
            />
            <button
              onClick={() => {
                setGradientType('linear')
                setAngle(120)
                setColorStops([
                  { id: nextId, color: '#4facfe', position: 0 },
                  { id: nextId + 1, color: '#00f2fe', position: 100 },
                ])
                setNextId(nextId + 2)
              }}
              className="h-16 rounded-lg"
              style={{ background: 'linear-gradient(120deg, #4facfe 0%, #00f2fe 100%)' }}
            />
            <button
              onClick={() => {
                setGradientType('linear')
                setAngle(45)
                setColorStops([
                  { id: nextId, color: '#43e97b', position: 0 },
                  { id: nextId + 1, color: '#38f9d7', position: 100 },
                ])
                setNextId(nextId + 2)
              }}
              className="h-16 rounded-lg"
              style={{ background: 'linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)' }}
            />
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
