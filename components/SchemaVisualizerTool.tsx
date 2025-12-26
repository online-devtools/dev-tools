'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { parseSqlSchema, SchemaTable } from '@/utils/schemaParser'

// Provide a starter schema so users can see results without pasting their own DDL.
const SAMPLE_DDL = `CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP
);

CREATE TABLE projects (
  id INT PRIMARY KEY,
  owner_id INT,
  name VARCHAR(120),
  created_at TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE project_members (
  id INT PRIMARY KEY,
  project_id INT,
  user_id INT,
  role VARCHAR(40),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`

const toMermaidId = (name: string): string => {
  // Mermaid identifiers cannot include spaces or special punctuation, so normalize safely.
  return name.replace(/[^A-Za-z0-9_]/g, '_').toUpperCase()
}

const buildMermaidDiagram = (tables: SchemaTable[]): string => {
  // Skip output when no tables were detected to keep the UI clean.
  if (tables.length === 0) return ''

  // Mermaid ER diagrams start with the erDiagram keyword.
  const lines: string[] = ['erDiagram']

  tables.forEach((table) => {
    const tableId = toMermaidId(table.name)
    lines.push(`  ${tableId} {`)

    table.columns.forEach((column) => {
      // Use the column type and name so Mermaid shows the field list.
      const marker = column.isPrimaryKey ? 'PK' : ''
      lines.push(`    ${column.type} ${column.name} ${marker}`.trim())
    })

    lines.push('  }')
  })

  tables.forEach((table) => {
    // Render foreign key relationships as one-to-many edges.
    table.foreignKeys.forEach((foreignKey) => {
      const source = toMermaidId(table.name)
      const target = toMermaidId(foreignKey.referencesTable)
      // Use a simple one-to-many style since we do not have full cardinality hints.
      lines.push(`  ${source} }o--|| ${target} : "${foreignKey.column}"`)
    })
  })

  return lines.join('\n')
}

export default function SchemaVisualizerTool() {
  const { t } = useLanguage()
  // Store the raw SQL so users can paste full DDL files.
  const [ddl, setDdl] = useState(SAMPLE_DDL)

  // Parse the DDL into table metadata whenever input changes.
  const parsed = useMemo(() => parseSqlSchema(ddl), [ddl])
  // Translate the parsed tables into Mermaid syntax for external diagram tools.
  const mermaid = useMemo(() => buildMermaidDiagram(parsed.tables), [parsed.tables])

  return (
    <ToolCard
      title={`🗺️ ${t('schemaVisualizer.title')}`}
      description={t('schemaVisualizer.description')}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('schemaVisualizer.input.label')}
          </label>
          <textarea
            value={ddl}
            onChange={(e) => setDdl(e.target.value)}
            placeholder={t('schemaVisualizer.input.placeholder')}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-xs"
          />
        </div>

        {parsed.tables.length === 0 ? (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
            {t('schemaVisualizer.empty')}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {parsed.tables.map((table) => (
                <div
                  key={table.name}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4 space-y-2"
                >
                  <div className="font-semibold text-gray-800 dark:text-gray-100">
                    {table.name}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    {table.columns.map((column) => (
                      <div key={`${table.name}-${column.name}`} className="flex items-center gap-2">
                        <span className="font-mono text-gray-800 dark:text-gray-100">
                          {column.name}
                        </span>
                        <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {column.type}
                        </span>
                        {column.isPrimaryKey && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                            PK
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {table.foreignKeys.length > 0 && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {t('schemaVisualizer.foreignKeys')}
                      </div>
                      <ul className="text-xs text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                        {table.foreignKeys.map((foreignKey) => (
                          <li key={`${table.name}-${foreignKey.column}`}>
                            {foreignKey.column} → {foreignKey.referencesTable}.{foreignKey.referencesColumn}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <TextAreaWithCopy
              value={mermaid}
              label={t('schemaVisualizer.output.label')}
              placeholder={t('schemaVisualizer.output.placeholder')}
              rows={8}
              readOnly
            />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
