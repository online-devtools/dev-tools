'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface StackFrame {
    raw: string
    className?: string
    methodName?: string
    fileName?: string
    lineNumber?: number
    isNative?: boolean
    isFramework?: boolean
}

interface ParseResult {
    language: 'java' | 'python' | 'javascript' | 'unknown'
    exception?: string
    message?: string
    frames: StackFrame[]
}

const frameworkPatterns = [
    // Java
    /^java\./,
    /^javax\./,
    /^sun\./,
    /^com\.sun\./,
    /^org\.springframework\./,
    /^org\.apache\./,
    /^org\.hibernate\./,
    // JavaScript/Node
    /^node:/,
    /node_modules/,
    /^internal\//,
    // Python
    /^<frozen/,
    /site-packages/,
    /dist-packages/,
]

function isFrameworkCode(frame: StackFrame): boolean {
    const text = frame.raw
    return frameworkPatterns.some(pattern => pattern.test(text))
}

function parseStackTrace(text: string): ParseResult {
    const lines = text.trim().split('\n')
    const frames: StackFrame[] = []
    let language: ParseResult['language'] = 'unknown'
    let exception: string | undefined
    let message: string | undefined

    // Detect Java stack trace
    const javaExceptionMatch = lines[0]?.match(/^([\w.$]+(?:Exception|Error|Throwable)):\s*(.*)/)
    if (javaExceptionMatch) {
        language = 'java'
        exception = javaExceptionMatch[1]
        message = javaExceptionMatch[2] || undefined
    }

    // Detect Python stack trace
    if (lines[0]?.startsWith('Traceback (most recent call last):')) {
        language = 'python'
    }

    // Detect JavaScript/Node stack trace
    const jsExceptionMatch = lines[0]?.match(/^(\w+Error):\s*(.*)/)
    if (jsExceptionMatch && !javaExceptionMatch) {
        language = 'javascript'
        exception = jsExceptionMatch[1]
        message = jsExceptionMatch[2] || undefined
    }

    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        // Java: "at com.example.MyClass.myMethod(MyClass.java:42)"
        const javaMatch = trimmed.match(/at\s+([\w.$]+)\.([\w<>$]+)\(([\w.$]+):(\d+)\)/)
        if (javaMatch) {
            language = language === 'unknown' ? 'java' : language
            const frame: StackFrame = {
                raw: trimmed,
                className: javaMatch[1],
                methodName: javaMatch[2],
                fileName: javaMatch[3],
                lineNumber: parseInt(javaMatch[4], 10),
            }
            frame.isFramework = isFrameworkCode(frame)
            frames.push(frame)
            continue
        }

        // Java native method
        const javaNativeMatch = trimmed.match(/at\s+([\w.$]+)\.([\w<>$]+)\(Native Method\)/)
        if (javaNativeMatch) {
            const frame: StackFrame = {
                raw: trimmed,
                className: javaNativeMatch[1],
                methodName: javaNativeMatch[2],
                isNative: true,
            }
            frame.isFramework = isFrameworkCode(frame)
            frames.push(frame)
            continue
        }

        // Python: "  File "/path/to/file.py", line 42, in function_name"
        const pythonMatch = trimmed.match(/File\s+"([^"]+)",\s+line\s+(\d+),\s+in\s+(\w+)/)
        if (pythonMatch) {
            language = 'python'
            const frame: StackFrame = {
                raw: trimmed,
                fileName: pythonMatch[1],
                lineNumber: parseInt(pythonMatch[2], 10),
                methodName: pythonMatch[3],
            }
            frame.isFramework = isFrameworkCode(frame)
            frames.push(frame)
            continue
        }

        // JavaScript: "    at functionName (file.js:42:10)"
        const jsMatch = trimmed.match(/at\s+(?:(.+?)\s+)?\(?([\w/.:-]+):(\d+)(?::\d+)?\)?/)
        if (jsMatch) {
            language = language === 'unknown' ? 'javascript' : language
            const frame: StackFrame = {
                raw: trimmed,
                methodName: jsMatch[1] || '<anonymous>',
                fileName: jsMatch[2],
                lineNumber: parseInt(jsMatch[3], 10),
            }
            frame.isFramework = isFrameworkCode(frame)
            frames.push(frame)
            continue
        }

        // If first line and has exception pattern
        if (frames.length === 0 && (trimmed.includes('Error') || trimmed.includes('Exception'))) {
            if (!exception) {
                const parts = trimmed.split(':')
                exception = parts[0]
                message = parts.slice(1).join(':').trim() || undefined
            }
        }
    }

    // Python exception is usually at end
    if (language === 'python' && !exception) {
        const lastLine = lines[lines.length - 1]?.trim()
        const pythonExMatch = lastLine?.match(/^(\w+(?:Error|Exception)):\s*(.*)/)
        if (pythonExMatch) {
            exception = pythonExMatch[1]
            message = pythonExMatch[2] || undefined
        }
    }

    return { language, exception, message, frames }
}

