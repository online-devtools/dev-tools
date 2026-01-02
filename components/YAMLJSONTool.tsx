'use client'

import { useState } from 'react'
import * as yaml from 'js-yaml'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolSchemas from './ToolSchemas'

export default function YAMLJSONTool() {
  const { t } = useLanguage()
  // 입력/출력/에러 상태를 관리하며 YAML ↔ JSON 변환 시 언어별 메시지를 제공합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const yamlToJson = () => {
    try {
      setError('')
      const obj = yaml.load(input)
      const json = JSON.stringify(obj, null, 2)
      setOutput(json)
    } catch (err: any) {
      setError(t('yamlJsonTool.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  const jsonToYaml = () => {
    try {
      setError('')
      const obj = JSON.parse(input)
      const yamlStr = yaml.dump(obj)
      setOutput(yamlStr)
    } catch (err: any) {
      setError(t('yamlJsonTool.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  return (
    <>
    <ToolSchemas toolKey="yaml-json" toolPath="/yaml-json" categoryKey="category.converters" categoryType="converter" />
    <ToolCard
      title={`🧾 ${t('yamlJsonTool.title')}`}
      description={t('yamlJsonTool.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('yamlJsonTool.input.label')}
          placeholder={t('yamlJsonTool.input.placeholder')}
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={yamlToJson}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('yamlJsonTool.actions.yamlToJson')}
          </button>
          <button
            onClick={jsonToYaml}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('yamlJsonTool.actions.jsonToYaml')}
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
          label={t('yamlJsonTool.output.label')}
        />
      </div>
    </ToolCard>
    </>
  )
}
