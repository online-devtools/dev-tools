import BcryptTool from '@/components/BcryptTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bcrypt - 비밀번호 해싱 및 비교',
  description: 'Bcrypt를 사용하여 비밀번호를 안전하게 해싱하고 검증합니다. Blowfish 암호화 기반의 강력한 비밀번호 해싱 함수입니다.',
  keywords: ['bcrypt', 'password hash', '비밀번호 해싱', 'blowfish', 'salt'],
}

export default function BcryptPage() {
  return <BcryptTool />
}
