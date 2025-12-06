import MathEvalTool from '@/components/MathEvalTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Math Evaluator - 수식 계산기',
  description: '수학 표현식을 평가하고 계산합니다. sqrt, sin, cos, abs 등의 함수를 지원합니다.',
  keywords: ['math', 'calculator', '계산기', 'evaluator', 'expression'],
}

export default function MathEvalPage() {
  return <MathEvalTool />
}
