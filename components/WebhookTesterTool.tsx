'use client'

import { useEffect, useMemo, useState } from 'react'
import HmacSHA256 from 'crypto-js/hmac-sha256'
import HmacSHA1 from 'crypto-js/hmac-sha1'
import Hex from 'crypto-js/enc-hex'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { parseHeaderLines } from '@/utils/apiResponseTime'

type WebhookEntry = {
  id: string
  method: string
  url: string
  headers: Record<string, string>
  body: string
  receivedAt: string
}

export default function WebhookTesterTool() {
  const { t } = useLanguage()
  const [endpoint, setEndpoint] = useState('')
  const [inbox, setInbox] = useState<WebhookEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [payload, setPayload] = useState('')
  const [secret, setSecret] = useState('')
  const [signature, setSignature] = useState('')
  const [algorithm, setAlgorithm] = useState<'sha256' | 'sha1'>('sha256')
  const [replayUrl, setReplayUrl] = useState('')
  const [replayHeaders, setReplayHeaders] = useState('Content-Type: application/json')
  const [replayResult, setReplayResult] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEndpoint(`${window.location.origin}/api/webhook-inbox`)
    }
  }, [])

  const fetchInbox = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/webhook-inbox')
      const data = await response.json()
      setInbox(Array.isArray(data.items) ? data.items : [])
    } catch {
      setInbox([])
    } finally {
      setIsLoading(false)
    }
  }

  const clearInbox = async () => {
    await fetch('/api/webhook-inbox', { method: 'DELETE' })
    setInbox([])
  }

  const computedSignature = useMemo(() => {
    if (!payload || !secret) return ''
    const hash = algorithm === 'sha256' ? HmacSHA256(payload, secret) : HmacSHA1(payload, secret)
    return `${algorithm}=${hash.toString(Hex)}`
  }, [payload, secret, algorithm])

  const signatureMatch = useMemo(() => {
    if (!signature.trim() || !computedSignature) return null
    const normalized = signature.trim().toLowerCase()
    const rawHash = computedSignature.split('=')[1]
    return normalized === computedSignature.toLowerCase() || normalized === rawHash.toLowerCase()
  }, [signature, computedSignature])

  const handleReplay = async () => {
    if (!replayUrl.trim()) {
      setReplayResult(t('webhookTester.replay.missing'))
      return
    }
    const headers = parseHeaderLines(replayHeaders)
    const start = performance.now()
    try {
      const response = await fetch(replayUrl, {
        method: 'POST',
        headers,
        body: payload,
      })
      const text = await response.text()
      const duration = Math.round(performance.now() - start)
      setReplayResult(`${response.status} (${duration}ms)\n${text}`)
    } catch (err) {
      setReplayResult(err instanceof Error ? err.message : t('webhookTester.replay.error'))
    }
  }

  return (
    <ToolCard
      title={`🪝 ${t('webhookTester.title')}`}
      description={t('webhookTester.description')}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('webhookTester.endpoint')}
          </label>
          <TextAreaWithCopy value={endpoint} readOnly rows={2} />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchInbox}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              {isLoading ? t('webhookTester.loading') : t('webhookTester.refresh')}
            </button>
            <button
              onClick={clearInbox}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
            >
              {t('webhookTester.clear')}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('webhookTester.inbox')}
          </div>
          {inbox.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('webhookTester.inbox.empty')}
            </div>
          ) : (
            <div className="space-y-3">
              {inbox.map((entry) => (
                <div key={entry.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.receivedAt} · {entry.method}
                  </div>
                  <div className="text-sm text-gray-800 dark:text-gray-200">{entry.url}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t('webhookTester.headersCount', { count: Object.keys(entry.headers || {}).length })}
                  </div>
                  <TextAreaWithCopy value={entry.body} readOnly rows={3} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('webhookTester.signature')}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs text-gray-500 dark:text-gray-400">{t('webhookTester.secret')}</label>
              <input
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 dark:text-gray-400">{t('webhookTester.algorithm')}</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as 'sha256' | 'sha1')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="sha256">sha256</option>
                <option value="sha1">sha1</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 dark:text-gray-400">{t('webhookTester.signatureHeader')}</label>
              <input
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="sha256=..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">{t('webhookTester.payload')}</label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={4}
              placeholder={t('webhookTester.payload.placeholder')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {computedSignature ? (
              <span>
                {t('webhookTester.computed')} <span className="font-mono">{computedSignature}</span>
              </span>
            ) : (
              t('webhookTester.computed.empty')
            )}
          </div>
          {signatureMatch !== null && (
            <div className={`text-sm ${signatureMatch ? 'text-green-600' : 'text-red-600'}`}>
              {signatureMatch ? t('webhookTester.match') : t('webhookTester.mismatch')}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('webhookTester.replay')}
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">{t('webhookTester.replay.url')}</label>
            <input
              value={replayUrl}
              onChange={(e) => setReplayUrl(e.target.value)}
              placeholder="https://api.example.com/webhooks"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">{t('webhookTester.replay.headers')}</label>
            <textarea
              value={replayHeaders}
              onChange={(e) => setReplayHeaders(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleReplay}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              {t('webhookTester.replay.send')}
            </button>
            <button
              onClick={() => setPayload('')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
            >
              {t('webhookTester.replay.clear')}
            </button>
          </div>
          {replayResult && (
            <TextAreaWithCopy value={replayResult} readOnly rows={4} />
          )}
        </div>
      </div>
    </ToolCard>
  )
}
