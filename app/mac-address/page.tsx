import MACAddressTool from '@/components/MACAddressTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MAC Address Generator - MAC 주소 생성 및 검증 도구',
  description: 'MAC 주소를 생성하고 검증하며 다양한 형식으로 변환합니다. OUI 정보 확인을 지원합니다.',
  keywords: ['MAC address', 'MAC generator', 'MAC 주소', 'OUI', 'network interface'],
}

export default function MACAddressPage() {
  return <MACAddressTool />
}
