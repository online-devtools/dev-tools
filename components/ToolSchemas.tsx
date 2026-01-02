'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import HowToSchema, { HOWTO_DATA } from './HowToSchema'
import BreadcrumbSchema from './BreadcrumbSchema'
import ToolSchema, { TOOL_CATEGORIES } from './ToolSchema'
import { getCategoryPath } from '@/utils/categoryRoutes'

/**
 * ToolSchemas - 통합 스키마 컴포넌트
 *
 * 각 도구 페이지에서 사용할 수 있는 통합 스키마 컴포넌트입니다.
 * HowTo, Breadcrumb, Tool 스키마를 한 번에 렌더링합니다.
 *
 * @example
 * <ToolSchemas
 *   toolKey="base64"
 *   toolPath="/base64"
 *   categoryKey="category.encoding"
 * />
 */

interface ToolSchemasProps {
  toolKey: string           // HOWTO_DATA 키 및 도구 식별자 (예: "base64", "json")
  toolPath: string          // 도구 경로 (예: "/base64")
  categoryKey: string       // 카테고리 i18n 키 (예: "category.encoding")
  categoryType?: keyof typeof TOOL_CATEGORIES  // ToolSchema 카테고리 타입
}

export default function ToolSchemas({
  toolKey,
  toolPath,
  categoryKey,
  categoryType = 'encoding',
}: ToolSchemasProps) {
  const { t, language } = useLanguage()

  // 현재 언어에 맞는 HowTo 데이터 선택 (영어가 기본)
  const howToLang = language === 'ko' ? 'ko' : 'en'
  const howToData = HOWTO_DATA[toolKey]?.[howToLang]

  // 도구 이름과 설명을 i18n에서 가져옴
  const toolName = t(`tool.${toolKey}`)
  const toolDescription = t(`${toolKey}.description`)
  const categoryName = t(categoryKey)
  // Use a real category hub path when available so breadcrumbs create valid internal links.
  const categoryPath = getCategoryPath(categoryKey) ?? '/'
  const homeName = t('nav.home') || '홈'

  return (
    <>
      {/* HowTo 스키마 - 단계별 가이드 (HOWTO_DATA에 있는 경우만) */}
      {howToData && (
        <HowToSchema
          name={howToData.name}
          description={howToData.description}
          steps={howToData.steps}
          toolPath={toolPath}
        />
      )}

      {/* Breadcrumb 스키마 - 페이지 계층 구조 */}
      <BreadcrumbSchema
        items={[
          { name: homeName, path: '/' },
          { name: categoryName, path: categoryPath },
          { name: toolName, path: toolPath },
        ]}
      />

      {/* Tool 스키마 - SoftwareApplication 구조화 데이터 */}
      <ToolSchema
        toolName={toolName}
        toolDescription={toolDescription}
        toolPath={toolPath}
        category={TOOL_CATEGORIES[categoryType]}
      />
    </>
  )
}

/**
 * 도구별 카테고리 매핑
 * config/tools.ts의 categoryKey와 ToolSchema의 카테고리 타입을 연결
 */
export const CATEGORY_TYPE_MAP: Record<string, keyof typeof TOOL_CATEGORIES> = {
  'category.encoding': 'encoding',
  'category.security': 'security',
  'category.dataFormat': 'formatting',
  'category.generators': 'generator',
  'category.converters': 'converter',
  'category.text': 'formatting',
  'category.calculators': 'generator',
  'category.info': 'generator',
  'category.linux': 'generator',
  'category.network': 'network',
  'category.workflow': 'generator',
  'category.files': 'generator',
  'category.frontend': 'image',
}
