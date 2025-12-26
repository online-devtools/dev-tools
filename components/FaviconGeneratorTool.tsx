"use client"

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { buildFaviconTags } from '@/utils/favicon'

type GeneratedIcon = {
  size: number
  dataUrl: string
}

const SIZES = [16, 32, 48, 96, 180, 192, 512]

export default function FaviconGeneratorTool() {
  const { t } = useLanguage()
  // Track uploaded image preview and generated icon outputs.
  const [previewUrl, setPreviewUrl] = useState('')
  const [icons, setIcons] = useState<GeneratedIcon[]>([])
  const [error, setError] = useState('')

  const generateIcons = async (dataUrl: string) => {
    // Load the image data into a DOM Image so we can draw to canvas.
    const image = new Image()
    image.src = dataUrl

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('Image load failed'))
    })

    const generated: GeneratedIcon[] = []
    for (const size of SIZES) {
      // Canvas resize preserves alpha channel for PNG output.
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Canvas context unavailable')
      }
      ctx.clearRect(0, 0, size, size)
      ctx.drawImage(image, 0, 0, size, size)
      generated.push({ size, dataUrl: canvas.toDataURL('image/png') })
    }

    setIcons(generated)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setIcons([])

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('File read failed'))
        reader.readAsDataURL(file)
      })

      setPreviewUrl(dataUrl)
      await generateIcons(dataUrl)
    } catch (err) {
      setError(t('favicon.error.failed'))
      setPreviewUrl('')
      setIcons([])
    }
  }

  const handleClear = () => {
    // Reset image and generated icons.
    setPreviewUrl('')
    setIcons([])
    setError('')
  }

  const tags = buildFaviconTags({
    basePath: '/favicons',
    sizes: [16, 32, 48, 96],
    includeApple: true,
    includeManifest: true,
  })

  return (
    <ToolCard
      title={`🎯 ${t('favicon.title')}`}
      description={t('favicon.description')}
    >
      <div className="space-y-4">
        <div>
          <label className="px-4 py-2 inline-flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-sm text-gray-700 dark:text-gray-300">
            🖼️ {t('favicon.input.label')}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {previewUrl && (
          <div className="flex items-center gap-4">
            <img src={previewUrl} alt={t('favicon.preview.alt')} className="w-20 h-20 rounded-lg border border-gray-200 dark:border-gray-700 object-cover" />
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t('favicon.preview.note')}
            </div>
          </div>
        )}

        {icons.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {icons.map((icon) => (
              <div key={icon.size} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {icon.size}x{icon.size}
                </div>
                <img src={icon.dataUrl} alt={`${icon.size}x${icon.size}`} className="w-12 h-12 mb-2" />
                <a
                  href={icon.dataUrl}
                  download={`favicon-${icon.size}x${icon.size}.png`}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t('favicon.actions.download')}
                </a>
              </div>
            ))}
          </div>
        )}

        <TextAreaWithCopy
          value={tags}
          readOnly
          label={t('favicon.output.label')}
          placeholder={t('favicon.output.placeholder')}
          rows={4}
        />

        <button
          onClick={handleClear}
          className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {t('favicon.actions.clear')}
        </button>
      </div>
    </ToolCard>
  )
}
