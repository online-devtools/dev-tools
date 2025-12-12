import { Metadata } from 'next'
import ContactContent from '@/components/ContactContent'

export const metadata: Metadata = {
  title: '문의하기',
  description: 'Developer Tools에 대한 문의, 제안, 버그 리포트를 보내주세요.',
  openGraph: {
    title: '문의하기 - Developer Tools',
    description: 'Developer Tools 문의 페이지',
  },
}

export default function ContactPage() {
  return <ContactContent />
}
