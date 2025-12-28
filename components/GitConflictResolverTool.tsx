'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ConflictBlock {
    id: number
    ours: string
    theirs: string
    resolution: 'ours' | 'theirs' | 'both' | 'manual'
    manualContent?: string
}

function parseConflicts(text: string): ConflictBlock[] {
    const conflictPattern = /<<<<<<< .*?\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> .*?(?:\n|$)/g
    const blocks: ConflictBlock[] = []
    let match: RegExpExecArray | null
    let id = 0

    while ((match = conflictPattern.exec(text)) !== null) {
        blocks.push({
            id: id++,
            ours: match[1].trimEnd(),
            theirs: match[2].trimEnd(),
            resolution: 'ours',
        })
    }

    return blocks
}

function resolveConflicts(originalText: string, blocks: ConflictBlock[]): string {
    let result = originalText
    const conflictPattern = /<<<<<<< .*?\n[\s\S]*?=======\n[\s\S]*?>>>>>>> .*?(?:\n|$)/g
    let blockIndex = 0

    result = result.replace(conflictPattern, () => {
        const block = blocks[blockIndex++]
        if (!block) return ''

        switch (block.resolution) {
            case 'ours':
                return block.ours + '\n'
            case 'theirs':
                return block.theirs + '\n'
            case 'both':
                return block.ours + '\n' + block.theirs + '\n'
            case 'manual':
                return (block.manualContent || '') + '\n'
            default:
                return block.ours + '\n'
        }
    })

    return result
}

export default function GitConflictResolverTool() {
    const { t } = useLanguage()
    const [input, setInput] = useState('')
    const [conflicts, setConflicts] = useState<ConflictBlock[]>([])
    const [resolved, setResolved] = useState('')
    const [copied, setCopied] = useState(false)

    const handleParse = () => {
        const parsed = parseConflicts(input)
        setConflicts(parsed)
        if (parsed.length > 0) {
            setResolved(resolveConflicts(input, parsed))
        } else {
            setResolved('')
        }
    }

    const handleResolutionChange = (id: number, resolution: ConflictBlock['resolution']) => {
        const updated = conflicts.map((c) =>
            c.id === id ? { ...c, resolution } : c
        )
        setConflicts(updated)
        setResolved(resolveConflicts(input, updated))
    }

    const handleManualEdit = (id: number, content: string) => {
        const updated = conflicts.map((c) =>
            c.id === id ? { ...c, manualContent: content } : c
        )
        setConflicts(updated)
        setResolved(resolveConflicts(input, updated))
    }

    const handleClear = () => {
        setInput('')
        setConflicts([])
        setResolved('')
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(resolved)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const sampleConflict = `function greet(name) {
<<<<<<< HEAD
  return "Hello, " + name + "!";
=======
  return \`Hello, \${name}!\`;
>>>>>>> feature/template-literals
}

const config = {
<<<<<<< HEAD
  port: 3000,
  debug: true
=======
  port: 8080,
  debug: false,
  logging: true
>>>>>>> main
};`

    const handleLoadSample = () => {
        setInput(sampleConflict)
        const parsed = parseConflicts(sampleConflict)
        setConflicts(parsed)
        setResolved(resolveConflicts(sampleConflict, parsed))
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {t('gitConflict.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('gitConflict.description')}
                </p>

                {/* Input Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('gitConflict.input.label')}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('gitConflict.input.placeholder')}
                        className="w-full h-48 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={handleParse}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        {t('gitConflict.actions.parse')}
                    </button>
                    <button
                        onClick={handleLoadSample}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                        {t('gitConflict.actions.sample')}
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                        {t('common.clear')}
                    </button>
                </div>

                {/* Conflicts Display */}
                {conflicts.length > 0 && (
                    <div className="space-y-4 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('gitConflict.conflicts.title', { count: conflicts.length })}
                        </h2>
                        {conflicts.map((conflict) => (
                            <div
                                key={conflict.id}
                                className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
                            >
                                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                                    {t('gitConflict.conflicts.block')} #{conflict.id + 1}
                                </div>
                                <div className="grid md:grid-cols-2 gap-0">
                                    {/* Ours */}
                                    <div className="border-r border-b md:border-b-0 border-gray-300 dark:border-gray-600">
                                        <div className="bg-red-100 dark:bg-red-900/30 px-3 py-1 text-sm font-medium text-red-700 dark:text-red-400 border-b border-gray-300 dark:border-gray-600">
                                            {t('gitConflict.conflicts.ours')} (HEAD)
                                        </div>
                                        <pre className="p-3 text-sm font-mono text-gray-800 dark:text-gray-200 bg-red-50 dark:bg-red-900/10 whitespace-pre-wrap overflow-x-auto">
                                            {conflict.ours}
                                        </pre>
                                    </div>
                                    {/* Theirs */}
                                    <div>
                                        <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400 border-b border-gray-300 dark:border-gray-600">
                                            {t('gitConflict.conflicts.theirs')}
                                        </div>
                                        <pre className="p-3 text-sm font-mono text-gray-800 dark:text-gray-200 bg-green-50 dark:bg-green-900/10 whitespace-pre-wrap overflow-x-auto">
                                            {conflict.theirs}
                                        </pre>
                                    </div>
                                </div>
                                {/* Resolution Options */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-t border-gray-300 dark:border-gray-600">
                                    <div className="flex flex-wrap gap-3">
                                        {(['ours', 'theirs', 'both', 'manual'] as const).map((option) => (
                                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`resolution-${conflict.id}`}
                                                    checked={conflict.resolution === option}
                                                    onChange={() => handleResolutionChange(conflict.id, option)}
                                                    className="text-blue-500 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {t(`gitConflict.resolution.${option}`)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {conflict.resolution === 'manual' && (
                                        <textarea
                                            value={conflict.manualContent || ''}
                                            onChange={(e) => handleManualEdit(conflict.id, e.target.value)}
                                            placeholder={t('gitConflict.resolution.manualPlaceholder')}
                                            className="mt-3 w-full h-24 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {conflicts.length === 0 && input && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {t('gitConflict.conflicts.empty')}
                    </div>
                )}

                {/* Resolved Output */}
                {resolved && (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('gitConflict.result.label')}
                            </label>
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                            >
                                {copied ? t('common.copied') : t('common.copy')}
                            </button>
                        </div>
                        <pre className="w-full p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white whitespace-pre-wrap overflow-x-auto">
                            {resolved}
                        </pre>
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    {t('gitConflict.info.title')}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                    <li>{t('gitConflict.info.bullet1')}</li>
                    <li>{t('gitConflict.info.bullet2')}</li>
                    <li>{t('gitConflict.info.bullet3')}</li>
                    <li>{t('gitConflict.info.bullet4')}</li>
                </ul>
            </div>
        </div>
    )
}
