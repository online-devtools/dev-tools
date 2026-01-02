'use client'

import { useState } from 'react'
import { ulid } from 'ulid'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolSchemas from './ToolSchemas'

export default function ULIDTool() {
  const { t } = useLanguage()
  // 생성 요청 수, 생성 결과를 상태로 관리합니다.
  const [output, setOutput] = useState('')
  const [count, setCount] = useState('1')

  // 입력한 개수만큼 ULID를 생성하고, 유효하지 않은 값이면 번역된 오류를 보여줍니다.
  const generateULID = () => {
    try {
      const num = parseInt(count, 10)
      if (isNaN(num) || num < 1 || num > 1000) {
        setOutput(t('ulidTool.error.count'))
        return
      }

      const ulids: string[] = []
      for (let i = 0; i < num; i += 1) {
        ulids.push(ulid())
      }

      setOutput(ulids.join('\n'))
    } catch {
      setOutput(t('ulidTool.error.generate'))
    }
  }

  return (
    <>
    <ToolSchemas toolKey="ulid" toolPath="/ulid" categoryKey="category.generators" categoryType="generator" />
    <ToolCard
      title={`🆔 ${t('ulidTool.title')}`}
      description={t('ulidTool.description')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ulidTool.count.label')}
          </label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="1"
            max="1000"
          />
        </div>

        <button
          onClick={generateULID}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('ulidTool.action.generate')}
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('ulidTool.result.label')}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            {t('ulidTool.info.title')}
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• {t('ulidTool.info.bullet1')}</li>
            <li>• {t('ulidTool.info.bullet2')}</li>
            <li>• {t('ulidTool.info.bullet3')}</li>
            <li>• {t('ulidTool.info.bullet4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
    </>
  )
}
