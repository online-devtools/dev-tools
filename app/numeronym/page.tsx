import NumeronymTool from '@/components/NumeronymTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Numeronym Generator - 수자어 생성기',
  description: '단어를 numeronym으로 변환합니다. 예: internationalization → i18n',
  keywords: ['numeronym', 'i18n', 'a11y', 'k8s', '수자어'],
}

export default function NumeronymPage() {
  return <NumeronymTool />
}
