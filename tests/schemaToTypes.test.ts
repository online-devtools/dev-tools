import { describe, expect, it } from 'vitest'
import { generateTypeScriptFromSchema } from '@/utils/schemaToTypes'

// JSON Schema → TypeScript conversion should serialize schemas into TS types.
describe('schemaToTypes utils', () => {
  it('generates object types with required fields', () => {
    // Validate required/optional fields and array conversion.
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        count: { type: 'integer' },
        tags: { type: 'array', items: { type: 'string' } },
      },
      required: ['id'],
    }

    const result = generateTypeScriptFromSchema(schema, 'Example')

    expect(result.types.trim()).toBe(
      [
        'export type Example = {',
        '  id: string;',
        '  count?: number;',
        '  tags?: string[];',
        '};',
      ].join('\n'),
    )
    expect(result.warnings).toHaveLength(0)
  })

  it('converts enums into literal unions', () => {
    // Enums should be converted into literal unions.
    const schema = {
      enum: ['alpha', 'beta', 'gamma'],
    }

    const result = generateTypeScriptFromSchema(schema, 'Variant')

    expect(result.types.trim()).toBe(
      'export type Variant = "alpha" | "beta" | "gamma";',
    )
  })
})
