'use client'

import { useId } from 'react'
import Script from 'next/script'

type KakaoAdProps = {
  adUnit?: string
  width?: number
  height?: number
  wrapperClassName?: string
}

export default function KakaoAd({
  adUnit = 'DAN-5hqNqvnp5j3w8Gpi',
  width = 728,
  height = 90,
  wrapperClassName = 'w-full flex justify-center',
}: KakaoAdProps) {
  const baseId = useId().replace(/:/g, '')

  return (
    <div className={wrapperClassName}>
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit={adUnit}
        data-ad-width={String(width)}
        data-ad-height={String(height)}
        id={`kakao-ad-${baseId}`}
      />
      <Script
        id="kakao-adfit-script"
        src="https://t1.daumcdn.net/kas/static/ba.min.js"
        strategy="afterInteractive"
      />
    </div>
  )
}
