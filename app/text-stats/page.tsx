import TextStatsTool from '@/components/TextStatsTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text Statistics - 텍스트 통계 분석',
  description: '텍스트의 문자 수, 단어 수, 줄 수, 바이트 크기 등을 분석합니다.',
  keywords: ['text statistics', 'character count', 'word count', '글자 수', '단어 수'],
}

export default function TextStatsPage() {
  return <TextStatsTool />
}
