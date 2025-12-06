import OTPTool from '@/components/OTPTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OTP Code Generator - 일회용 비밀번호 생성기',
  description: 'TOTP (Time-based One-Time Password) 코드를 생성하고 검증합니다. 2단계 인증에 사용됩니다.',
  keywords: ['otp', 'totp', '2fa', 'two factor', '일회용 비밀번호', '2단계 인증'],
}

export default function OTPPage() {
  return <OTPTool />
}
