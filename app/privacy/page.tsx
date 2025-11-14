import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: 'Developer Tools의 개인정보 처리방침 및 프라이버시 정책입니다.',
  openGraph: {
    title: '개인정보 처리방침 - Developer Tools',
    description: 'Developer Tools의 개인정보 처리방침',
  },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          개인정보 처리방침
        </h1>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            최종 수정일: 2025년 1월 1일
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              1. 개인정보의 처리 목적
            </h2>
            <p className="leading-relaxed">
              Developer Tools("서비스")는 사용자의 개인정보를 수집하거나 저장하지 않습니다.
              모든 도구는 클라이언트 사이드(사용자의 브라우저)에서만 작동하며,
              입력된 데이터는 서버로 전송되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              2. 개인정보의 수집 및 이용
            </h2>
            <p className="leading-relaxed mb-3">
              본 서비스는 다음과 같은 개인정보를 수집하지 않습니다:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>이름, 이메일 주소, 전화번호 등의 개인 식별 정보</li>
              <li>도구에 입력된 데이터 (모두 브라우저 내에서만 처리됨)</li>
              <li>회원가입 정보 (회원가입 기능 없음)</li>
              <li>결제 정보 (유료 서비스 없음)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              3. 쿠키 및 유사 기술
            </h2>
            <p className="leading-relaxed mb-3">
              본 서비스는 다음과 같은 목적으로 쿠키 및 유사 기술을 사용할 수 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>필수 쿠키:</strong> 웹사이트의 기본 기능을 제공하기 위한 쿠키</li>
              <li><strong>분석 쿠키:</strong> 웹사이트 사용 통계 분석 (Google Analytics 등)</li>
              <li><strong>광고 쿠키:</strong> Google AdSense를 통한 맞춤형 광고 제공</li>
            </ul>
            <p className="leading-relaxed mt-3">
              대부분의 웹 브라우저는 쿠키를 자동으로 수락하지만, 브라우저 설정을 통해
              쿠키를 거부하거나 삭제할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              4. Google AdSense
            </h2>
            <p className="leading-relaxed mb-3">
              본 서비스는 Google AdSense를 사용하여 광고를 게재합니다. Google은 이 웹사이트의
              방문자에게 맞춤형 광고를 게재하기 위해 쿠키를 사용합니다.
            </p>
            <p className="leading-relaxed mb-3">
              사용자는 Google 광고 설정 페이지에서 맞춤 광고를 비활성화할 수 있습니다:
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 ml-1"
              >
                https://www.google.com/settings/ads
              </a>
            </p>
            <p className="leading-relaxed">
              Google의 개인정보 보호정책:
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 ml-1"
              >
                https://policies.google.com/privacy
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              5. 데이터 보안
            </h2>
            <p className="leading-relaxed">
              모든 도구는 클라이언트 사이드에서만 작동하므로, 사용자가 입력한 데이터는
              사용자의 브라우저를 벗어나지 않습니다. 서버로 데이터가 전송되지 않으므로,
              데이터 유출의 위험이 없습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              6. 외부 링크
            </h2>
            <p className="leading-relaxed">
              본 서비스는 외부 웹사이트로의 링크를 포함할 수 있습니다. 외부 웹사이트의
              개인정보 처리방침은 본 서비스와 무관하며, 해당 웹사이트의 정책을 따릅니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              7. 아동의 개인정보 보호
            </h2>
            <p className="leading-relaxed">
              본 서비스는 만 14세 미만 아동의 개인정보를 수집하지 않습니다.
              본 서비스는 개인정보를 수집하지 않으므로, 모든 연령대의 사용자가 안전하게
              이용할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              8. 개인정보 처리방침의 변경
            </h2>
            <p className="leading-relaxed">
              본 개인정보 처리방침은 법령 및 서비스의 변경에 따라 수정될 수 있습니다.
              개인정보 처리방침이 변경되는 경우, 변경사항은 본 페이지를 통해 공지됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              9. 문의처
            </h2>
            <p className="leading-relaxed">
              개인정보 처리방침에 대한 문의사항이 있으시면
              <a href="/contact" className="text-blue-500 hover:text-blue-600 ml-1">
                문의 페이지
              </a>
              를 통해 연락해 주시기 바랍니다.
            </p>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              10. 사용자의 권리
            </h2>
            <p className="leading-relaxed mb-3">
              본 서비스는 개인정보를 수집하지 않으므로, 다음과 같은 권리 행사가 필요하지 않습니다:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>개인정보 열람 요구권</li>
              <li>개인정보 정정·삭제 요구권</li>
              <li>개인정보 처리정지 요구권</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
