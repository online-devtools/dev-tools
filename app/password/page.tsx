import PasswordGeneratorTool from '@/components/PasswordGeneratorTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Secure Password Generator | Developer Tools',
  description: '안전한 비밀번호 생성기. 대소문자, 숫자, 특수문자를 포함한 강력한 랜덤 비밀번호를 생성합니다',
  keywords: ['password generator', 'secure password', 'random password', '비밀번호 생성기', '안전한 비밀번호'],
}

export default function PasswordPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PasswordGeneratorTool />
    </div>
  )
}
