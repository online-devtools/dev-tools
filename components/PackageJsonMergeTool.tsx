'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface MergeResult {
    merged: Record<string, unknown>
    conflicts: ConflictItem[]
}

interface ConflictItem {
    path: string
    left: string
    right: string
}

type MergeStrategy = 'latest' | 'left' | 'right'

function parseJSON(text: string): Record<string, unknown> | null {
    try {
        return JSON.parse(text)
    } catch {
        return null
    }
}

function compareVersions(v1: string, v2: string): number {
    // Remove ^ ~ >= <= > < prefixes
    const clean1 = v1.replace(/^[\^~>=<]+/, '')
    const clean2 = v2.replace(/^[\^~>=<]+/, '')

    const parts1 = clean1.split('.').map(p => parseInt(p, 10) || 0)
    const parts2 = clean2.split('.').map(p => parseInt(p, 10) || 0)

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0
        const p2 = parts2[i] || 0
        if (p1 > p2) return 1
        if (p1 < p2) return -1
    }
    return 0
}

function mergePackages(
    left: Record<string, unknown>,
    right: Record<string, unknown>,
    strategy: MergeStrategy
): MergeResult {
    const merged: Record<string, unknown> = {}
    const conflicts: ConflictItem[] = []
    const allKeys = new Set([...Object.keys(left), ...Object.keys(right)])

    for (const key of allKeys) {
        const leftVal = left[key]
        const rightVal = right[key]

        if (leftVal === undefined) {
            merged[key] = rightVal
        } else if (rightVal === undefined) {
            merged[key] = leftVal
        } else if (JSON.stringify(leftVal) === JSON.stringify(rightVal)) {
            merged[key] = leftVal
        } else if (
            key === 'dependencies' ||
            key === 'devDependencies' ||
            key === 'peerDependencies' ||
            key === 'optionalDependencies'
        ) {
            // Merge dependency objects
            const leftDeps = (leftVal as Record<string, string>) || {}
            const rightDeps = (rightVal as Record<string, string>) || {}
            const mergedDeps: Record<string, string> = {}
            const allDepKeys = new Set([...Object.keys(leftDeps), ...Object.keys(rightDeps)])

            for (const depKey of allDepKeys) {
                const leftVer = leftDeps[depKey]
                const rightVer = rightDeps[depKey]

                if (!leftVer) {
                    mergedDeps[depKey] = rightVer
                } else if (!rightVer) {
                    mergedDeps[depKey] = leftVer
                } else if (leftVer === rightVer) {
                    mergedDeps[depKey] = leftVer
                } else {
                    // Version conflict
                    conflicts.push({
                        path: `${key}.${depKey}`,
                        left: leftVer,
                        right: rightVer,
                    })

                    switch (strategy) {
                        case 'latest':
                            mergedDeps[depKey] = compareVersions(leftVer, rightVer) >= 0 ? leftVer : rightVer
                            break
                        case 'left':
                            mergedDeps[depKey] = leftVer
                            break
                        case 'right':
                            mergedDeps[depKey] = rightVer
                            break
                    }
                }
            }
            merged[key] = mergedDeps
        } else if (typeof leftVal === 'object' && typeof rightVal === 'object' && !Array.isArray(leftVal)) {
            // Recursively merge objects
            const result = mergePackages(
                leftVal as Record<string, unknown>,
                rightVal as Record<string, unknown>,
                strategy
            )
            merged[key] = result.merged
            conflicts.push(...result.conflicts.map(c => ({ ...c, path: `${key}.${c.path}` })))
        } else {
            // Non-mergeable conflict
            conflicts.push({
                path: key,
                left: JSON.stringify(leftVal),
                right: JSON.stringify(rightVal),
            })
            merged[key] = strategy === 'right' ? rightVal : leftVal
        }
    }

    return { merged, conflicts }
}

export default function PackageJsonMergeTool() {
    const { t } = useLanguage()
    const [leftInput, setLeftInput] = useState('')
    const [rightInput, setRightInput] = useState('')
    const [strategy, setStrategy] = useState<MergeStrategy>('latest')
    const [result, setResult] = useState<MergeResult | null>(null)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    const handleMerge = () => {
        setError('')
        setResult(null)

        const left = parseJSON(leftInput)
        const right = parseJSON(rightInput)

        if (!left) {
            setError(t('packageMerge.error.invalidLeft'))
            return
        }
        if (!right) {
            setError(t('packageMerge.error.invalidRight'))
            return
        }

        const mergeResult = mergePackages(left, right, strategy)
        setResult(mergeResult)
    }

    const handleClear = () => {
        setLeftInput('')
        setRightInput('')
        setResult(null)
        setError('')
    }

    const handleCopy = async () => {
        if (result) {
            await navigator.clipboard.writeText(JSON.stringify(result.merged, null, 2))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const sampleLeft = `{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "axios": "^1.4.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.40.0"
  }
}`

    const sampleRight = `{
  "name": "my-project",
  "version": "1.1.0",
  "dependencies": {
    "react": "^18.3.1",
    "axios": "^1.6.0",
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "prettier": "^3.1.0"
  }
}`

    const handleLoadSample = () => {
        setLeftInput(sampleLeft)
        setRightInput(sampleRight)
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {t('packageMerge.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('packageMerge.description')}
                </p>

                {/* Strategy Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('packageMerge.strategy.label')}
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {(['latest', 'left', 'right'] as const).map((s) => (
                            <label key={s} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="strategy"
                                    checked={strategy === s}
                                    onChange={() => setStrategy(s)}
                                    className="text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {t(`packageMerge.strategy.${s}`)}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Input Sections */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('packageMerge.left.label')}
                        </label>
                        <textarea
                            value={leftInput}
                            onChange={(e) => setLeftInput(e.target.value)}
                            placeholder={t('packageMerge.left.placeholder')}
                            className="w-full h-64 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('packageMerge.right.label')}
                        </label>
                        <textarea
                            value={rightInput}
                            onChange={(e) => setRightInput(e.target.value)}
                            placeholder={t('packageMerge.right.placeholder')}
                            className="w-full h-64 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={handleMerge}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        {t('packageMerge.actions.merge')}
                    </button>
                    <button
                        onClick={handleLoadSample}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                        {t('packageMerge.actions.sample')}
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                        {t('common.clear')}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Conflicts */}
                {result && result.conflicts.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-3">
                            ⚠️ {t('packageMerge.conflicts.title', { count: result.conflicts.length })}
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                                            {t('packageMerge.conflicts.path')}
                                        </th>
                                        <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                                            {t('packageMerge.conflicts.left')}
                                        </th>
                                        <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                                            {t('packageMerge.conflicts.right')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.conflicts.map((c, i) => (
                                        <tr key={i} className="border-t border-gray-300 dark:border-gray-600">
                                            <td className="px-4 py-2 font-mono text-gray-900 dark:text-white">{c.path}</td>
                                            <td className="px-4 py-2 font-mono text-red-600 dark:text-red-400">{c.left}</td>
                                            <td className="px-4 py-2 font-mono text-green-600 dark:text-green-400">{c.right}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Merged Result */}
                {result && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('packageMerge.result.label')}
                            </label>
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                            >
                                {copied ? t('common.copied') : t('common.copy')}
                            </button>
                        </div>
                        <pre className="w-full p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
                            {JSON.stringify(result.merged, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    {t('packageMerge.info.title')}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                    <li>{t('packageMerge.info.bullet1')}</li>
                    <li>{t('packageMerge.info.bullet2')}</li>
                    <li>{t('packageMerge.info.bullet3')}</li>
                </ul>
            </div>
        </div>
    )
}
