'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { getSiteBaseUrl } from '@/utils/siteUrl'

// 도구 스키마에 필요한 props 타입 정의
interface ToolSchemaProps {
  toolName: string           // 도구 이름 (예: "Base64 Encoder")
  toolDescription: string    // 도구 설명
  toolPath: string           // 도구 경로 (예: "/base64")
  category?: string          // 카테고리 (예: "Encoding", "Security")
}

/**
 * ToolSchema 컴포넌트
 *
 * 각 도구 페이지에 Schema.org SoftwareApplication 구조화된 데이터를 추가합니다.
 * 이를 통해 검색 엔진이 도구의 정보를 더 잘 이해하고 리치 스니펫으로 표시할 수 있습니다.
 *
 * @example
 * <ToolSchema
 *   toolName="Base64 인코더"
 *   toolDescription="Base64 인코딩/디코딩 도구"
 *   toolPath="/base64"
 *   category="Encoding"
 * />
 */
export default function ToolSchema({
  toolName,
  toolDescription,
  toolPath,
  category = 'DeveloperApplication',
}: ToolSchemaProps) {
  const { language } = useLanguage()
  const siteBaseUrl = getSiteBaseUrl()

  // 전체 도구 URL 생성 (언어 경로 포함)
  const toolUrl = `${siteBaseUrl}/${language}${toolPath}`

  // Schema.org SoftwareApplication 구조 생성
  // https://schema.org/SoftwareApplication 스펙 준수
  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolName,
    description: toolDescription,
    url: toolUrl,
    // 애플리케이션 카테고리 (개발자 도구)
    applicationCategory: category,
    // 웹 기반이므로 모든 OS에서 동작
    operatingSystem: 'Any',
    // 무료 도구임을 명시
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    // 게시자 정보
    publisher: {
      '@type': 'Organization',
      name: 'Developer Tools',
      url: siteBaseUrl,
    },
    // 추가 기능 정보
    featureList: [
      'Client-side processing',
      'No data stored on server',
      'Free to use',
      'No registration required',
    ],
    // 다국어 지원 표시
    inLanguage: ['ko-KR', 'en-US', 'ja-JP', 'pt-BR', 'de-DE'],
  }

  // JSON-LD 스크립트 태그로 구조화된 데이터 삽입
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
    />
  )
}

// 카테고리별 기본값 정의
// 각 도구 유형에 맞는 Schema.org applicationCategory 값
export const TOOL_CATEGORIES = {
  encoding: 'DeveloperApplication',
  security: 'SecurityApplication',
  formatting: 'DeveloperApplication',
  generator: 'UtilitiesApplication',
  converter: 'UtilitiesApplication',
  testing: 'DeveloperApplication',
  network: 'NetworkApplication',
  image: 'MultimediaApplication',
} as const
