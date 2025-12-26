// Layout CSS builder for flexbox/grid playgrounds.
// Produces copyable CSS based on UI settings.

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
export type FlexJustify =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
export type FlexAlign = 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline'
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'

export type FlexLayoutSettings = {
  mode: 'flex'
  direction: FlexDirection
  justify: FlexJustify
  align: FlexAlign
  gap: number
  wrap: FlexWrap
}

export type GridAlign = 'stretch' | 'start' | 'center' | 'end'

export type GridLayoutSettings = {
  mode: 'grid'
  columns: string
  rows: string
  gap: number
  justifyItems: GridAlign
  alignItems: GridAlign
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
