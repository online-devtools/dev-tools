'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'

export default function ColorTool() {
  const [hex, setHex] = useState('#3B82F6')
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map((x) => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  const handleHexChange = (value: string) => {
    setHex(value)
    const rgbValue = hexToRgb(value)
    if (rgbValue) {
      setRgb(rgbValue)
      setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b))
    }
  }

  const handleRgbChange = (r: number, g: number, b: number) => {
    setRgb({ r, g, b })
    setHex(rgbToHex(r, g, b))
    setHsl(rgbToHsl(r, g, b))
  }

  const handleHslChange = (h: number, s: number, l: number) => {
    setHsl({ h, s, l })
    const rgbValue = hslToRgb(h, s, l)
    setRgb(rgbValue)
    setHex(rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b))
  }

  return (
    <>
    <ToolCard
      title="🎨 Color Converter"
      description="HEX, RGB, HSL 색상 코드를 상호 변환합니다"
    >
      <div className="space-y-6">
        <div
          className="w-full h-32 rounded-lg border-4 border-gray-300 dark:border-gray-600 shadow-lg"
          style={{ backgroundColor: hex }}
        />

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              HEX
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-gray-800 dark:text-gray-200"
              />
              <input
                type="color"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-16 h-12 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              RGB
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">R</label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) => handleRgbChange(parseInt(e.target.value) || 0, rgb.g, rgb.b)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">G</label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) => handleRgbChange(rgb.r, parseInt(e.target.value) || 0, rgb.b)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">B</label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) => handleRgbChange(rgb.r, rgb.g, parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              rgb({rgb.r}, {rgb.g}, {rgb.b})
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              HSL
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">H (0-360)</label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => handleHslChange(parseInt(e.target.value) || 0, hsl.s, hsl.l)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">S (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => handleHslChange(hsl.h, parseInt(e.target.value) || 0, hsl.l)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">L (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => handleHslChange(hsl.h, hsl.s, parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
    </>
  )
}
