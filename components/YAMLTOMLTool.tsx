'use client'

import { useState } from 'react'
import * as yaml from 'js-yaml'
import * as TOML from '@iarna/toml'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolSchemas from './ToolSchemas'

export default function YAMLTOMLTool() {
  const { t } = useLanguage()
  // YAML/TOML 입력과 결과, 에러 상태를 관리하며 번역된 상태 메시지를 제공합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const yamlToToml = () => {
    try {
      setError('')
      const obj = yaml.load(input)
      const tomlStr = TOML.stringify(obj as any)
      setOutput(tomlStr)
    } catch (err: any) {
      setError(t('yamlTomlTool.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  const tomlToYaml = () => {
    try {
      setError('')
      const obj = TOML.parse(input)
      const yamlStr = yaml.dump(obj)
      setOutput(yamlStr)
    } catch (err: any) {
      setError(t('yamlTomlTool.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  return (
    <>
    <ToolSchemas toolKey="yaml-toml" toolPath="/yaml-toml" categoryKey="category.converters" categoryType="converter" />
    <ToolCard
      title={`📑 ${t('yamlTomlTool.title')}`}
      description={t('yamlTomlTool.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('yamlTomlTool.input.label')}
          placeholder={t('yamlTomlTool.input.placeholder')}
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={yamlToToml}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('yamlTomlTool.actions.yamlToToml')}
          </button>
          <button
            onClick={tomlToYaml}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('yamlTomlTool.actions.tomlToYaml')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('yamlTomlTool.output.label')}
        />
      </div>
    </ToolCard>
    </>
  )
}
