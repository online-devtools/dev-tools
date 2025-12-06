import HTMLEntitiesTool from '@/components/HTMLEntitiesTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTML Entities Encoder/Decoder - HTML 엔티티 변환',
  description: 'HTML 특수문자를 엔티티로 인코딩하거나 엔티티를 디코딩합니다.',
  keywords: ['html entities', 'escape', 'unescape', 'html encoder', '&lt; &gt;'],
}

export default function HTMLEntitiesPage() {
  return <HTMLEntitiesTool />
}
