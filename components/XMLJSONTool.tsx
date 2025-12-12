'use client'

import { useState } from 'react'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function XMLJSONTool() {
  const { t } = useLanguage()
  // XML/JSON 입력값과 결과, 에러 상태를 관리해 번역된 피드백을 제공합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const xmlToJson = () => {
    try {
      setError('')
      const parser = new XMLParser()
      const obj = parser.parse(input)
      const jsonStr = JSON.stringify(obj, null, 2)
      setOutput(jsonStr)
    } catch (err: any) {
      setError(t('xmlJsonTool.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  const jsonToXml = () => {
    try {
      setError('')
      const obj = JSON.parse(input)
      const builder = new XMLBuilder({ format: true })
      const xmlStr = builder.build(obj)
      setOutput(xmlStr)
    } catch (err: any) {
      setError(t('xmlJsonTool.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  return (
    <ToolCard
      title={`🗂️ ${t('xmlJsonTool.title')}`}
      description={t('xmlJsonTool.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('xmlJsonTool.input.label')}
          placeholder={t('xmlJsonTool.input.placeholder')}
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={xmlToJson}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('xmlJsonTool.actions.xmlToJson')}
          </button>
          <button
            onClick={jsonToXml}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('xmlJsonTool.actions.jsonToXml')}
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
          label={t('xmlJsonTool.output.label')}
        />
      </div>
    </ToolCard>
  )
}
