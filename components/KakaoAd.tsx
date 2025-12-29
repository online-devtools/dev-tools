'use client'

import { useEffect, useId, useRef } from 'react'

type KakaoAdProps = {
  adUnit?: string
  width?: number | string
  height?: number | string
  wrapperClassName?: string
}

export default function KakaoAd({
  adUnit = 'DAN-5hqNqvnp5j3w8Gpi',
  width = 728,
  height = 90,
  wrapperClassName = 'w-full flex justify-center',
}: KakaoAdProps) {
  const baseId = useId().replace(/:/g, '')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const script = document.createElement('script')
    script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js'
    script.async = true
    containerRef.current.appendChild(script)

    return () => {
      script.remove()
    }
  }, [adUnit, width, height])

  return (
    <div className={wrapperClassName} ref={containerRef}>
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit={adUnit}
        data-ad-width={String(width)}
        data-ad-height={String(height)}
        id={`kakao-ad-${baseId}`}
      />
    </div>
  )
}
