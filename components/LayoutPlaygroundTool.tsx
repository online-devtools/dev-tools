'use client'

import { type CSSProperties, useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { buildLayoutCss, FlexLayoutSettings, GridLayoutSettings } from '@/utils/layoutCss'

// Default flexbox settings provide a predictable starter layout.
const DEFAULT_FLEX: FlexLayoutSettings = {
  mode: 'flex',
  direction: 'row',
  justify: 'flex-start',
  align: 'stretch',
  gap: 12,
  wrap: 'nowrap',
}

// Default grid settings mirror a simple 3-column layout.
const DEFAULT_GRID: GridLayoutSettings = {
  mode: 'grid',
  columns: 'repeat(3, 1fr)',
  rows: 'auto',
  gap: 12,
  justifyItems: 'stretch',
  alignItems: 'stretch',
}

export default function LayoutPlaygroundTool() {
  const { t } = useLanguage()
  // Keep flex and grid settings separate so switching modes preserves values.
  const [mode, setMode] = useState<'flex' | 'grid'>('flex')
  const [flexSettings, setFlexSettings] = useState<FlexLayoutSettings>(DEFAULT_FLEX)
  const [gridSettings, setGridSettings] = useState<GridLayoutSettings>(DEFAULT_GRID)

  // Select the active settings set based on the current mode.
  const settings = mode === 'flex' ? flexSettings : gridSettings
  // Convert the current settings into a copyable CSS block.
  const cssOutput = useMemo(() => buildLayoutCss(settings), [settings])

  const containerStyle = useMemo<CSSProperties>(() => {
    // Convert the selected settings into inline styles for the preview box.
    if (mode === 'flex') {
      return {
        display: 'flex',
        flexDirection: flexSettings.direction,
        justifyContent: flexSettings.justify,
        alignItems: flexSettings.align,
        gap: `${flexSettings.gap}px`,
        flexWrap: flexSettings.wrap,
      }
    }

    // Grid preview uses CSS grid properties to mirror the output CSS.
    return {
      display: 'grid',
      gridTemplateColumns: gridSettings.columns,
      gridTemplateRows: gridSettings.rows,
      gap: `${gridSettings.gap}px`,
      justifyItems: gridSettings.justifyItems,
      alignItems: gridSettings.alignItems,
    }
  }, [mode, flexSettings, gridSettings])

  const resetSettings = () => {
    // Reset both modes so the playground returns to the defaults.
    setMode('flex')
    setFlexSettings(DEFAULT_FLEX)
    setGridSettings(DEFAULT_GRID)
  }

  return (
    <ToolCard
      title={`📐 ${t('layoutPlayground.title')}`}
      description={t('layoutPlayground.description')}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setMode('flex')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'flex'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {t('layoutPlayground.mode.flex')}
          </button>
          <button
            onClick={() => setMode('grid')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {t('layoutPlayground.mode.grid')}
          </button>
          <button
            onClick={resetSettings}
            className="px-4 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors"
          >
            {t('layoutPlayground.actions.reset')}
          </button>
        </div>

        {mode === 'flex' ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('layoutPlayground.flex.direction')}
              </label>
              <select
                value={flexSettings.direction}
                onChange={(e) =>
                  setFlexSettings((prev) => ({
                    ...prev,
                    direction: e.target.value as FlexLayoutSettings['direction'],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="row">row</option>
                <option value="row-reverse">row-reverse</option>
                <option value="column">column</option>
                <option value="column-reverse">column-reverse</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('layoutPlayground.flex.justify')}
              </label>
              <select
                value={flexSettings.justify}
                onChange={(e) =>
                  setFlexSettings((prev) => ({
                    ...prev,
                    justify: e.target.value as FlexLayoutSettings['justify'],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('layoutPlayground.flex.align')}
              </label>
              <select
                value={flexSettings.align}
                onChange={(e) =>
                  setFlexSettings((prev) => ({
                    ...prev,
                    align: e.target.value as FlexLayoutSettings['align'],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="stretch">stretch</option>
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
                <option value="baseline">baseline</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('layoutPlayground.flex.wrap')}
              </label>
              <select
                value={flexSettings.wrap}
                onChange={(e) =>
                  setFlexSettings((prev) => ({
                    ...prev,
                    wrap: e.target.value as FlexLayoutSettings['wrap'],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="nowrap">nowrap</option>
                <option value="wrap">wrap</option>
                <option value="wrap-reverse">wrap-reverse</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('layoutPlayground.flex.gap')}
              </label>
              <input
                type="number"
                min={0}
                max={60}
                value={flexSettings.gap}
                onChange={(e) => setFlexSettings((prev) => ({ ...prev, gap: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('layoutPlayground.grid.columns')}
              </label>
              <input
                value={gridSettings.columns}
                onChange={(e) => setGridSettings((prev) => ({ ...prev, columns: e.target.value }))}
                placeholder="repeat(3, 1fr)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('layoutPlayground.grid.rows')}
              </label>
              <input
                value={gridSettings.rows}
                onChange={(e) => setGridSettings((prev) => ({ ...prev, rows: e.target.value }))}
                placeholder="auto"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('layoutPlayground.grid.justify')}
              </label>
              <select
                value={gridSettings.justifyItems}
                onChange={(e) =>
                  setGridSettings((prev) => ({
                    ...prev,
                    justifyItems: e.target.value as GridLayoutSettings['justifyItems'],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="stretch">stretch</option>
                <option value="start">start</option>
                <option value="center">center</option>
                <option value="end">end</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('layoutPlayground.grid.align')}
              </label>
              <select
                value={gridSettings.alignItems}
                onChange={(e) =>
                  setGridSettings((prev) => ({
                    ...prev,
                    alignItems: e.target.value as GridLayoutSettings['alignItems'],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="stretch">stretch</option>
                <option value="start">start</option>
                <option value="center">center</option>
                <option value="end">end</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('layoutPlayground.grid.gap')}
              </label>
              <input
                type="number"
                min={0}
                max={60}
                value={gridSettings.gap}
                onChange={(e) => setGridSettings((prev) => ({ ...prev, gap: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('layoutPlayground.preview.title')}
          </div>
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/40">
            <div style={containerStyle}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`item-${index}`}
                  className="flex items-center justify-center bg-blue-500/80 text-white rounded-lg h-14 text-sm font-semibold"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <TextAreaWithCopy
          value={cssOutput}
          label={t('layoutPlayground.output.label')}
          placeholder={t('layoutPlayground.output.placeholder')}
          rows={6}
          readOnly
        />
      </div>
    </ToolCard>
  )
}
