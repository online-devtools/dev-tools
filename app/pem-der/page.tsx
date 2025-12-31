import PemDerTool from '@/components/PemDerTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PEM/DER Converter - 인증서 포맷 변환',
  description: 'PEM과 DER 형식 간 인증서 변환 도구. SSL/TLS 인증서, 개인키, 공개키를 다양한 형식으로 변환합니다.',
  keywords: ['PEM', 'DER', 'SSL', 'TLS', '인증서', 'certificate', 'X.509', 'private key', 'public key'],
  openGraph: {
    title: 'PEM/DER Converter - Developer Tools',
    description: 'PEM과 DER 형식 간 인증서 변환 도구',
  },
}

export default function PemDerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PemDerTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          PEM과 DER 형식 이해하기
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              PEM 형식
            </h3>
            <p className="leading-relaxed mb-4">
              PEM(Privacy Enhanced Mail)은 Base64로 인코딩된 DER 데이터에
              헤더와 푸터를 추가한 텍스트 형식입니다. 대부분의 Linux/Unix 시스템과
              OpenSSL에서 기본적으로 사용됩니다.
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto">
{`-----BEGIN CERTIFICATE-----
MIIBkTCB+wIJAKHBfpegPj0vMA0GCSqGSIb3DQEB...
-----END CERTIFICATE-----`}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              DER 형식
            </h3>
            <p className="leading-relaxed">
              DER(Distinguished Encoding Rules)은 ASN.1 데이터 구조의 바이너리 인코딩입니다.
              PEM보다 크기가 작고, Windows 시스템에서 주로 사용됩니다 (.cer, .crt 확장자).
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>서버 설정:</strong> Nginx, Apache 등 웹서버에 SSL 인증서 설치</li>
              <li><strong>Java 키스토어:</strong> .p12나 .jks 파일에서 추출한 인증서 변환</li>
              <li><strong>Windows ↔ Linux:</strong> 운영체제 간 인증서 형식 호환</li>
              <li><strong>API 인증:</strong> mTLS 클라이언트 인증서 설정</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              OpenSSL 명령어
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm font-semibold mb-1">PEM → DER</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block">
                  openssl x509 -in cert.pem -outform der -out cert.der
                </code>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">DER → PEM</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block">
                  openssl x509 -in cert.der -inform der -out cert.pem
                </code>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              관련 도구
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/ssl-cert" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔒 SSL 인증서 분석</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">인증서 상세 정보 확인</p>
              </a>
              <a href="/cert-chain" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">🔗 인증서 체인 검증</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">인증서 체인 유효성 검사</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
