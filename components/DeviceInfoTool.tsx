'use client'

import { useState, useEffect } from 'react'
import ToolCard from './ToolCard'

export default function DeviceInfoTool() {
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
      title="Device Information"
      description="현재 기기의 정보를 확인합니다"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">화면</h3>
          <InfoRow label="화면 크기" value={`${info.screenWidth} × ${info.screenHeight}`} />
          <InfoRow label="사용 가능 영역" value={`${info.availWidth} × ${info.availHeight}`} />
          <InfoRow label="뷰포트 크기" value={`${info.viewportWidth} × ${info.viewportHeight}`} />
          <InfoRow label="픽셀 비율" value={info.devicePixelRatio} />
          <InfoRow label="색 깊이" value={`${info.colorDepth} bit`} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">시스템</h3>
          <InfoRow label="플랫폼" value={info.platform} />
          <InfoRow label="언어" value={info.language} />
          <InfoRow label="시간대" value={info.timezone} />
          <InfoRow label="쿠키 사용" value={info.cookieEnabled ? '활성화' : '비활성화'} />
          <InfoRow label="온라인 상태" value={info.online ? '온라인' : '오프라인'} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">User Agent</h3>
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
