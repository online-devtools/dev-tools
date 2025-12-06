import ULIDTool from '@/components/ULIDTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ULID Generator - 정렬 가능한 고유 식별자',
  description: 'ULID (Universally Unique Lexicographically Sortable Identifier)를 생성합니다. 시간순으로 정렬 가능한 128비트 식별자입니다.',
  keywords: ['ulid', 'uuid', 'unique id', '고유 식별자', 'sortable id'],
}

export default function ULIDPage() {
  return <ULIDTool />
}
