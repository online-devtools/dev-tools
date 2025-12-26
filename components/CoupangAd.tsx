'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

type CoupangPartnersOptions = {
  id: number
  trackingCode: string
  subId: string | null
  template: 'carousel' | string
  width: string
  height: string
  container?: HTMLElement
}

type CoupangPartners = {
  G: new (options: CoupangPartnersOptions) => void
}

type WindowWithPartners = Window & {
  PartnersCoupang?: CoupangPartners
}

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
    // 스크립트가 이미 로드된 상태라면 바로 초기화해 광고를 표시한다.
    if (typeof window !== 'undefined' && (window as WindowWithPartners).PartnersCoupang) {
      scriptLoadedRef.current = true
      initAd()
    }
  }, [])

  const initAd = () => {
    // 브라우저 환경이 아니거나, 광고 컨테이너가 없으면 실행하지 않는다.
    if (typeof window === 'undefined' || !adContainerRef.current) {
      return
    }

    const partners = (window as WindowWithPartners).PartnersCoupang
    if (!partners) {
      return
    }

    // 기존 광고 HTML을 비워 중복 렌더링을 방지한다.
    adContainerRef.current.innerHTML = ''

    try {
      // container 옵션을 전달하면 광고가 해당 컨테이너에 정확히 렌더링된다.
      new partners.G({
        id: 950900,
        trackingCode: 'AF6325868',
        subId: null,
        template: 'carousel',
        width: '680',
        height: '140',
        container: adContainerRef.current,
      })
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
