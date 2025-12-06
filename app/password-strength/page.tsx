import PasswordStrengthTool from '@/components/PasswordStrengthTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Password Strength Analyzer - 비밀번호 강도 분석 도구',
  description: '비밀번호의 강도를 실시간으로 분석하고 보안 점수를 평가합니다. 크래킹 예상 시간과 개선 제안을 제공합니다.',
  keywords: ['password strength', 'password analyzer', '비밀번호 강도', 'password security', 'password checker'],
}

export default function PasswordStrengthPage() {
  return <PasswordStrengthTool />
}
