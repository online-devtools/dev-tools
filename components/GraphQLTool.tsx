'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { parse, print } from 'graphql'

export default function GraphQLTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleFormat = () => {
    try {
      setError('')
      const ast = parse(input)
      const formatted = print(ast)
      setOutput(formatted)
    } catch (e) {
      setError(t('graphqlTool.error.format', { message: e instanceof Error ? e.message : t('graphqlTool.error.invalid') }))
      setOutput('')
    }
  }

  const handleMinify = () => {
    try {
      setError('')
      const ast = parse(input)
      const printed = print(ast)
      // Remove extra whitespace and newlines
      const minified = printed
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        .trim()
      setOutput(minified)
    } catch (e) {
      setError(t('graphqlTool.error.minify', { message: e instanceof Error ? e.message : t('graphqlTool.error.invalid') }))
      setOutput('')
    }
  }

  const handleValidate = () => {
    try {
      setError('')
      parse(input)
      setOutput(t('graphqlTool.validate.success'))
    } catch (e) {
      setError(t('graphqlTool.validate.fail', { message: e instanceof Error ? e.message : '' }))
      setOutput('')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const handleLoadExample = () => {
    const example = `query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    posts {
      id
      title
      createdAt
    }
  }
}

mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    content
    author {
      id
      name
    }
  }
}`
    setInput(example)
    setOutput('')
    setError('')
  }

  return (
    <ToolCard
      title={`🔷 ${t('graphqlTool.title')}`}
      description={t('graphqlTool.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          placeholder={t('graphqlTool.input.placeholder')}
          label={t('graphqlTool.input.label')}
          rows={10}
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleFormat}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('graphqlTool.actions.format')}
          </button>
          <button
            onClick={handleMinify}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('graphqlTool.actions.minify')}
          </button>
          <button
            onClick={handleValidate}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('graphqlTool.actions.validate')}
          </button>
          <button
            onClick={handleLoadExample}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('graphqlTool.actions.example')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('graphqlTool.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          placeholder={t('graphqlTool.result.placeholder')}
          readOnly
          label={t('graphqlTool.result.label')}
          rows={10}
        />

        {/* Usage Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            {t('graphqlTool.tips.title')}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>{t('graphqlTool.tips.format')}</li>
            <li>{t('graphqlTool.tips.minify')}</li>
            <li>{t('graphqlTool.tips.validate')}</li>
            <li>{t('graphqlTool.tips.example')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
