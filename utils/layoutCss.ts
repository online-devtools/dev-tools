// Layout CSS builder for flexbox/grid playgrounds.
// Produces copyable CSS based on UI settings.

export type FlexLayoutSettings = {
  mode: 'flex'
  direction: string
  justify: string
  align: string
  gap: number
  wrap: string
}

export type GridLayoutSettings = {
  mode: 'grid'
  columns: string
  rows: string
  gap: number
  justifyItems: string
  alignItems: string
}

export type LayoutSettings = FlexLayoutSettings | GridLayoutSettings

export const buildLayoutCss = (settings: LayoutSettings): string => {
  if (settings.mode === 'flex') {
    // Flexbox settings map directly to CSS properties.
    return [
      'display: flex;',
      `flex-direction: ${settings.direction};`,
      `justify-content: ${settings.justify};`,
      `align-items: ${settings.align};`,
      `gap: ${settings.gap}px;`,
      `flex-wrap: ${settings.wrap};`,
    ].join('\n')
  }

  // Grid settings map to grid-template rows/columns and alignment properties.
  return [
    'display: grid;',
    `grid-template-columns: ${settings.columns};`,
    `grid-template-rows: ${settings.rows};`,
    `gap: ${settings.gap}px;`,
    `justify-items: ${settings.justifyItems};`,
    `align-items: ${settings.alignItems};`,
  ].join('\n')
}
