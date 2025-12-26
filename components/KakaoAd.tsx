'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

// Kakao AdFit render function signature so we can call it without any.
// ins 태그는 HTMLModElement로 표현되므로 해당 타입을 사용한다.
type KakaoAdFitRender = (element: HTMLModElement) => void
// Command queue signature used before the AdFit script is ready.
type KakaoAdFitCommand = () => void

// AdFit runtime object shape used by the global script.
type KakaoAdFitRuntime = {
  render?: KakaoAdFitRender
  destroy?: (element: HTMLModElement) => void
  cmd?: KakaoAdFitCommand[]
}

// Window 확장 타입으로 전역 AdFit 객체를 타입 안전하게 접근한다.
type WindowWithKakaoAdFit = Window & {
  kakaoAdFit?: KakaoAdFitRuntime
}

interface KakaoAdProps {
  // 광고 유닛 ID는 AdFit에서 발급받은 고유 키를 사용한다.
  adUnit: string
  // AdFit 스크립트가 요구하는 고정 폭/높이 문자열 값을 전달한다.
  width: string
  height: string
  // 외부 래퍼에서 여백/정렬을 커스터마이징할 수 있게 한다.
  wrapperClassName?: string
  // 내부 컨테이너 크기 제어를 위한 클래스 확장 지점이다.
  containerClassName?: string
  // 스크립트 로딩 시점을 제어해 첫 로드에서 광고 노출을 빠르게 만든다.
  scriptStrategy?: 'afterInteractive' | 'lazyOnload'
}

export default function KakaoAd({
  adUnit,
  width,
  height,
  wrapperClassName = 'my-8',
  containerClassName = '',
  scriptStrategy = 'afterInteractive',
}: KakaoAdProps) {
  // ins 태그를 직접 참조해 AdFit render 호출에 전달한다.
  const insRef = useRef<HTMLModElement>(null)
  // 스크립트 로드 전 중복 큐잉을 막기 위한 플래그다.
  const renderQueuedRef = useRef(false)
  // 실제 render 호출이 끝났는지 추적해 중복 렌더링을 방지한다.
  const hasRenderedRef = useRef(false)

  // 높이 숫자를 안전하게 파싱해 레이아웃 점프를 줄인다.
  const parsedHeight = Number(height)
  const minHeight = Number.isFinite(parsedHeight) ? `${parsedHeight}px` : undefined

  const requestRender = () => {
    // SSR 환경에서는 window가 없으므로 안전하게 종료한다.
    if (typeof window === 'undefined') {
      return
    }

    // ins 요소가 아직 만들어지지 않았다면 렌더링을 지연한다.
    const insElement = insRef.current
    if (!insElement) {
      return
    }

    const windowWithAdFit = window as WindowWithKakaoAdFit
    const adFitRuntime = windowWithAdFit.kakaoAdFit

    // AdFit이 이미 로드되었다면 바로 render를 호출하되 중복 호출을 막는다.
    if (adFitRuntime?.render) {
      if (hasRenderedRef.current) {
        return
      }

      adFitRuntime.render(insElement)
      hasRenderedRef.current = true
      return
    }

    // 스크립트 로드 전에는 큐에 한 번만 등록해서 중복 렌더를 막는다.
    if (renderQueuedRef.current) {
      return
    }

    renderQueuedRef.current = true

    // 스크립트 로드 후 실행될 렌더 커맨드를 큐에 등록한다.
    const renderCommand: KakaoAdFitCommand = () => {
      const runtime = (window as WindowWithKakaoAdFit).kakaoAdFit
      if (runtime?.render && !hasRenderedRef.current) {
        runtime.render(insElement)
        hasRenderedRef.current = true
      }
    }

    // AdFit이 아직 없다면 cmd 큐를 가진 임시 객체를 만든다.
    if (!windowWithAdFit.kakaoAdFit) {
      windowWithAdFit.kakaoAdFit = { cmd: [] }
    }

    // cmd 큐가 존재하는 경우에만 안전하게 push 한다.
    const cmdQueue = windowWithAdFit.kakaoAdFit.cmd
    if (Array.isArray(cmdQueue)) {
      cmdQueue.push(renderCommand)
    }
  }

  useEffect(() => {
    // 컴포넌트가 마운트되면 광고 렌더링을 요청한다.
    requestRender()
  }, [adUnit, width, height])

  const handleScriptLoad = () => {
    // 스크립트 로드 후에는 즉시 렌더링을 재시도한다.
    requestRender()
  }

  return (
    <div className={`w-full flex justify-center ${wrapperClassName}`}>
      <Script
        // Script를 고정 ID로 등록해 중복 로드를 방지한다.
        id="kakao-adfit-script"
        src="//t1.daumcdn.net/kas/static/ba.min.js"
        // 광고 초기화를 빠르게 하기 위해 전략을 커스터마이징한다.
        strategy={scriptStrategy}
        onLoad={handleScriptLoad}
      />
      <div className={`flex justify-center ${containerClassName}`} style={{ minHeight }}>
        <ins
          ref={insRef}
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
