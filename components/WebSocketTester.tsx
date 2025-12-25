'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Message {
    id: string
    type: 'sent' | 'received' | 'system' | 'error'
    content: string
    timestamp: Date
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export default function WebSocketTester() {
    const { t } = useLanguage()
    const [url, setUrl] = useState('wss://echo.websocket.org')
    const [messageInput, setMessageInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [status, setStatus] = useState<ConnectionStatus>('disconnected')
    const [autoScroll, setAutoScroll] = useState(true)
    const [jsonFormat, setJsonFormat] = useState(false)

    const wsRef = useRef<WebSocket | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const addMessage = useCallback((type: Message['type'], content: string) => {
        const newMessage: Message = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            content,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, newMessage])
    }, [])

    const connect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close()
        }

        if (!url.trim()) {
            addMessage('error', t('websocket.error.urlRequired'))
            return
        }

        if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
            addMessage('error', t('websocket.error.invalidProtocol'))
            return
        }

        setStatus('connecting')
        addMessage('system', `${t('websocket.connecting')}: ${url}`)

        try {
            const ws = new WebSocket(url)
            wsRef.current = ws

            ws.onopen = () => {
                setStatus('connected')
                addMessage('system', t('websocket.connected'))
            }

            ws.onmessage = (event) => {
                let content = event.data
                if (jsonFormat) {
                    try {
                        content = JSON.stringify(JSON.parse(event.data), null, 2)
                    } catch {
                        // Not JSON, keep original
                    }
                }
                addMessage('received', content)
            }

            ws.onclose = (event) => {
                setStatus('disconnected')
                addMessage('system', `${t('websocket.disconnected')} (Code: ${event.code})`)
                wsRef.current = null
            }

            ws.onerror = () => {
                setStatus('error')
                addMessage('error', t('websocket.error.connectionFailed'))
            }
        } catch (error) {
            setStatus('error')
            addMessage('error', `${t('websocket.error.connectionFailed')}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }, [url, jsonFormat, t, addMessage])

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
    }, [])

    const sendMessage = useCallback(() => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            addMessage('error', t('websocket.error.notConnected'))
            return
        }

        if (!messageInput.trim()) return

        try {
            wsRef.current.send(messageInput)
            addMessage('sent', messageInput)
            setMessageInput('')
        } catch (error) {
            addMessage('error', `${t('websocket.error.sendFailed')}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }, [messageInput, t, addMessage])

    const clearMessages = useCallback(() => {
        setMessages([])
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (autoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, autoScroll])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [])

    const getStatusColor = () => {
        switch (status) {
            case 'connected': return 'bg-green-500'
            case 'connecting': return 'bg-yellow-500 animate-pulse'
            case 'error': return 'bg-red-500'
            default: return 'bg-gray-400'
        }
    }

    const getStatusText = () => {
        switch (status) {
            case 'connected': return t('websocket.status.connected')
            case 'connecting': return t('websocket.status.connecting')
            case 'error': return t('websocket.status.error')
            default: return t('websocket.status.disconnected')
        }
    }

    const getMessageStyle = (type: Message['type']) => {
        switch (type) {
            case 'sent':
                return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
            case 'received':
                return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
            case 'system':
                return 'bg-gray-100 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 italic'
            case 'error':
                return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400'
            default:
                return ''
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3
        })
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                🔌 {t('websocket.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('websocket.description')}
            </p>

            {/* Connection Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('websocket.url.label')}
                        </label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="wss://echo.websocket.org"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={status === 'connected' || status === 'connecting'}
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        {status === 'disconnected' || status === 'error' ? (
                            <button
                                onClick={connect}
                                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium 
                         rounded-lg transition-colors"
                            >
                                {t('websocket.connect')}
                            </button>
                        ) : (
                            <button
                                onClick={disconnect}
                                disabled={status === 'connecting'}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium 
                         rounded-lg transition-colors disabled:opacity-50"
                            >
                                {t('websocket.disconnect')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getStatusText()}
                    </span>
                </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {t('websocket.messages.title')} ({messages.length})
                    </h2>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <input
                                type="checkbox"
                                checked={jsonFormat}
                                onChange={(e) => setJsonFormat(e.target.checked)}
                                className="rounded border-gray-300 dark:border-gray-600"
                            />
                            {t('websocket.jsonFormat')}
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <input
                                type="checkbox"
                                checked={autoScroll}
                                onChange={(e) => setAutoScroll(e.target.checked)}
                                className="rounded border-gray-300 dark:border-gray-600"
                            />
                            {t('websocket.autoScroll')}
                        </label>
                        <button
                            onClick={clearMessages}
                            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                       dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-300"
                        >
                            {t('websocket.clear')}
                        </button>
                    </div>
                </div>

                <div className="h-80 overflow-y-auto p-4 space-y-2">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            {t('websocket.messages.empty')}
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`p-3 rounded-lg border ${getMessageStyle(msg.type)}`}
                            >
                                <div className="flex items-start gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono shrink-0">
                                        [{formatTime(msg.timestamp)}]
                                    </span>
                                    <span className="text-xs font-semibold uppercase shrink-0">
                                        {msg.type === 'sent' && '→ SENT'}
                                        {msg.type === 'received' && '← RECV'}
                                        {msg.type === 'system' && 'SYSTEM'}
                                        {msg.type === 'error' && '⚠ ERROR'}
                                    </span>
                                </div>
                                <pre className="mt-1 text-sm whitespace-pre-wrap break-all font-mono">
                                    {msg.content}
                                </pre>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Send Message Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('websocket.send.label')}
                </label>
                <div className="flex gap-2">
                    <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('websocket.send.placeholder')}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     font-mono text-sm resize-none"
                        rows={3}
                        disabled={status !== 'connected'}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={status !== 'connected' || !messageInput.trim()}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium 
                     rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     self-end"
                    >
                        {t('websocket.send.button')}
                    </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t('websocket.send.hint')}
                </p>
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                    💡 {t('websocket.info.title')}
                </h3>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li>• {t('websocket.info.item1')}</li>
                    <li>• {t('websocket.info.item2')}</li>
                    <li>• {t('websocket.info.item3')}</li>
                    <li>• {t('websocket.info.item4')}</li>
                </ul>

                <h4 className="text-md font-semibold text-blue-800 dark:text-blue-300 mt-4 mb-2">
                    {t('websocket.info.testServers')}
                </h4>
                <div className="space-y-1 text-sm">
                    <code className="block bg-blue-100 dark:bg-blue-800/30 px-2 py-1 rounded">
                        wss://echo.websocket.org
                    </code>
                    <code className="block bg-blue-100 dark:bg-blue-800/30 px-2 py-1 rounded">
                        wss://ws.postman-echo.com/raw
                    </code>
                </div>
            </div>
        </div>
    )
}
