'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'
import { parseBreakpoints } from '@/utils/breakpoints'

// Default breakpoint list covers common mobile, tablet, and desktop widths.
const DEFAULT_BREAKPOINTS = '320, 375, 425, 768, 1024, 1280, 1440'

export default function BreakpointTesterTool() {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement | null>(null)
  // Track container width so iframes can scale down to fit smaller screens.
  const [containerWidth, setContainerWidth] = useState(0)
  const [url, setUrl] = useState('')
  const [height, setHeight] = useState(800)
  const [breakpointsText, setBreakpointsText] = useState(DEFAULT_BREAKPOINTS)

  useEffect(() => {
    // Observe container width changes to keep previews responsive.
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      setContainerWidth(entry.contentRect.width)
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Default to the current site when running locally for quick testing.
    if (!url && typeof window !== 'undefined') {
      setUrl(window.location.origin)
    }
  }, [url])

  // Build the list of numeric breakpoints every time the input string changes.
  const breakpoints = useMemo(() => parseBreakpoints(breakpointsText), [breakpointsText])

  return (
    <ToolCard
      title={`📱 ${t('breakpoint.title')}`}
      description={t('breakpoint.description')}
    >
      <div className="space-y-5" ref={containerRef}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('breakpoint.input.url')}
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('breakpoint.input.height')}
            </label>
            <input
              type="number"
              min={300}
              max={2000}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('breakpoint.input.breakpoints')}
          </label>
          <input
            value={breakpointsText}
            onChange={(e) => setBreakpointsText(e.target.value)}
            placeholder={t('breakpoint.input.breakpointsPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t('breakpoint.input.note')}
          </div>
        </div>

        {breakpoints.length === 0 ? (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
            {t('breakpoint.error.empty')}
          </div>
        ) : (
          <div className="space-y-6">
            {breakpoints.map((width) => {
              const scale = containerWidth > 0 ? Math.min(1, containerWidth / width) : 1
              const scaledHeight = height * scale

              return (
                <div key={width} className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {width}px
                  </div>
                  <div
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
                    style={{ height: `${scaledHeight}px` }}
                  >
                    <div
                      style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                      }}
                    >
                      {url ? (
                        <iframe
                          src={url}
                          title={`preview-${width}`}
                          width={width}
                          height={height}
                          className="border-0"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-gray-500">
                          {t('breakpoint.preview.empty')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t('breakpoint.note')}
        </div>
      </div>
    </ToolCard>
  )
}
