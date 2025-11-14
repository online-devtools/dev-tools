import IPCalculatorTool from '@/components/IPCalculatorTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IP/CIDR Calculator | Developer Tools',
  description: 'IP 서브넷 계산기. CIDR 표기법으로 네트워크 주소, 브로드캐스트 주소, 사용 가능한 호스트 수를 계산합니다',
  keywords: ['ip calculator', 'cidr calculator', 'subnet calculator', 'network calculator', 'IP 계산기', '서브넷 계산기'],
}

export default function IPCalcPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <IPCalculatorTool />
    </div>
  )
}
