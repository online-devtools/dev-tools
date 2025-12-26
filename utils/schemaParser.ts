// Lightweight SQL DDL parser to extract tables, columns, and foreign keys.
// This is intentionally heuristic-driven to avoid heavy SQL parsers in the client.

export type SchemaColumn = {
  name: string
  type: string
  isPrimaryKey: boolean
}

export type SchemaForeignKey = {
  column: string
  referencesTable: string
  referencesColumn: string
}

export type SchemaTable = {
  name: string
  columns: SchemaColumn[]
  primaryKeys: string[]
  foreignKeys: SchemaForeignKey[]
}

export type SchemaParseResult = {
  tables: SchemaTable[]
}

const normalizeSql = (input: string): string => {
  // Collapse multiple whitespace characters to simplify regex parsing.
  return input.replace(/\s+/g, ' ').trim()
}

const extractCreateTableBlocks = (input: string): Array<{ name: string; body: string }> => {
  // Match CREATE TABLE statements and manually find the matching closing parenthesis.
  // This avoids premature termination when column types include parentheses.
  const regex = /create\s+table\s+([`"\[]?)([\w.-]+)\1\s*\(/gi
  const blocks: Array<{ name: string; body: string }> = []
  let match = regex.exec(input)

  while (match) {
    const name = match[2]
    const bodyStart = match.index + match[0].length
    let index = bodyStart
    let depth = 1

    // Walk the string until we close the opening parenthesis.
    while (index < input.length && depth > 0) {
      const char = input[index]
      if (char === '(') depth += 1
      if (char === ')') depth -= 1
      index += 1
    }

    const body = input.slice(bodyStart, Math.max(bodyStart, index - 1)).trim()

    blocks.push({
      name,
      body,
    })

    // Continue searching after this table definition.
    regex.lastIndex = index
    match = regex.exec(input)
  }

  return blocks
}

const splitSqlSegments = (body: string): string[] => {
  // Split by commas that are not inside parentheses (handles DECIMAL(10,2) etc.).
  const segments: string[] = []
  let depth = 0
  let current = ''

  for (const char of body) {
    if (char === '(') depth += 1
    if (char === ')') depth = Math.max(0, depth - 1)

    if (char === ',' && depth === 0) {
      segments.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  if (current.trim()) {
    segments.push(current.trim())
  }

  return segments
}

const parseColumns = (body: string): SchemaColumn[] => {
  // Split on top-level commas so column types with commas stay intact.
  const segments = splitSqlSegments(body)
  const columns: SchemaColumn[] = []

  segments.forEach((segment) => {
    // Skip constraint lines such as PRIMARY KEY or FOREIGN KEY.
    if (/^(primary|foreign|constraint)\s+/i.test(segment)) {
      return
    }

    const match = segment.match(/^([`"\[]?)([\w.-]+)\1\s+([A-Za-z0-9()_,\s]+)/)
    if (!match) return

    const [, , name, type] = match
    const isPrimaryKey = /primary\s+key/i.test(segment)

    columns.push({
      name,
      type: type.trim(),
      isPrimaryKey,
    })
  })

  return columns
}

const parsePrimaryKeys = (body: string): string[] => {
  // Capture PRIMARY KEY (col1, col2) constraints.
  const match = body.match(/primary\s+key\s*\(([^)]+)\)/i)
  if (!match) return []

  return match[1].split(',').map((column) => column.trim().replace(/[`"\[\]]/g, ''))
}

const parseForeignKeys = (body: string): SchemaForeignKey[] => {
  // Match FOREIGN KEY (col) REFERENCES table(col) clauses.
  const regex = /foreign\s+key\s*\(([^)]+)\)\s+references\s+([`"\[]?)([\w.-]+)\2\s*\(([^)]+)\)/gi
  const keys: SchemaForeignKey[] = []
  let match = regex.exec(body)

  while (match) {
    const column = match[1].split(',')[0].trim().replace(/[`"\[\]]/g, '')
    const referencesTable = match[3]
    const referencesColumn = match[4].split(',')[0].trim().replace(/[`"\[\]]/g, '')

    keys.push({ column, referencesTable, referencesColumn })
    match = regex.exec(body)
  }

  return keys
}

export const parseSqlSchema = (input: string): SchemaParseResult => {
  const normalized = normalizeSql(input)
  const blocks = extractCreateTableBlocks(normalized)

  const tables = blocks.map((block) => {
    const columns = parseColumns(block.body)
    const primaryKeys = parsePrimaryKeys(block.body)
    const foreignKeys = parseForeignKeys(block.body)

    // Mark primary keys discovered via constraint clauses.
    const columnsWithPk = columns.map((column) => ({
      ...column,
      isPrimaryKey: column.isPrimaryKey || primaryKeys.includes(column.name),
    }))

    return {
      name: block.name,
      columns: columnsWithPk,
      primaryKeys,
      foreignKeys,
    }
  })

  return { tables }
}
