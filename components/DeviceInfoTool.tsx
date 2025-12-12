'use client'

import { useState, useEffect } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DeviceInfoTool() {
  const { t } = useLanguage()
  // 브라우저와 화면 정보를 수집해 표시합니다.
  const [info, setInfo] = useState<any>(null)

  useEffect(() => {
    setInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages.join(', '),
      cookieEnabled: navigator.cookieEnabled,
      online: navigator.onLine,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
      devicePixelRatio: window.devicePixelRatio,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  }, [])

  if (!info) return null

  const InfoRow = ({ label, value }: { label: string, value: string | number | boolean }) => (
    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <span className="text-gray-900 dark:text-white font-mono text-sm">{String(value)}</span>
    </div>
  )

  return (
    <ToolCard
      title={`📱 ${t('deviceInfoTool.title')}`}
      description={t('deviceInfoTool.description')}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('deviceInfoTool.section.screen')}</h3>
          <InfoRow label={t('deviceInfoTool.screen.size')} value={`${info.screenWidth} × ${info.screenHeight}`} />
          <InfoRow label={t('deviceInfoTool.screen.available')} value={`${info.availWidth} × ${info.availHeight}`} />
          <InfoRow label={t('deviceInfoTool.screen.viewport')} value={`${info.viewportWidth} × ${info.viewportHeight}`} />
          <InfoRow label={t('deviceInfoTool.screen.dpr')} value={info.devicePixelRatio} />
          <InfoRow label={t('deviceInfoTool.screen.colorDepth')} value={`${info.colorDepth} bit`} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('deviceInfoTool.section.system')}</h3>
          <InfoRow label={t('deviceInfoTool.system.platform')} value={info.platform} />
          <InfoRow label={t('deviceInfoTool.system.language')} value={info.language} />
          <InfoRow label={t('deviceInfoTool.system.timezone')} value={info.timezone} />
          <InfoRow label={t('deviceInfoTool.system.cookies')} value={info.cookieEnabled ? t('deviceInfoTool.system.enabled') : t('deviceInfoTool.system.disabled')} />
          <InfoRow label={t('deviceInfoTool.system.online')} value={info.online ? t('deviceInfoTool.system.online.true') : t('deviceInfoTool.system.online.false')} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('deviceInfoTool.section.ua')}</h3>
          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-900 dark:text-white break-all font-mono">
              {info.userAgent}
            </p>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
