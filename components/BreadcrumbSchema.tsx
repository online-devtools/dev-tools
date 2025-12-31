'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { getSiteBaseUrl } from '@/utils/siteUrl'

// BreadcrumbItem 타입 정의
// 각 breadcrumb 항목의 이름과 경로를 포함
interface BreadcrumbItem {
  name: string       // 표시될 이름 (예: "홈", "Base64 인코더")
  path: string       // 해당 페이지 경로 (예: "/", "/base64")
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]  // breadcrumb 항목 배열
}

/**
 * BreadcrumbSchema 컴포넌트
 *
 * 검색 엔진이 페이지 계층 구조를 이해할 수 있도록
 * Schema.org BreadcrumbList 구조화된 데이터를 생성합니다.
 *
 * Google 검색 결과에서 "홈 > 카테고리 > 페이지" 형태로 표시됩니다.
 *
 * @example
 * <BreadcrumbSchema items={[
 *   { name: '홈', path: '/' },
 *   { name: 'Base64 인코더', path: '/base64' }
 * ]} />
 */
export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const { language } = useLanguage()
  const siteBaseUrl = getSiteBaseUrl()

  // Schema.org BreadcrumbList 구조 생성
  // https://schema.org/BreadcrumbList 스펙 준수
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    // 각 항목을 ListItem으로 변환
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,  // 1부터 시작하는 위치
      name: item.name,
      item: `${siteBaseUrl}/${language}${item.path === '/' ? '' : item.path}`,
    })),
  }

  // JSON-LD 스크립트 태그로 구조화된 데이터 삽입
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  )
}
