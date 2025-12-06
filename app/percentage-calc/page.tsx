import PercentageCalcTool from '@/components/PercentageCalcTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Percentage Calculator - 퍼센트 계산기',
  description: '다양한 퍼센트 계산을 쉽게 수행합니다. 증감율, 비율 등을 계산할 수 있습니다.',
  keywords: ['percentage', 'calculator', '퍼센트', '백분율', '계산기'],
}

export default function PercentageCalcPage() {
  return <PercentageCalcTool />
}
