import type { Metadata } from 'next'
import EnvCryptoTool from '@/components/EnvCryptoTool'

export const metadata: Metadata = {
  // Metadata helps surface the .env crypto tool.
  title: '.env Encrypt/Decrypt - 환경 변수 암호화',
  description: '.env 파일 값을 암호화하거나 복호화합니다.',
  keywords: ['env', 'dotenv', 'encrypt', 'decrypt', 'security'],
}

export default function EnvCryptoPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the env crypto tool within the shared layout container. */}
      <EnvCryptoTool />
    </div>
  )
}
