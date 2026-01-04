import { describe, expect, it } from 'vitest'
import { buildHomeItemListSchema } from '@/utils/homeSchema'

describe('buildHomeItemListSchema', () => {
  it('builds localized absolute URLs for the home item list', () => {
    // 테스트용 카테고리/도구 목록은 최소 구조만 유지해 결과를 검증한다.
    const categories = [
      {
        categoryKey: 'category.encoding',
        items: [
          { nameKey: 'tool.base64', descKey: 'tool.base64.desc', path: '/base64', icon: 'icon' },
          { nameKey: 'tool.url', descKey: 'tool.url.desc', path: '/url', icon: 'icon' },
        ],
      },
    ]

    // 번역 함수는 입력 키를 그대로 돌려서 스키마 필드 매핑을 확인한다.
    const t = (key: string) => `t:${key}`
    const schema = buildHomeItemListSchema({
      categories,
      language: 'en',
      t,
      baseUrl: 'https://example.com',
    })

    // 홈 URL과 각 도구 URL이 언어 프리픽스를 포함해 절대 경로로 생성되어야 한다.
    expect(schema.url).toBe('https://example.com/en')
    expect(schema.itemListElement[0].url).toBe('https://example.com/en/base64')
    expect(schema.itemListElement[1].url).toBe('https://example.com/en/url')
    // 번역 키 기반 이름과 설명이 스키마에 반영되는지 확인한다.
    expect(schema.name).toBe('t:home.title')
    expect(schema.description).toBe('t:home.hero.subtitle')
  })
})
