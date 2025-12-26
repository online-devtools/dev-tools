import { describe, expect, it } from 'vitest'
import { parseSqlSchema } from '@/utils/schemaParser'

// SQL schema parsing should detect tables, columns, and foreign keys.
describe('schemaParser utils', () => {
  it('parses CREATE TABLE statements into table metadata', () => {
    const input = `
      CREATE TABLE users (
        id INT PRIMARY KEY,
        email VARCHAR(255),
        role_id INT,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      );

      CREATE TABLE roles (
        id INT PRIMARY KEY,
        name VARCHAR(50)
      );
    `

    const result = parseSqlSchema(input)

    expect(result.tables.map((table) => table.name)).toEqual(['users', 'roles'])
    expect(result.tables[0].foreignKeys).toEqual([
      { column: 'role_id', referencesTable: 'roles', referencesColumn: 'id' },
    ])
  })
})