export default function StackTraceBeautifierTool() {
    const { t } = useLanguage()
    const [input, setInput] = useState('')
    const [result, setResult] = useState<ParseResult | null>(null)
    const [showFramework, setShowFramework] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleParse = () => {
        setResult(parseStackTrace(input))
    }

    const handleClear = () => {
        setInput('')
        setResult(null)
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(input)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const sampleJava = `java.lang.NullPointerException: Cannot invoke method on null object
	at com.example.service.UserService.getUserById(UserService.java:42)
	at com.example.controller.UserController.getUser(UserController.java:28)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:897)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:750)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)
	at com.example.filter.AuthFilter.doFilter(AuthFilter.java:55)`

    const samplePython = `Traceback (most recent call last):
  File "/app/main.py", line 42, in handle_request
    result = process_data(data)
  File "/app/processor.py", line 128, in process_data
    validated = validate(data)
  File "/app/validator.py", line 56, in validate
    raise ValueError("Invalid input format")
ValueError: Invalid input format`

    const sampleJS = `TypeError: Cannot read property 'map' of undefined
    at UserList.render (src/components/UserList.js:42:15)
    at finishClassComponent (node_modules/react-dom/cjs/react-dom.development.js:17485:31)
    at updateClassComponent (node_modules/react-dom/cjs/react-dom.development.js:17435:24)
    at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:21620:12)
    at workLoop (node_modules/react-dom/cjs/react-dom.development.js:21694:24)`

    const handleLoadSample = (sample: string) => {
        setInput(sample)
        setResult(parseStackTrace(sample))
    }

    const visibleFrames = result?.frames.filter(f => showFramework || !f.isFramework) || []

    const languageColors: Record<string, string> = {
        java: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        python: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        javascript: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        unknown: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {t('stackTrace.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('stackTrace.description')}
                </p>

                {/* Input Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('stackTrace.input.label')}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('stackTrace.input.placeholder')}
                        className="w-full h-48 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={handleParse}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        {t('stackTrace.actions.parse')}
                    </button>
                    <button
                        onClick={() => handleLoadSample(sampleJava)}
                        className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition"
                    >
                        Java
                    </button>
                    <button
                        onClick={() => handleLoadSample(samplePython)}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                    >
                        Python
                    </button>
                    <button
                        onClick={() => handleLoadSample(sampleJS)}
                        className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition"
                    >
                        JavaScript
                    </button>
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                        {copied ? t('common.copied') : t('common.copy')}
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                        {t('common.clear')}
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="space-y-4">
                        {/* Header */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${languageColors[result.language]}`}>
                                {result.language.toUpperCase()}
                            </span>
                            {result.exception && (
                                <span className="text-red-600 dark:text-red-400 font-semibold">
                                    {result.exception}
                                </span>
                            )}
                            {result.message && (
                                <span className="text-gray-600 dark:text-gray-400">
                                    {result.message}
                                </span>
                            )}
                        </div>

                        {/* Filter Toggle */}
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showFramework}
                                    onChange={(e) => setShowFramework(e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('stackTrace.filter.showFramework')} ({result.frames.filter(f => f.isFramework).length} {t('stackTrace.filter.hidden')})
                                </span>
                            </label>
                        </div>

                        {/* Frames */}
                        <div className="space-y-1">
                            {visibleFrames.map((frame, i) => (
                                <div
                                    key={i}
                                    className={`p-3 rounded-lg font-mono text-sm ${frame.isFramework
                                            ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
                                            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white'
                                        }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-400 dark:text-gray-500 select-none w-6 text-right shrink-0">
                                            {i + 1}
                                        </span>
                                        <div className="overflow-x-auto">
                                            {frame.className && (
                                                <span className="text-purple-600 dark:text-purple-400">{frame.className}</span>
                                            )}
                                            {frame.methodName && (
                                                <>
                                                    {frame.className && <span className="text-gray-500">.</span>}
                                                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{frame.methodName}</span>
                                                </>
                                            )}
                                            {frame.fileName && (
                                                <>
                                                    <span className="text-gray-500 mx-1">@</span>
                                                    <span className="text-green-600 dark:text-green-400">{frame.fileName}</span>
                                                </>
                                            )}
                                            {frame.lineNumber && (
                                                <>
                                                    <span className="text-gray-500">:</span>
                                                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{frame.lineNumber}</span>
                                                </>
                                            )}
                                            {frame.isNative && (
                                                <span className="ml-2 text-xs text-gray-400">(Native Method)</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {visibleFrames.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                {t('stackTrace.empty')}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    {t('stackTrace.info.title')}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                    <li>{t('stackTrace.info.bullet1')}</li>
                    <li>{t('stackTrace.info.bullet2')}</li>
                    <li>{t('stackTrace.info.bullet3')}</li>
                </ul>
            </div>
        </div>
    )
}
