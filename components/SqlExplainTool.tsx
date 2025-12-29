'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type ExplainNode = {
  id: string
  name: string
  cost?: number
  rows?: number
  actualTime?: number
  table?: string
  accessType?: string
  depth: number
}

const safeJsonParse = (value: string): { ok: boolean; data?: unknown } => {
  try {
    return { ok: true, data: JSON.parse(value) }
  } catch {
    return { ok: false }
  }
}

const parsePostgresText = (lines: string[]): ExplainNode[] => {
  const nodes: ExplainNode[] = []
  const regex = /(\s*)(?:->\s*)?(.+?)\s+\(cost=([\d.]+)\.\.([\d.]+)\s+rows=([\d.]+)/

  lines.forEach((line, index) => {
    const match = line.match(regex)
    if (!match) return
    const depth = Math.floor(match[1].length / 2)
    nodes.push({
      id: `${index}-${match[2]}`,
      name: match[2].trim(),
      cost: Number(match[4]),
      rows: Number(match[5]),
      depth,
    })
  })

  return nodes
}

const parsePostgresJson = (plan: any, depth = 0): ExplainNode[] => {
  if (!plan) return []
  const nodes: ExplainNode[] = []
  const node: ExplainNode = {
    id: `${depth}-${plan['Node Type'] || 'Node'}`,
    name: plan['Node Type'] || 'Node',
    cost: plan['Total Cost'],
    rows: plan['Plan Rows'],
    actualTime: plan['Actual Total Time'],
    table: plan['Relation Name'],
    depth,
  }
  nodes.push(node)
  const children = Array.isArray(plan.Plans) ? plan.Plans : []
  children.forEach((child: any) => {
    nodes.push(...parsePostgresJson(child, depth + 1))
  })
  return nodes
}

const parseMysqlJson = (block: any, depth = 0): ExplainNode[] => {
  const nodes: ExplainNode[] = []
  if (!block) return nodes

  if (block.table) {
    nodes.push({
      id: `${depth}-${block.table.table_name}`,
      name: 'Table Access',
      table: block.table.table_name,
      accessType: block.table.access_type,
      rows: block.table.rows,
      cost: block.table.cost_info?.prefix_cost,
      depth,
    })
  }

  if (block.nested_loop && Array.isArray(block.nested_loop)) {
    block.nested_loop.forEach((child: any) => {
      nodes.push(...parseMysqlJson(child, depth + 1))
    })
  }

  if (block.grouping_operation) {
    nodes.push(...parseMysqlJson(block.grouping_operation, depth + 1))
  }

  if (block.union_result) {
    nodes.push(...parseMysqlJson(block.union_result, depth + 1))
  }

  if (block.query_block) {
    nodes.push(...parseMysqlJson(block.query_block, depth + 1))
  }

  return nodes
}

export default function SqlExplainTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [nodes, setNodes] = useState<ExplainNode[]>([])
  const [error, setError] = useState('')

  const analyze = () => {
    if (!input.trim()) {
      setError(t('sqlExplain.error.empty'))
      setNodes([])
      return
    }

    const json = safeJsonParse(input)
    let parsed: ExplainNode[] = []

    if (json.ok && json.data) {
      const data = json.data as any
      if (data?.Plan) {
        parsed = parsePostgresJson(data.Plan)
      } else if (Array.isArray(data) && data[0]?.Plan) {
        parsed = parsePostgresJson(data[0].Plan)
      } else if (data?.query_block) {
        parsed = parseMysqlJson(data.query_block)
      }
    }

    if (parsed.length === 0) {
      parsed = parsePostgresText(input.split('\n'))
    }

    if (parsed.length === 0) {
      setError(t('sqlExplain.error.format'))
      setNodes([])
      return
    }

    setNodes(parsed)
    setError('')
  }

  const warnings = useMemo(() => {
    return nodes
      .filter((node) => node.name.includes('Seq Scan') || node.accessType === 'ALL')
      .map((node) => `${node.name}${node.table ? ` (${node.table})` : ''}`)
  }, [nodes])

  const summaryText = useMemo(() => {
    if (nodes.length === 0) return ''
    const maxCost = Math.max(...nodes.map((node) => node.cost || 0))
    return [
      `Nodes: ${nodes.length}`,
      `Max cost: ${maxCost.toFixed(2)}`,
      warnings.length ? `Warnings: ${warnings.length}` : 'Warnings: 0',
    ].join('\n')
  }, [nodes, warnings])

  return (
    <ToolCard title={`🧮 ${t('sqlExplain.title')}`} description={t('sqlExplain.description')}>
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('sqlExplain.input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={t('sqlExplain.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={analyze}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            {t('sqlExplain.analyze')}
          </button>
          <button
            onClick={() => {
              setInput('')
              setNodes([])
              setError('')
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('sqlExplain.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {nodes.length > 0 && (
          <div className="space-y-3">
            {warnings.length > 0 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200 rounded-lg text-sm">
                {t('sqlExplain.warning')}: {warnings.join(', ')}
              </div>
            )}
            <div className="space-y-2">
              {nodes.map((node) => (
                <div key={node.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-800 dark:text-gray-200" style={{ paddingLeft: `${node.depth * 12}px` }}>
                    {node.name}{node.table ? ` · ${node.table}` : ''}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {node.cost !== undefined ? `cost ${node.cost.toFixed(2)} ` : ''}
                    {node.rows !== undefined ? `rows ${node.rows}` : ''}
                    {node.accessType ? `· ${node.accessType}` : ''}
                  </div>
                </div>
              ))}
            </div>
            <TextAreaWithCopy value={summaryText} readOnly rows={4} />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
