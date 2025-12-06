import SlugifyTool from '@/components/SlugifyTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Slugify String - URL/파일명 안전 문자열 변환',
  description: '문자열을 URL, 파일명, ID로 사용할 수 있도록 안전하게 변환합니다.',
  keywords: ['slugify', 'url safe', 'slug', '슬러그', 'url 변환'],
}

export default function SlugifyPage() {
  return <SlugifyTool />
}
