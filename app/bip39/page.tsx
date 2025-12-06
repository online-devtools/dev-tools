import BIP39Tool from '@/components/BIP39Tool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BIP39 Mnemonic Generator - 암호화폐 지갑 니모닉 생성기',
  description: 'BIP39 표준 니모닉 구문을 생성하고 검증합니다. 암호화폐 지갑 복구용 시드 생성을 지원합니다.',
  keywords: ['BIP39', 'mnemonic', 'seed phrase', '니모닉', 'crypto wallet', 'bitcoin'],
}

export default function BIP39Page() {
  return <BIP39Tool />
}
