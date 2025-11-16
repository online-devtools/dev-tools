'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { createSignedJwt, JwtAlgorithm } from '@/utils/jwt'

export default function JWTSignerTool() {
  const { t } = useLanguage()
  // Default payload/header values help newcomers see the expected JSON structure.
  const [header, setHeader] = useState(JSON.stringify({ typ: 'JWT' }, null, 2))
  const [payload, setPayload] = useState(
    JSON.stringify(
      {
        sub: '1234567890',
        name: 'John Doe',
        admin: true,
      },
      null,
      2
    )
  )
  const [secret, setSecret] = useState('')
  const [algorithm, setAlgorithm] = useState<JwtAlgorithm>('HS256')
  const [token, setToken] = useState('')
  const [signingInput, setSigningInput] = useState('')
  const [errorKey, setErrorKey] = useState<string | null>(null)

  const algorithms: JwtAlgorithm[] = ['HS256', 'HS384', 'HS512']

  // Validate JSON before hitting the signing helper so we can show localized errors.
  const handleGenerate = () => {
    let parsedHeader: Record<string, unknown> = {}
    let parsedPayload: Record<string, unknown> = {}

    try {
      parsedHeader = header.trim() ? JSON.parse(header) : {}
    } catch {
      setErrorKey('jwtSigner.error.invalidHeader')
      return
    }

    try {
      parsedPayload = payload.trim() ? JSON.parse(payload) : {}
    } catch {
      setErrorKey('jwtSigner.error.invalidPayload')
      return
    }

    if (!secret.trim()) {
      setErrorKey('jwtSigner.error.secretRequired')
      return
    }

    try {
      // createSignedJwt (in utils/jwt.ts) encapsulates the CryptoJS/HMAC steps.
      const result = createSignedJwt({
        header: parsedHeader,
        payload: parsedPayload,
        secret,
        algorithm,
      })
      setToken(result.token)
      setSigningInput(result.signingInput)
      setErrorKey(null)
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('jwt')) {
        setErrorKey(error.message)
      } else {
        setErrorKey('jwtSigner.error.invalidPayload')
      }
    }
  }

  const handleClear = () => {
    setHeader(JSON.stringify({ typ: 'JWT' }, null, 2))
    setPayload(
      JSON.stringify(
        {
          sub: '1234567890',
          name: 'John Doe',
          admin: true,
        },
        null,
        2
      )
    )
    setSecret('')
    setAlgorithm('HS256')
    setToken('')
    setSigningInput('')
    setErrorKey(null)
  }

  return (
    <ToolCard title={`🧾 ${t('jwtSigner.title')}`} description={t('jwtSigner.description')}>
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <TextAreaWithCopy
            value={header}
            onChange={setHeader}
            label={t('jwtSigner.header.label')}
            rows={8}
          />
          <TextAreaWithCopy
            value={payload}
            onChange={setPayload}
            label={t('jwtSigner.payload.label')}
            placeholder={t('jwtSigner.payload.placeholder')}
            rows={8}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('jwtSigner.algorithm.label')}
            </label>
            <select
              value={algorithm}
              onChange={(event) => setAlgorithm(event.target.value as JwtAlgorithm)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
            >
              {algorithms.map((alg) => (
                <option key={alg} value={alg}>
                  {t(`jwtSigner.algorithm.${alg.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('jwtSigner.secret.label')}
            </label>
            <input
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder={t('jwtSigner.secret.placeholder')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jwtSigner.actions.generate')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jwtSigner.actions.clear')}
          </button>
        </div>

        {errorKey && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {t(errorKey)}
          </div>
        )}

        {token && (
          <div className="space-y-4">
            <TextAreaWithCopy value={token} readOnly label={t('jwtSigner.result.label')} rows={4} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('jwtSigner.result.signingInput')}
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-xs break-all text-gray-700 dark:text-gray-300">
                {signingInput}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t('jwtSigner.result.note')}
              </p>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-100">
          {t('jwtSigner.hint')}
        </div>
      </div>
    </ToolCard>
  )
}
