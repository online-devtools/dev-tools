'use client'

import { useState, useMemo } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

interface ModelConfig {
  name: string
  inputCostPer1M: number
  outputCostPer1M: number
}

const models: Record<string, ModelConfig> = {
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    inputCostPer1M: 10,
    outputCostPer1M: 30,
  },
  'gpt-4': {
    name: 'GPT-4',
    inputCostPer1M: 30,
    outputCostPer1M: 60,
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    inputCostPer1M: 0.5,
    outputCostPer1M: 1.5,
  },
  'claude-opus': {
    name: 'Claude 3 Opus',
    inputCostPer1M: 15,
    outputCostPer1M: 75,
  },
  'claude-sonnet': {
    name: 'Claude 3.5 Sonnet',
    inputCostPer1M: 3,
    outputCostPer1M: 15,
  },
  'claude-haiku': {
    name: 'Claude 3.5 Haiku',
    inputCostPer1M: 0.8,
    outputCostPer1M: 4,
  },
}

export default function TokenCounterTool() {
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')

  // Simple token estimation (approximation)
  // This is a simplified version. For production, use proper tokenizers like tiktoken
  const estimateTokens = (text: string): number => {
    if (!text) return 0

    // Average approximation: 1 token ≈ 4 characters for English
    // For more accuracy, we count words and apply a multiplier
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    const chars = text.length

    // Use word-based estimation if text has clear word boundaries
    if (words.length > 0) {
      // English: ~1.3 tokens per word on average
      // Add extra tokens for special characters and formatting
      return Math.ceil(words.length * 1.3 + chars * 0.02)
    }

    // Fallback to character-based estimation
    return Math.ceil(chars / 4)
  }

  const tokenCount = useMemo(() => estimateTokens(text), [text])
  const model = models[selectedModel]

  const inputCost = (tokenCount / 1_000_000) * model.inputCostPer1M
  const outputCost = (tokenCount / 1_000_000) * model.outputCostPer1M

  const stats = [
    { label: t('tokenCounter.characters'), value: text.length.toLocaleString() },
    {
      label: t('tokenCounter.words'),
      value: text.trim() ? text.trim().split(/\s+/).length.toLocaleString() : '0',
    },
    { label: t('tokenCounter.tokens'), value: tokenCount.toLocaleString() },
    {
      label: t('tokenCounter.inputCost'),
      value: `$${inputCost.toFixed(6)}`,
    },
    {
      label: t('tokenCounter.outputCost'),
      value: `$${outputCost.toFixed(6)}`,
    },
  ]

  return (
    <ToolCard
      title={t('tool.tokenCounter')}
      description={t('tokenCounter.description')}
    >
      <div className="space-y-4">
        {/* Model Selector */}
        <div>
          <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('tokenCounter.selectModel')}
          </label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <optgroup label="OpenAI GPT">
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </optgroup>
            <optgroup label="Anthropic Claude">
              <option value="claude-opus">Claude 3 Opus</option>
              <option value="claude-sonnet">Claude 3.5 Sonnet</option>
              <option value="claude-haiku">Claude 3.5 Haiku</option>
            </optgroup>
          </select>
        </div>

        {/* Input Text */}
        <TextAreaWithCopy
          value={text}
          onChange={setText}
          label={t('tokenCounter.inputText')}
          placeholder={t('tokenCounter.placeholder')}
          rows={10}
        />

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>{t('tokenCounter.note')}:</strong> {t('tokenCounter.noteText')}
          </p>
        </div>

        {/* Pricing Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {t('tokenCounter.pricingInfo')}
          </h3>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-medium">{model.name}</span>
            </p>
            <p>
              {t('tokenCounter.input')}: ${model.inputCostPer1M} / 1M {t('tokenCounter.tokens').toLowerCase()}
            </p>
            <p>
              {t('tokenCounter.output')}: ${model.outputCostPer1M} / 1M {t('tokenCounter.tokens').toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
