'use client'

import { useEffect, useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

type DiffStats = {
  width: number
  height: number
  mismatched: number
  total: number
}

const loadImage = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Image load failed'))
    image.src = dataUrl
  })
}

export default function VisualDiffTool() {
  const { t } = useLanguage()
  const [baselineUrl, setBaselineUrl] = useState<string | null>(null)
  const [candidateUrl, setCandidateUrl] = useState<string | null>(null)
  const [diffUrl, setDiffUrl] = useState<string | null>(null)
  const [threshold, setThreshold] = useState(20)
  const [stats, setStats] = useState<DiffStats | null>(null)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const runDiff = async () => {
      if (!baselineUrl || !candidateUrl) return
      setIsProcessing(true)
      setError('')

      try {
        const [baseline, candidate] = await Promise.all([loadImage(baselineUrl), loadImage(candidateUrl)])
        const width = Math.max(baseline.width, candidate.width)
        const height = Math.max(baseline.height, candidate.height)

        const baseCanvas = document.createElement('canvas')
        baseCanvas.width = width
        baseCanvas.height = height
        const baseCtx = baseCanvas.getContext('2d')

        const candidateCanvas = document.createElement('canvas')
        candidateCanvas.width = width
        candidateCanvas.height = height
        const candidateCtx = candidateCanvas.getContext('2d')

        const diffCanvas = document.createElement('canvas')
        diffCanvas.width = width
        diffCanvas.height = height
        const diffCtx = diffCanvas.getContext('2d')

        if (!baseCtx || !candidateCtx || !diffCtx) {
          throw new Error('Canvas context unavailable')
        }

        baseCtx.drawImage(baseline, 0, 0)
        candidateCtx.drawImage(candidate, 0, 0)

        const baseData = baseCtx.getImageData(0, 0, width, height)
        const candidateData = candidateCtx.getImageData(0, 0, width, height)
        const diffData = diffCtx.createImageData(width, height)

        let mismatched = 0
        for (let i = 0; i < baseData.data.length; i += 4) {
          const dr = Math.abs(baseData.data[i] - candidateData.data[i])
          const dg = Math.abs(baseData.data[i + 1] - candidateData.data[i + 1])
          const db = Math.abs(baseData.data[i + 2] - candidateData.data[i + 2])
          const mismatch = dr > threshold || dg > threshold || db > threshold

          if (mismatch) {
            mismatched += 1
            diffData.data[i] = 255
            diffData.data[i + 1] = 0
            diffData.data[i + 2] = 0
            diffData.data[i + 3] = 255
          } else {
            const gray = Math.round(
              0.2126 * baseData.data[i] + 0.7152 * baseData.data[i + 1] + 0.0722 * baseData.data[i + 2]
            )
            diffData.data[i] = gray
            diffData.data[i + 1] = gray
            diffData.data[i + 2] = gray
            diffData.data[i + 3] = 160
          }
        }

        diffCtx.putImageData(diffData, 0, 0)
        setDiffUrl(diffCanvas.toDataURL('image/png'))
        setStats({ width, height, mismatched, total: width * height })
      } catch (err) {
        setError(err instanceof Error ? err.message : t('visualDiff.error'))
        setDiffUrl(null)
        setStats(null)
      } finally {
        setIsProcessing(false)
      }
    }

    runDiff()
  }, [baselineUrl, candidateUrl, threshold, t])

  const mismatchPercent = useMemo(() => {
    if (!stats || stats.total === 0) return null
    return (stats.mismatched / stats.total) * 100
  }, [stats])

  return (
    <ToolCard
      title={`🖼️ ${t('visualDiff.title')}`}
      description={t('visualDiff.description')}
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('visualDiff.baseline')}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => setBaselineUrl(reader.result as string)
                reader.readAsDataURL(file)
              }}
              className="w-full text-sm text-gray-600 dark:text-gray-300"
            />
            {baselineUrl && <img src={baselineUrl} alt={t('visualDiff.baseline')} className="max-h-48 rounded" />}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('visualDiff.candidate')}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => setCandidateUrl(reader.result as string)
                reader.readAsDataURL(file)
              }}
              className="w-full text-sm text-gray-600 dark:text-gray-300"
            />
            {candidateUrl && <img src={candidateUrl} alt={t('visualDiff.candidate')} className="max-h-48 rounded" />}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('visualDiff.threshold')} ({threshold})
          </label>
          <input
            type="range"
            min={0}
            max={80}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {isProcessing && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('visualDiff.processing')}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {diffUrl && stats && (
          <div className="space-y-3">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <img src={diffUrl} alt={t('visualDiff.diff')} className="max-h-64 mx-auto" />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t('visualDiff.stats', {
                width: stats.width,
                height: stats.height,
                count: stats.mismatched,
                percent: mismatchPercent ? mismatchPercent.toFixed(2) : '0',
              })}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
