"use client"

import { useEffect, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { buildAuthorizeUrl, generateCodeVerifier, generatePkceChallenge } from '@/utils/oauth'

export default function OAuthPlaygroundTool() {
  const { t } = useLanguage()
  // Store OAuth endpoint inputs and generated PKCE values.
  const [authEndpoint, setAuthEndpoint] = useState('')
  const [tokenEndpoint, setTokenEndpoint] = useState('')
  const [clientId, setClientId] = useState('')
  const [redirectUri, setRedirectUri] = useState('')
  const [scope, setScope] = useState('openid profile email')
  const [state, setState] = useState('')
  const [codeVerifier, setCodeVerifier] = useState('')
  const [codeChallenge, setCodeChallenge] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [authorizeUrl, setAuthorizeUrl] = useState('')
  const [tokenBody, setTokenBody] = useState('')
  const [error, setError] = useState('')

  const generatePkce = async () => {
    try {
      setError('')
      // Generate a new verifier and derive the challenge with SHA-256.
      const verifier = generateCodeVerifier()
      const challenge = await generatePkceChallenge(verifier)
      setCodeVerifier(verifier)
      setCodeChallenge(challenge)
    } catch (err) {
      setError(t('oauth.error.pkce'))
    }
  }

  useEffect(() => {
    // Rebuild the authorization URL when core inputs change.
    if (!authEndpoint || !clientId || !redirectUri) {
      setAuthorizeUrl('')
      return
    }

    const url = buildAuthorizeUrl(
      {
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallenge ? 'S256' : '',
      },
      authEndpoint
    )
    setAuthorizeUrl(url)
  }, [authEndpoint, clientId, redirectUri, scope, state, codeChallenge])

  useEffect(() => {
    // Build the token request body for manual testing or curl.
    const bodyParams = new URLSearchParams()
    if (authCode) bodyParams.set('code', authCode)
    if (redirectUri) bodyParams.set('redirect_uri', redirectUri)
    if (clientId) bodyParams.set('client_id', clientId)
    if (codeVerifier) bodyParams.set('code_verifier', codeVerifier)
    bodyParams.set('grant_type', 'authorization_code')
    setTokenBody(bodyParams.toString())
  }, [authCode, redirectUri, clientId, codeVerifier])

  const handleClear = () => {
    // Reset every field so a new OAuth flow can be configured.
    setAuthEndpoint('')
    setTokenEndpoint('')
    setClientId('')
    setRedirectUri('')
    setScope('openid profile email')
    setState('')
    setCodeVerifier('')
    setCodeChallenge('')
    setAuthCode('')
    setAuthorizeUrl('')
    setTokenBody('')
    setError('')
  }

  return (
    <ToolCard
      title={`🧭 ${t('oauth.title')}`}
      description={t('oauth.description')}
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('oauth.input.authEndpoint')}
            </label>
            <input
              value={authEndpoint}
              onChange={(e) => setAuthEndpoint(e.target.value)}
              placeholder="https://auth.example.com/oauth/authorize"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('oauth.input.tokenEndpoint')}
            </label>
            <input
              value={tokenEndpoint}
              onChange={(e) => setTokenEndpoint(e.target.value)}
              placeholder="https://auth.example.com/oauth/token"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('oauth.input.clientId')}
            </label>
            <input
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="client_id"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('oauth.input.redirectUri')}
            </label>
            <input
              value={redirectUri}
              onChange={(e) => setRedirectUri(e.target.value)}
              placeholder="https://app.example.com/callback"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('oauth.input.scope')}
            </label>
            <input
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="openid profile email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('oauth.input.state')}
            </label>
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="state"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={generatePkce}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {t('oauth.actions.generatePkce')}
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('oauth.actions.clear')}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <TextAreaWithCopy
            value={codeVerifier}
            onChange={setCodeVerifier}
            label={t('oauth.output.codeVerifier')}
            placeholder={t('oauth.output.codeVerifierPlaceholder')}
            rows={2}
          />
          <TextAreaWithCopy
            value={codeChallenge}
            readOnly
            label={t('oauth.output.codeChallenge')}
            placeholder={t('oauth.output.codeChallengePlaceholder')}
            rows={2}
          />
        </div>

        <TextAreaWithCopy
          value={authorizeUrl}
          readOnly
          label={t('oauth.output.authorizeUrl')}
          placeholder={t('oauth.output.authorizeUrlPlaceholder')}
          rows={3}
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('oauth.input.authCode')}
          </label>
          <input
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            placeholder="authorization_code"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <TextAreaWithCopy
          value={tokenBody}
          readOnly
          label={t('oauth.output.tokenBody')}
          placeholder={t('oauth.output.tokenBodyPlaceholder')}
          rows={3}
        />

        {tokenEndpoint && tokenBody && (
          <TextAreaWithCopy
            value={`curl -X POST '${tokenEndpoint}' \\\n  -H 'Content-Type: application/x-www-form-urlencoded' \\\n  -d '${tokenBody}'`}
            readOnly
            label={t('oauth.output.curl')}
            placeholder={t('oauth.output.curlPlaceholder')}
            rows={4}
          />
        )}
      </div>
    </ToolCard>
  )
}
