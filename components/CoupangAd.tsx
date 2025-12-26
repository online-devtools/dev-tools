'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

type CoupangAdProps = {
  // Tailwind classes for the outer wrapper to control spacing and alignment.
  wrapperClassName?: string
  // Tailwind classes for the ad container to adjust sizing constraints.
  containerClassName?: string
  // Minimum height keeps layout stable while the ad script initializes.
  minHeight?: number
  // Script 로딩 시점을 지정해 홈에서는 더 빠르게 광고가 렌더링되도록 한다.
  scriptStrategy?: 'afterInteractive' | 'lazyOnload'
}

export default function CoupangAd({
  wrapperClassName = 'my-8',
  containerClassName = '',
  minHeight = 140,
  scriptStrategy = 'lazyOnload',
}: CoupangAdProps) {
  const adContainerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Script가 이미 로드되었고, PartnersCoupang이 존재하는 경우 광고 초기화
    if (scriptLoadedRef.current && typeof window !== 'undefined' && (window as any).PartnersCoupang) {
      initAd()
    }
  }, [])

  const initAd = () => {
    // 브라우저 환경에서만 실행되도록 체크하고, 컨테이너가 없으면 초기화를 중단한다.
    if (typeof window === 'undefined' || !adContainerRef.current) {
      return
    }

    const partners = (window as any).PartnersCoupang
    if (!partners) {
      return
    }

    // 기존 광고 HTML을 비워서 중복 렌더링을 방지한다.
    adContainerRef.current.innerHTML = ''

    // 광고 스크립트를 컨테이너 내부에 삽입해 여러 배치에서도 위치가 유지되게 한다.
    try {
      const inlineScript = document.createElement('script')
      inlineScript.type = 'text/javascript'
      inlineScript.text = `
        new window.PartnersCoupang.G({
          id: 950900,
          trackingCode: "AF6325868",
          subId: null,
          template: "carousel",
          width: "680",
          height: "140"
        });
      `
      adContainerRef.current.appendChild(inlineScript)
    } catch (error) {
      console.error('Coupang ad initialization failed:', error)
    }
  }

  const handleScriptLoad = () => {
    scriptLoadedRef.current = true
    initAd()
  }

  return (
    <div className={`w-full flex justify-center ${wrapperClassName}`}>
      <Script
        src="https://ads-partners.coupang.com/g.js"
        // Use the provided strategy so the home page can request faster ad loading.
        strategy={scriptStrategy}
        onLoad={handleScriptLoad}
      />
      <div
        ref={adContainerRef}
        className={`max-w-[680px] w-full ${containerClassName}`}
        style={{ minHeight: `${minHeight}px` }}
      />
    </div>
  )
}
