import ListConverterTool from '@/components/ListConverterTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'List Converter - 리스트 변환 도구',
  description: '리스트 데이터를 다양한 형식으로 변환합니다. 정렬, 중복 제거, 대소문자 변환 등을 지원합니다.',
  keywords: ['list converter', 'list transformer', '리스트 변환', 'sort', 'unique'],
}

export default function ListConverterPage() {
  return <ListConverterTool />
}
