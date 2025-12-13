'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

async function aesEncrypt(plain: string, password: string): Promise<string> {
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  )
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plain))
  const combined = new Uint8Array(salt.length + iv.length + cipher.byteLength)
  combined.set(salt, 0)
  combined.set(iv, salt.length)
  combined.set(new Uint8Array(cipher), salt.length + iv.length)
  return btoa(String.fromCharCode(...combined))
}

async function aesDecrypt(data: string, password: string): Promise<string> {
  const raw = Uint8Array.from(atob(data), c => c.charCodeAt(0))
  const salt = raw.slice(0, 16)
  const iv = raw.slice(16, 28)
  const cipher = raw.slice(28)
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  )
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher)
  return new TextDecoder().decode(plain)
}

export default function CryptoBundleTool() {
  const { t } = useLanguage()
  // 입력, 비밀번호, 결과, 에러 상태를 관리합니다.
  const [input, setInput] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const handleEncrypt = async () => {
    try {
      setError('')
      if (!input || !password) {
        setError(t('cryptoBundle.error.required'))
        return
      }
      const enc = await aesEncrypt(input, password)
      setResult(enc)
    } catch (e) {
      setError(t('cryptoBundle.error.encrypt'))
    }
  }

  const handleDecrypt = async () => {
    try {
      setError('')
      if (!input || !password) {
        setError(t('cryptoBundle.error.required'))
        return
      }
      const dec = await aesDecrypt(input, password)
      setResult(dec)
    } catch (e) {
      setError(t('cryptoBundle.error.decrypt'))
    }
  }

  const handleBase64Encode = () => {
    try {
      setError('')
      setResult(btoa(input))
    } catch {
      setError(t('cryptoBundle.error.encode'))
    }
  }

  const handleBase64Decode = () => {
    try {
      setError('')
      setResult(atob(input))
    } catch {
      setError(t('cryptoBundle.error.decode'))
    }
  }

  const handleRandom = () => {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    setResult(btoa(String.fromCharCode(...bytes)))
  }

  return (
    <ToolCard
      title={`🧰 ${t('cryptoBundle.title')}`}
      description={t('cryptoBundle.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('cryptoBundle.input.label')}
          placeholder={t('cryptoBundle.input.placeholder')}
          rows={4}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('cryptoBundle.password')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          <button onClick={handleEncrypt} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            {t('cryptoBundle.actions.encrypt')}
          </button>
          <button onClick={handleDecrypt} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            {t('cryptoBundle.actions.decrypt')}
          </button>
          <button onClick={handleBase64Encode} className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            {t('cryptoBundle.actions.b64Encode')}
          </button>
          <button onClick={handleBase64Decode} className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            {t('cryptoBundle.actions.b64Decode')}
          </button>
          <button onClick={handleRandom} className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors col-span-2 md:col-span-1">
            {t('cryptoBundle.actions.random')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={result}
          readOnly
          label={t('cryptoBundle.result.label')}
          rows={6}
        />
      </div>
    </ToolCard>
  )
}
