import IBANValidatorTool from '@/components/IBANValidatorTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IBAN Validator - 국제 은행 계좌 번호 검증 도구',
  description: 'IBAN(국제 은행 계좌 번호)을 검증하고 포맷팅합니다. 70개 이상의 국가를 지원합니다.',
  keywords: ['IBAN validator', 'IBAN checker', 'IBAN 검증', 'bank account', 'international banking'],
}

export default function IBANValidatorPage() {
  return <IBANValidatorTool />
}
