"use client"

import { useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'
import { extractDominantColors } from '@/utils/colorPalette'

export default function ColorPaletteTool() {
  const { t } = useLanguage()
  // Store image preview, palette size, and extracted colors.
  const [previewUrl, setPreviewUrl] = useState('')
  const [paletteSize, setPaletteSize] = useState(6)
  const [colors, setColors] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleImage = async (file: File) => {
    try {
      setError('')
      setColors([])

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('File read failed'))
        reader.readAsDataURL(file)
      })

      setPreviewUrl(dataUrl)

      // Load the image and draw to a canvas for pixel extraction.
      const image = new Image()
      image.src = dataUrl
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error('Image load failed'))
      })

      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Canvas context unavailable')
      }
      ctx.drawImage(image, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const palette = extractDominantColors(imageData.data, paletteSize, { quantizeBits: 5 })
      setColors(palette)
    } catch (err) {
      setError(t('colorPalette.error.failed'))
      setPreviewUrl('')
      setColors([])
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    handleImage(file)
  }

  const handleCopy = (color: string) => {
    // Copy hex color values for immediate use in styles.
    navigator.clipboard.writeText(color)
  }

  const handleClear = () => {
    // Clear the uploaded image and palette.
    setPreviewUrl('')
    setColors([])
    setError('')
  }

  return (
    <ToolCard
      title={`🎨 ${t('colorPalette.title')}`}
      description={t('colorPalette.description')}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="px-4 py-2 inline-flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-sm text-gray-700 dark:text-gray-300">
            🖼️ {t('colorPalette.input.label')}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            {t('colorPalette.size.label')}
            <input
              type="number"
              min={3}
              max={12}
              value={paletteSize}
              onChange={(e) => setPaletteSize(Number(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {previewUrl && (
          <img src={previewUrl} alt={t('colorPalette.preview.alt')} className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700" />
        )}

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {colors.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {colors.map((color) => (
              <div key={color} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600" style={{ backgroundColor: color }} />
                <div>
                  <div className="font-mono text-sm text-gray-800 dark:text-gray-100">{color}</div>
                  <button
                    onClick={() => handleCopy(color)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t('colorPalette.actions.copy')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleClear}
          className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {t('colorPalette.actions.clear')}
        </button>
      </div>
    </ToolCard>
  )
}
