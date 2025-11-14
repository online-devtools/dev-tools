import ChmodTool from '@/components/ChmodTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unix Permission Calculator (chmod) | Developer Tools',
  description: 'Unix/Linux 파일 권한 계산기. chmod 명령어를 위한 8진수 및 기호 표기법 변환 도구',
  keywords: ['chmod', 'unix permission', 'linux permission', 'file permission', '파일 권한', '리눅스 권한', 'chmod 계산기'],
}

export default function ChmodPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChmodTool />
    </div>
  )
}
