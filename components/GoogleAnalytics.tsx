'use client'

import Script from 'next/script'

// Google Analytics 4 Measurement ID
// 환경변수로 관리하여 개발/프로덕션 분리
// .env.local에 NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX 형태로 설정
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

/**
 * GoogleAnalytics 컴포넌트
 *
 * Google Analytics 4 (GA4) 트래킹 스크립트를 로드합니다.
 * - 페이지뷰 자동 추적
 * - 커스텀 이벤트 추적 지원
 * - GDPR 준수를 위한 옵트아웃 지원 (추후 구현)
 *
 * 사용법:
 * 1. .env.local 파일에 NEXT_PUBLIC_GA_ID 환경변수 설정
 * 2. layout.tsx의 <head> 또는 <body> 안에 <GoogleAnalytics /> 추가
 *
 * @example
 * // app/layout.tsx
 * import GoogleAnalytics from '@/components/GoogleAnalytics'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <GoogleAnalytics />
 *         {children}
 *       </body>
 *     </html>
 *   )
 * }
 */
export default function GoogleAnalytics() {
  // GA ID가 설정되지 않으면 스크립트를 로드하지 않음
  // 개발 환경에서 불필요한 트래킹 방지
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Google Analytics gtag.js 스크립트 로드 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"  // 페이지 로드 후 비동기 로드
      />
      {/* GA 초기화 및 설정 스크립트 */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // 기본 페이지뷰 트래킹 활성화
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              // 익명화된 IP 사용 (프라이버시 강화)
              anonymize_ip: true,
            });
          `,
        }}
      />
    </>
  )
}

/**
 * 커스텀 이벤트 트래킹 함수
 *
 * 도구 사용, 버튼 클릭 등 사용자 행동을 추적할 때 사용합니다.
 *
 * @param action - 이벤트 액션 (예: 'tool_use', 'button_click')
 * @param category - 이벤트 카테고리 (예: 'encoding', 'security')
 * @param label - 이벤트 라벨 (예: 'base64_encode')
 * @param value - 이벤트 값 (선택적, 숫자)
 *
 * @example
 * // 도구 사용 추적
 * trackEvent('tool_use', 'encoding', 'base64_encode')
 *
 * // 버튼 클릭 추적
 * trackEvent('button_click', 'ui', 'copy_button')
 */
export function trackEvent(
  action: string,
  category: string,
  label: string,
  value?: number
) {
  // GA가 로드되지 않은 경우 무시
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// TypeScript를 위한 gtag 전역 타입 선언
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer: unknown[]
  }
}
