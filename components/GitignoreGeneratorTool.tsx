'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

const templates: Record<string, string[]> = {
  node: [
    '# Node',
    'node_modules/',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    '.pnp.*',
    '.yarn/',
    'dist/',
    'build/',
    '.env',
    '.env.local',
    '.env.*.local',
  ],
  python: [
    '# Python',
    '__pycache__/',
    '*.py[cod]',
    '*$py.class',
    '*.so',
    '.Python',
    'env/',
    'venv/',
    'ENV/',
    'pip-log.txt',
    '.pytest_cache/',
  ],
  java: [
    '# Java',
    '*.class',
    '*.jar',
    '*.war',
    '*.ear',
    'target/',
    '.gradle/',
    'build/',
    '.idea/',
    '*.iml',
  ],
  react: [
    '# React',
    'build/',
    '.DS_Store',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    'npm-debug.log*',
  ],
  nextjs: [
    '# Next.js',
    '.next/',
    'out/',
    'build/',
    '.vercel',
    '*.tsbuildinfo',
    'next-env.d.ts',
  ],
  vue: [
    '# Vue',
    '.DS_Store',
    'node_modules/',
    'dist/',
    'dist-ssr/',
    '*.local',
  ],
  go: [
    '# Go',
    '*.exe',
    '*.exe~',
    '*.dll',
    '*.so',
    '*.dylib',
    '*.test',
    'vendor/',
  ],
  rust: [
    '# Rust',
    'target/',
    '**/*.rs.bk',
    'Cargo.lock',
  ],
  macos: [
    '# macOS',
    '.DS_Store',
    '.AppleDouble',
    '.LSOverride',
    '._*',
  ],
  windows: [
    '# Windows',
    'Thumbs.db',
    'ehthumbs.db',
    'Desktop.ini',
    '$RECYCLE.BIN/',
  ],
  linux: [
    '# Linux',
    '*~',
    '.fuse_hidden*',
    '.directory',
    '.Trash-*',
  ],
  vscode: [
    '# VSCode',
    '.vscode/',
    '*.code-workspace',
  ],
  jetbrains: [
    '# JetBrains IDEs',
    '.idea/',
    '*.iml',
    '*.ipr',
    '*.iws',
  ],
}

export default function GitignoreGeneratorTool() {
  const { t } = useLanguage()
  const [selected, setSelected] = useState<string[]>([])
  const [output, setOutput] = useState('')
  const [customLines, setCustomLines] = useState('')

  const toggleTemplate = (key: string) => {
    if (selected.includes(key)) {
      setSelected(selected.filter(k => k !== key))
    } else {
      setSelected([...selected, key])
    }
  }

  const generateGitignore = () => {
    const lines: string[] = []

    // Add selected templates
    selected.forEach(key => {
      if (templates[key]) {
        lines.push(...templates[key], '')
      }
    })

    // Add custom lines
    if (customLines.trim()) {
      lines.push('# Custom', ...customLines.split('\n'), '')
    }

    setOutput(lines.join('\n').trim())
  }

  const handleClear = () => {
    setSelected([])
    setOutput('')
    setCustomLines('')
  }

  const handleSelectAll = () => {
    setSelected(Object.keys(templates))
  }

  return (
    <ToolCard
      title={t('tool.gitignoreGenerator')}
      description={t('gitignore.description')}
    >
      <div className="space-y-4">
        {/* Template Selection */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {t('gitignore.selectTemplates')}
            </h3>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t('gitignore.selectAll')}
            </button>
          </div>

          {/* Programming Languages */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('gitignore.languages')}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['node', 'python', 'java', 'go', 'rust'].map(key => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(key)}
                    onChange={() => toggleTemplate(key)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Frameworks */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('gitignore.frameworks')}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['react', 'nextjs', 'vue'].map(key => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(key)}
                    onChange={() => toggleTemplate(key)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {key === 'nextjs' ? 'Next.js' : key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Operating Systems */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('gitignore.os')}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['macos', 'windows', 'linux'].map(key => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(key)}
                    onChange={() => toggleTemplate(key)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* IDEs */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('gitignore.ides')}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['vscode', 'jetbrains'].map(key => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(key)}
                    onChange={() => toggleTemplate(key)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {key === 'vscode' ? 'VS Code' : 'JetBrains'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Lines */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('gitignore.customPatterns')}
          </label>
          <textarea
            value={customLines}
            onChange={(e) => setCustomLines(e.target.value)}
            placeholder={t('gitignore.customPlaceholder')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={generateGitignore}
            className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('gitignore.generate')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('common.clear')}
          </button>
        </div>

        {/* Output */}
        {output && (
          <TextAreaWithCopy
            value={output}
            readOnly
            label={t('gitignore.output')}
            rows={15}
          />
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {t('gitignore.infoTitle')}
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>{t('gitignore.info1')}</li>
            <li>{t('gitignore.info2')}</li>
            <li>{t('gitignore.info3')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
