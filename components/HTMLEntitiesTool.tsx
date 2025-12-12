'use client'

import { useState } from 'react'
import he from 'he'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HTMLEntitiesTool() {
  const { t } = useLanguage()
  // 입력 텍스트와 변환 결과를 상태로 관리해 엔티티 인코딩/디코딩을 제공합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const encode = () => {
    setOutput(he.encode(input, { useNamedReferences: true }))
  }

  const decode = () => {
    setOutput(he.decode(input))
  }

  return (
    <ToolCard
      title={`&lt;/&gt; ${t('htmlEntities.title')}`}
      description={t('htmlEntities.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('htmlEntities.input.label')}
          placeholder="<div>Hello & World</div>"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={encode}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('htmlEntities.actions.encode')}
          </button>
          <button
            onClick={decode}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('htmlEntities.actions.decode')}
          </button>
        </div>

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('htmlEntities.output.label')}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t('htmlEntities.common.title')}</h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <div>&lt; = &amp;lt;</div>
            <div>&gt; = &amp;gt;</div>
            <div>&amp; = &amp;amp;</div>
            <div>" = &amp;quot;</div>
            <div>' = &amp;#39;</div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
