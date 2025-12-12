'use client'

import { useState } from 'react'
import * as TOML from '@iarna/toml'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function JSONTOMLTool() {
  const { t } = useLanguage()
  // JSON 입력/출력과 에러 상태를 관리해 양방향 변환 시 번역된 메시지를 노출합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const jsonToToml = () => {
    try {
      setError('')
      const obj = JSON.parse(input)
      const tomlStr = TOML.stringify(obj)
      setOutput(tomlStr)
    } catch (err: any) {
      setError(t('jsonTomlTool.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  const tomlToJson = () => {
    try {
      setError('')
      const obj = TOML.parse(input)
      const jsonStr = JSON.stringify(obj, null, 2)
      setOutput(jsonStr)
    } catch (err: any) {
      setError(t('jsonTomlTool.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  return (
    <ToolCard
      title={`📝 ${t('jsonTomlTool.title')}`}
      description={t('jsonTomlTool.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('jsonTomlTool.input.label')}
          placeholder={t('jsonTomlTool.input.placeholder')}
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={jsonToToml}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('jsonTomlTool.actions.jsonToToml')}
          </button>
          <button
            onClick={tomlToJson}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('jsonTomlTool.actions.tomlToJson')}
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
          label={t('jsonTomlTool.output.label')}
        />
      </div>
    </ToolCard>
  )
}
