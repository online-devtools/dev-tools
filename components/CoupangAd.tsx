'use client'

import { useCallback, useEffect, useId, useRef } from 'react'
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
  // useId로 생성한 문자열을 정규화해 DOM id로 안전하게 사용한다.
  const rawContainerId = useId()
  // ":" 같은 특수 문자는 제거해 getElementById 호출이 안정적으로 동작하게 한다.
  const containerId = `coupang-${rawContainerId.replace(/:/g, '')}`
  // 광고 렌더가 중복 실행되지 않도록 상태를 추적한다.
  const hasRenderedRef = useRef(false)

  const initAd = useCallback(() => {
    // 브라우저 환경이 아니거나, 광고 컨테이너가 없으면 실행하지 않는다.
    if (typeof window === 'undefined' || !adContainerRef.current) {
      return
    }

    // 이미 렌더링을 완료했다면 중복 실행을 막는다.
    if (hasRenderedRef.current) {
      return
    }

    const windowWithPartners = window as WindowWithPartners
    if (!windowWithPartners.PartnersCoupang) {
      return
    }

    // 기존 광고 HTML을 비워 중복 렌더링을 방지한다.
    adContainerRef.current.innerHTML = ''

    // inline script를 컨테이너에 삽입해 광고가 현재 위치에 렌더링되도록 한다.
    const inlineScript = document.createElement('script')
    inlineScript.type = 'text/javascript'
    inlineScript.text = `
      new PartnersCoupang.G({
        id: 950900,
        trackingCode: 'AF6325868',
        subId: null,
        template: 'carousel',
        width: '680',
        height: '140',
        container: document.getElementById('${containerId}'),
      });
    `

    try {
      // 스크립트를 append해야 실제 DOM에서 실행되므로 container에 삽입한다.
      adContainerRef.current.appendChild(inlineScript)
      hasRenderedRef.current = true
    } catch (error) {
      console.error('Coupang ad initialization failed:', error)
    }
  }, [containerId])

  useEffect(() => {
    // 스크립트가 이미 로드된 상태라면 바로 초기화해 광고를 표시한다.
    if (typeof window !== 'undefined' && (window as WindowWithPartners).PartnersCoupang) {
      initAd()
    }
  }, [initAd])

  const handleScriptLoad = () => {
    initAd()
  }

  return (
    <div className={`w-full flex justify-center ${wrapperClassName}`}>
      <Script
        // 동일 스크립트 중복 로드를 막기 위해 고정 ID를 부여한다.
        id="coupang-partners-script"
        src="https://ads-partners.coupang.com/g.js"
        // Use the provided strategy so the home page can request faster ad loading.
        strategy={scriptStrategy}
        onLoad={handleScriptLoad}
      />
      <div
        id={containerId}
        ref={adContainerRef}
        className={`max-w-[680px] w-full ${containerClassName}`}
        style={{ minHeight: `${minHeight}px` }}
      />
    </div>
  )
}
