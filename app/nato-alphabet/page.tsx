import NATOAlphabetTool from '@/components/NATOAlphabetTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text to NATO Alphabet - NATO 음성 문자 변환',
  description: '텍스트를 NATO 음성 문자(Alpha, Bravo, Charlie 등)로 변환합니다. 무선 통신에 유용합니다.',
  keywords: ['nato alphabet', 'phonetic alphabet', '음성 문자', 'alpha bravo charlie'],
}

export default function NATOAlphabetPage() {
  return <NATOAlphabetTool />
}
