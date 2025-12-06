import EmojiPickerTool from '@/components/EmojiPickerTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Emoji Picker - 이모지 선택기',
  description: '이모지를 쉽게 복사하고 유니코드 값을 확인할 수 있습니다.',
  keywords: ['emoji', 'picker', 'unicode', '이모지', 'emoticon'],
}

export default function EmojiPickerPage() {
  return <EmojiPickerTool />
}
