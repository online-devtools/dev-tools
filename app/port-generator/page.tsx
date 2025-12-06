import PortGeneratorTool from '@/components/PortGeneratorTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Random Port Generator - 랜덤 포트 번호 생성기',
  description: '알려진 포트(0-1023) 범위를 제외한 랜덤 포트 번호를 생성합니다.',
  keywords: ['port generator', 'random port', '포트 생성', 'network port'],
}

export default function PortGeneratorPage() {
  return <PortGeneratorTool />
}
