import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

// OG 이미지 크기 - 소셜 미디어 권장 사이즈
const size = {
  width: 1200,
  height: 630,
}

export const runtime = 'edge'

// 언어별 OG 이미지 콘텐츠 정의
// 소셜 공유 시 각 언어권 사용자에게 최적화된 메시지 표시
const contentByLanguage: Record<string, {
  title: string
  subtitle: string
  tagline: string
  toolCount: string
}> = {
  ko: {
    title: '개발자를 위한\n필수 온라인 도구',
    subtitle: 'Base64 · JSON · JWT · Regex · QR Code · UUID',
    tagline: '빠르고 안전한 클라이언트 사이드 처리',
    toolCount: '170+ Tools',
  },
  en: {
    title: 'Essential Online Tools\nfor Developers',
    subtitle: 'Base64 · JSON · JWT · Regex · QR Code · UUID',
    tagline: 'Fast & Secure Client-Side Processing',
    toolCount: '170+ Tools',
  },
  ja: {
    title: '開発者向け\n必須オンラインツール',
    subtitle: 'Base64 · JSON · JWT · Regex · QR Code · UUID',
    tagline: '高速で安全なクライアントサイド処理',
    toolCount: '170+ Tools',
  },
  pt: {
    title: 'Ferramentas Online\nEssenciais para Devs',
    subtitle: 'Base64 · JSON · JWT · Regex · QR Code · UUID',
    tagline: 'Processamento Rápido e Seguro no Cliente',
    toolCount: '170+ Tools',
  },
  de: {
    title: 'Unverzichtbare\nOnline-Tools für Devs',
    subtitle: 'Base64 · JSON · JWT · Regex · QR Code · UUID',
    tagline: 'Schnelle & Sichere Client-Verarbeitung',
    toolCount: '170+ Tools',
  },
}

// GET 요청 처리 - 언어 파라미터에 따라 다국어 OG 이미지 생성
export function GET(request: NextRequest) {
  // URL 쿼리 파라미터에서 언어 코드 추출 (기본값: ko)
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || 'ko'

  // 지원하지 않는 언어는 한국어로 폴백
  const content = contentByLanguage[lang] || contentByLanguage.ko

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          // 그라데이션 배경 - 브랜드 컬러 사용
          backgroundImage:
            'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #38bdf8 100%)',
          color: '#f8fafc',
          fontFamily: 'Inter, Pretendard, system-ui, -apple-system, sans-serif',
        }}
      >
        {/* 상단 헤더: 사이트명과 도구 개수 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            opacity: 0.9,
            fontSize: 28,
            letterSpacing: 6,
            textTransform: 'uppercase',
          }}
        >
          <span>Developer Tools</span>
          <span>{content.toolCount}</span>
        </div>

        {/* 중앙 메인 콘텐츠: 타이틀과 도구 목록 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h1
            style={{
              fontSize: 76,
              margin: 0,
              fontWeight: 700,
              lineHeight: 1.15,
              whiteSpace: 'pre-wrap', // \n 줄바꿈 처리
            }}
          >
            {content.title}
          </h1>
          <p
            style={{
              marginTop: 32,
              fontSize: 32,
              opacity: 0.9,
            }}
          >
            {content.subtitle}
          </p>
        </div>

        {/* 하단 푸터: 도메인과 태그라인 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 26,
            opacity: 0.85,
          }}
        >
          <span>dev-tools-online.com</span>
          <span>{content.tagline}</span>
        </div>
      </div>
    ),
    size
  )
}
