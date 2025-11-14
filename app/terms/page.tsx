import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관',
  description: 'Developer Tools의 서비스 이용약관입니다.',
  openGraph: {
    title: '이용약관 - Developer Tools',
    description: 'Developer Tools의 서비스 이용약관',
  },
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          이용약관
        </h1>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            최종 수정일: 2025년 1월 1일
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제1조 (목적)
            </h2>
            <p className="leading-relaxed">
              본 약관은 Developer Tools("서비스")가 제공하는 온라인 개발 도구 서비스의
              이용과 관련하여 서비스와 이용자의 권리, 의무 및 책임사항, 기타 필요한
              사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제2조 (정의)
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>1. "서비스"</strong>란 Developer Tools가 제공하는 Base64 인코딩/디코딩,
                JSON 포맷팅, JWT 디코딩 등의 온라인 개발 도구를 의미합니다.
              </li>
              <li>
                <strong>2. "이용자"</strong>란 본 서비스에 접속하여 본 약관에 따라
                서비스를 이용하는 모든 사람을 의미합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제3조 (약관의 효력 및 변경)
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>1.</strong> 본 약관은 서비스를 이용하고자 하는 모든 이용자에게
                그 효력이 발생합니다.
              </li>
              <li>
                <strong>2.</strong> 서비스는 필요한 경우 관련 법령을 위배하지 않는
                범위 내에서 본 약관을 변경할 수 있으며, 변경된 약관은 본 페이지를
                통해 공지됩니다.
              </li>
              <li>
                <strong>3.</strong> 이용자는 변경된 약관에 동의하지 않을 경우
                서비스 이용을 중단할 수 있습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제4조 (서비스의 제공)
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>1.</strong> 서비스는 다음과 같은 개발 도구를 무료로 제공합니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>인코딩/디코딩 도구 (Base64, URL 등)</li>
                  <li>보안 도구 (Jasypt 암호화, 해시 생성기)</li>
                  <li>데이터 포맷 도구 (JSON, JWT, SQL, CSV, HTML/XML)</li>
                  <li>생성기 도구 (UUID, QR 코드, Lorem Ipsum)</li>
                  <li>변환기 도구 (타임스탬프, 컬러, 케이스)</li>
                  <li>유틸리티 도구 (정규식 테스터, Cron 파서, Diff Checker)</li>
                </ul>
              </li>
              <li>
                <strong>2.</strong> 서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다.
                다만, 서버 점검 등 운영상 필요한 경우 서비스의 전부 또는 일부를 일시 중단할 수 있습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제5조 (서비스의 제한 및 중단)
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>1.</strong> 서비스는 다음과 같은 경우 서비스 제공을 일시적으로
                제한하거나 중단할 수 있습니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>서비스 설비의 보수 또는 점검</li>
                  <li>전기통신사업법에 규정된 기간통신사업자의 서비스 중지</li>
                  <li>국가비상사태, 정전, 서비스 설비의 장애 또는 이용량 폭주 등</li>
                  <li>기타 불가항력적 사유가 있는 경우</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제6조 (이용자의 의무)
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>1.</strong> 이용자는 본 서비스를 이용함에 있어 다음 각 호의
                행위를 하여서는 안 됩니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>타인의 정보 도용</li>
                  <li>서비스의 운영을 방해하는 행위</li>
                  <li>불법적이거나 부도덕한 목적으로 서비스를 이용하는 행위</li>
                  <li>서비스의 지적재산권을 침해하는 행위</li>
                  <li>자동화된 수단을 통한 과도한 요청으로 서비스에 부하를 주는 행위</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제7조 (서비스의 책임)
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>1.</strong> 서비스는 무료로 제공되며, "있는 그대로" 제공됩니다.
              </li>
              <li>
                <strong>2.</strong> 서비스는 이용자가 도구를 사용하여 생성한 결과물의
                정확성, 완전성, 신뢰성에 대해 보증하지 않습니다.
              </li>
              <li>
                <strong>3.</strong> 서비스는 이용자의 서비스 이용으로 인해 발생한
                손해에 대해 책임을 지지 않습니다. 단, 서비스의 고의 또는 중과실에
                의한 경우는 제외합니다.
              </li>
              <li>
                <strong>4.</strong> 서비스는 제공되는 도구의 결과물을 이용자가
                어떻게 사용하는지에 대해 책임을 지지 않습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제8조 (데이터 보안 및 프라이버시)
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>1.</strong> 본 서비스의 모든 도구는 클라이언트 사이드에서만
                작동하며, 이용자가 입력한 데이터는 서버로 전송되지 않습니다.
              </li>
              <li>
                <strong>2.</strong> 이용자는 본 서비스 이용 시 입력한 데이터의 보안에
                대한 전적인 책임을 지며, 민감한 정보 입력 시 주의를 기울여야 합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제9조 (광고 게재)
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>1.</strong> 서비스는 운영을 위해 Google AdSense 등의 광고를
                게재할 수 있습니다.
              </li>
              <li>
                <strong>2.</strong> 서비스는 광고 내용 및 광고와 관련된 거래에 대해
                책임을 지지 않습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제10조 (지적재산권)
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>1.</strong> 서비스에 대한 모든 지적재산권은 서비스에 귀속됩니다.
              </li>
              <li>
                <strong>2.</strong> 이용자는 서비스를 이용함으로써 얻은 정보를
                서비스의 사전 승낙 없이 복제, 전송, 출판, 배포, 방송 등 기타 방법에
                의하여 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제11조 (분쟁 해결)
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>1.</strong> 서비스와 이용자 간 발생한 분쟁에 관한 소송은
                대한민국 법을 준거법으로 합니다.
              </li>
              <li>
                <strong>2.</strong> 서비스와 이용자 간 발생한 분쟁에 관한 소송은
                서비스의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
              </li>
            </ul>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              부칙
            </h2>
            <p className="leading-relaxed">
              본 약관은 2025년 1월 1일부터 시행됩니다.
            </p>
          </section>

          <section className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm">
              <strong>문의사항:</strong> 본 약관에 대한 문의사항이 있으시면
              <a href="/contact" className="text-blue-500 hover:text-blue-600 ml-1">
                문의 페이지
              </a>
              를 통해 연락해 주시기 바랍니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
