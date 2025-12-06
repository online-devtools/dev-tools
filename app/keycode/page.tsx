import KeycodeTool from '@/components/KeycodeTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Keycode Info - 키보드 이벤트 정보',
  description: '키보드의 keycode, code, key 값을 실시간으로 확인합니다.',
  keywords: ['keycode', 'keyboard', 'event', 'key', 'code'],
}

export default function KeycodePage() {
  return <KeycodeTool />
}
