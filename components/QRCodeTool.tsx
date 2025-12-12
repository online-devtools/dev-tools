'use client'

import React, { useState, useEffect } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

export default function QRCodeTool() {
  const { t } = useLanguage()
  // QR 코드 대상 텍스트, 이미지 URL, 크기 상태를 관리합니다.
  const [text, setText] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [size, setSize] = useState(200)

  const generateQRCode = () => {
    if (!text) return
    // Using Google Charts API for QR code generation
    const encodedText = encodeURIComponent(text)
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`
    setQrCode(url)
  }

  useEffect(() => {
    if (text) {
      const timer = setTimeout(() => {
        generateQRCode()
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setQrCode('')
    }
  }, [text, size])

  const handleDownload = () => {
    if (!qrCode) return
    const link = document.createElement('a')
    link.href = qrCode
    link.download = 'qrcode.png'
    link.click()
  }

  return (
    <ToolCard
      title={`📱 ${t('qrcodeTool.title')}`}
      description={t('qrcodeTool.description')}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('qrcodeTool.input.label')}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('qrcodeTool.input.placeholder')}
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('qrcodeTool.size.label', { width: size, height: size })}
          </label>
          <input
            type="range"
            min="100"
            max="500"
            step="50"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>100px</span>
            <span>500px</span>
          </div>
        </div>

        {qrCode && (
          <div className="flex flex-col items-center space-y-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600">
            <img
              src={qrCode}
              alt="QR Code"
              className="border-4 border-white shadow-lg"
              style={{ width: size, height: size }}
            />
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('qrcodeTool.download')}
            </button>
          </div>
        )}

        {!text && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('qrcodeTool.empty')}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
