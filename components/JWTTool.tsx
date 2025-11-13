'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

interface DecodedData {
  header: any
  payload: any
  signature: string
  isExpired: boolean
  expiryDate: string | null
  algorithm: string
}

export default function JWTTool() {
  const [input, setInput] = useState('')
  const [header, setHeader] = useState('')
  const [payload, setPayload] = useState('')
  const [error, setError] = useState('')
  const [decodedData, setDecodedData] = useState<DecodedData | null>(null)

  const handleDecode = () => {
    try {
      setError('')
      const parts = input.trim().split('.')

      if (parts.length !== 3) {
        setError('유효하지 않은 JWT 형식입니다. JWT는 3개의 부분으로 구성되어야 합니다.')
        setHeader('')
        setPayload('')
        setDecodedData(null)
        return
      }

      const decodedHeader = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
      const decodedPayload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))

      // Check expiry
      let isExpired = false
      let expiryDate: string | null = null
      if (decodedPayload.exp) {
        const expTimestamp = decodedPayload.exp * 1000
        expiryDate = new Date(expTimestamp).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        isExpired = Date.now() > expTimestamp
      }

      setHeader(JSON.stringify(decodedHeader, null, 2))
      setPayload(JSON.stringify(decodedPayload, null, 2))
      setDecodedData({
        header: decodedHeader,
        payload: decodedPayload,
        signature: parts[2],
        isExpired,
        expiryDate,
        algorithm: decodedHeader.alg || 'Unknown',
      })
    } catch (e) {
      setError('JWT 디코딩 실패: 올바른 JWT 토큰을 입력해주세요.')
      setHeader('')
      setPayload('')
      setDecodedData(null)
    }
  }

  const handleClear = () => {
    setInput('')
    setHeader('')
    setPayload('')
    setError('')
    setDecodedData(null)
  }

  return (
    <ToolCard
      title="🎫 JWT Decoder"
      description="JWT (JSON Web Token)을 디코딩하고 검증합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          placeholder="JWT 토큰을 입력하세요..."
          label="JWT Token"
          rows={4}
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleDecode}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Decode
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {decodedData && (
          <div className="space-y-4">
            {/* Token Info */}
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Algorithm</div>
                <div className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                  {decodedData.algorithm}
                </div>
              </div>
              {decodedData.expiryDate && (
                <>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expiry Date</div>
                    <div className="font-mono text-sm text-purple-700 dark:text-purple-300">
                      {decodedData.expiryDate}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${decodedData.isExpired ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30'}`}>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</div>
                    <div className={`font-semibold ${decodedData.isExpired ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                      {decodedData.isExpired ? '❌ Expired' : '✅ Valid'}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Header and Payload */}
            <div className="grid md:grid-cols-2 gap-4">
              <TextAreaWithCopy
                value={header}
                placeholder="Header"
                readOnly
                label="Header"
                rows={8}
              />
              <TextAreaWithCopy
                value={payload}
                placeholder="Payload"
                readOnly
                label="Payload"
                rows={8}
              />
            </div>

            {/* Signature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Signature (Base64)
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-xs break-all text-gray-700 dark:text-gray-300">
                {decodedData.signature}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
