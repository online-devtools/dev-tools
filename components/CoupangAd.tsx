'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

export default function CoupangAd() {
  const adContainerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Script가 이미 로드되었고, PartnersCoupang이 존재하는 경우 광고 초기화
    if (scriptLoadedRef.current && typeof window !== 'undefined' && (window as any).PartnersCoupang) {
      initAd()
    }
  }, [])

  const initAd = () => {
    if (typeof window !== 'undefined' && (window as any).PartnersCoupang && adContainerRef.current) {
      // 기존 광고 제거
      adContainerRef.current.innerHTML = ''

      // 새 광고 생성
      try {
        new (window as any).PartnersCoupang.G({
          id: 950900,
          trackingCode: "AF6325868",
          subId: null,
          template: "carousel",
          width: "680",
          height: "140"
        })
      } catch (error) {
        console.error('Coupang ad initialization failed:', error)
      }
    }
  }

  const handleScriptLoad = () => {
    scriptLoadedRef.current = true
    initAd()
  }

  return (
    <div className="w-full flex justify-center my-8">
      <Script
        src="https://ads-partners.coupang.com/g.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      <div
        ref={adContainerRef}
        className="max-w-[680px] w-full"
        style={{ minHeight: '140px' }}
      />
    </div>
  )
}
