'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

interface KakaoAdProps {
  adUnit: string
  width: string
  height: string
}

export default function KakaoAd({ adUnit, width, height }: KakaoAdProps) {
  const adContainerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // 스크립트가 로드된 후 광고 초기화
    if (scriptLoadedRef.current && adContainerRef.current) {
      // 이미 ins 태그가 있으면 스크립트가 자동으로 처리
      const insElement = adContainerRef.current.querySelector('ins')
      if (insElement) {
        // Kakao adfit 스크립트가 자동으로 광고를 렌더링
        insElement.style.display = 'block'
      }
    }
  }, [])

  const handleScriptLoad = () => {
    scriptLoadedRef.current = true
  }

  return (
    <div className="w-full flex justify-center my-8">
      <Script
        src="//t1.daumcdn.net/kas/static/ba.min.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      <div ref={adContainerRef} className="flex justify-center">
        <ins
          className="kakao_ad_area"
          style={{ display: 'none' }}
          data-ad-unit={adUnit}
          data-ad-width={width}
          data-ad-height={height}
        />
      </div>
    </div>
  )
}
