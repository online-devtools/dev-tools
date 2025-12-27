// Utilities that convert JSON Schema into TypeScript type declarations.

export type JsonSchema = {
  type?: string | string[]
  const?: string | number | boolean | null
  enum?: Array<string | number | boolean | null>
  properties?: Record<string, JsonSchema>
  required?: string[]
  items?: JsonSchema | JsonSchema[]
  oneOf?: JsonSchema[]
  anyOf?: JsonSchema[]
  allOf?: JsonSchema[]
  additionalProperties?: boolean | JsonSchema
}

export type SchemaToTypesResult = {
  types: string
  warnings: string[]
}

const normalizeTypeName = (rawName: string): string => {
  // Convert arbitrary strings into a safe PascalCase identifier.
  const cleaned = rawName.replace(/[^a-zA-Z0-9]+/g, ' ').trim()
  if (!cleaned) return 'Root'
  const parts = cleaned.split(' ').filter(Boolean)
  const pascal = parts.map((part) => `${part[0].toUpperCase()}${part.slice(1)}`).join('')
  // Prefix when the identifier would otherwise start with a number.
  return /^\d/.test(pascal) ? `Schema${pascal}` : pascal
}

const formatPropertyKey = (key: string): string => {
  // Use string literal keys when the property name is not a safe identifier.
  if (/^[A-Za-z_$][\w$]*$/.test(key)) {
    return key
  }
  return JSON.stringify(key)
}

const stringifyLiteral = (value: string | number | boolean | null): string => {
  // JSON.stringify keeps string escaping consistent.
  if (typeof value === 'string') {
    return JSON.stringify(value)
  }
  return String(value)
}

const resolveTypeList = (schema: JsonSchema): string[] => {
  // Normalize "type" into a list for union handling.
  if (Array.isArray(schema.type)) {
    return schema.type
  }
  if (typeof schema.type === 'string') {
    return [schema.type]
  }
  return []
}

const buildObjectType = (schema: JsonSchema, warnings: string[]): string => {
  // Build a TypeScript object type from JSON Schema properties.
  const properties = schema.properties ?? {}
  const required = new Set(schema.required ?? [])
  const lines: string[] = []

  Object.entries(properties).forEach(([key, value]) => {
    const propKey = formatPropertyKey(key)
    const optionalMark = required.has(key) ? '' : '?'
    const propType = resolveSchemaType(value, warnings)
    lines.push(`  ${propKey}${optionalMark}: ${propType};`)
  })

  if (schema.additionalProperties) {
    // Represent additional properties with an index signature.
    const additionalType =
      schema.additionalProperties === true
        ? 'unknown'
        : resolveSchemaType(schema.additionalProperties, warnings)
    lines.push(`  [key: string]: ${additionalType};`)
  }

  if (lines.length === 0) {
    // Return an empty object type when no properties exist.
    return '{}'
  }

  return `{\n${lines.join('\n')}\n}`
}

const buildArrayType = (schema: JsonSchema, warnings: string[]): string => {
  // Arrays become tuples when items is an array, otherwise a list.
  if (Array.isArray(schema.items)) {
    const tupleItems = schema.items.map((item) => resolveSchemaType(item, warnings))
    return `[${tupleItems.join(', ')}]`
  }
  if (!schema.items) {
    warnings.push('Array type is missing "items" schema; defaulting to unknown[].')
    return 'unknown[]'
  }
  const itemType = resolveSchemaType(schema.items, warnings)
  return `${itemType}[]`
}

const resolveSchemaType = (schema: JsonSchema, warnings: string[]): string => {
  // enum/const should override the general type.
  if (schema.const !== undefined) {
    return stringifyLiteral(schema.const)
  }

  if (schema.enum && schema.enum.length > 0) {
    return schema.enum.map((value) => stringifyLiteral(value)).join(' | ')
  }

  if (schema.oneOf && schema.oneOf.length > 0) {
    return schema.oneOf.map((item) => resolveSchemaType(item, warnings)).join(' | ')
  }

  if (schema.anyOf && schema.anyOf.length > 0) {
    return schema.anyOf.map((item) => resolveSchemaType(item, warnings)).join(' | ')
  }

  if (schema.allOf && schema.allOf.length > 0) {
    return schema.allOf.map((item) => resolveSchemaType(item, warnings)).join(' & ')
  }

  const typeList = resolveTypeList(schema)

  // Infer object/array when "type" is missing but structure exists.
  if (typeList.length === 0) {
    if (schema.properties || schema.additionalProperties) {
      return buildObjectType(schema, warnings)
    }
    if (schema.items) {
      return buildArrayType(schema, warnings)
    }
    warnings.push('Schema type is missing; defaulting to unknown.')
    return 'unknown'
  }

  const resolvedTypes = typeList.map((typeName) => {
    switch (typeName) {
      case 'string':
        return 'string'
      case 'number':
      case 'integer':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'null':
        return 'null'
      case 'object':
        return buildObjectType(schema, warnings)
      case 'array':
        return buildArrayType(schema, warnings)
      default:
        warnings.push(`Unsupported schema type: ${typeName}`)
        return 'unknown'
    }
  })

  // Join multiple schema types into a union.
  return resolvedTypes.join(' | ')
}

export const generateTypeScriptFromSchema = (
  schema: JsonSchema,
  rootName = 'Root',
): SchemaToTypesResult => {
  // Normalize the root type name so it is a valid identifier.
  const safeName = normalizeTypeName(rootName)
  const warnings: string[] = []

  const typeBody = resolveSchemaType(schema, warnings)
  const types = `export type ${safeName} = ${typeBody};`

  return { types, warnings }
}
