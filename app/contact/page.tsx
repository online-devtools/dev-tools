import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '문의하기',
  description: 'Developer Tools에 대한 문의, 제안, 버그 리포트를 보내주세요.',
  openGraph: {
    title: '문의하기 - Developer Tools',
    description: 'Developer Tools 문의 페이지',
  },
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          문의하기
        </h1>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <p className="leading-relaxed text-lg">
              Developer Tools를 이용해 주셔서 감사합니다.
              서비스 개선을 위한 제안, 버그 리포트, 새로운 도구 요청 등
              어떤 의견이든 환영합니다.
            </p>
          </section>

          <section className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              📧 이메일 문의
            </h2>
            <p className="leading-relaxed mb-2">
              문의사항은 아래 이메일 주소로 보내주세요:
            </p>
            <p className="text-xl font-mono text-blue-600 dark:text-blue-400">
              wxyz0904@naver.com
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              * 영업일 기준 1-2일 내에 답변드리겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              💬 문의 유형
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <span className="mr-2">🐛</span>
                  버그 리포트
                </h3>
                <p className="text-sm">
                  도구가 제대로 작동하지 않거나 오류가 발생하는 경우,
                  상세한 상황과 함께 알려주세요.
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  새로운 도구 제안
                </h3>
                <p className="text-sm">
                  추가되었으면 하는 개발 도구가 있다면
                  자유롭게 제안해 주세요.
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <span className="mr-2">✨</span>
                  기능 개선 제안
                </h3>
                <p className="text-sm">
                  기존 도구의 개선이나 새로운 기능에 대한
                  아이디어를 공유해 주세요.
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <span className="mr-2">❓</span>
                  일반 문의
                </h3>
                <p className="text-sm">
                  서비스 이용, 제휴, 광고 등
                  기타 문의사항을 보내주세요.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              📝 효과적인 문의 방법
            </h2>
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold">버그 리포트 시 포함해 주시면 좋은 정보:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>사용 중인 브라우저 (Chrome, Firefox, Safari 등)</li>
                <li>사용 중인 기기 (Desktop, Mobile, Tablet)</li>
                <li>발생한 오류의 스크린샷 또는 상세 설명</li>
                <li>오류가 발생한 입력 데이터 (민감한 정보는 제외)</li>
                <li>재현 방법 (어떤 순서로 작업했는지)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              🔒 개인정보 보호
            </h2>
            <p className="leading-relaxed">
              문의하실 때 민감한 개인정보나 비밀번호, API 키 등은 포함하지 마세요.
              본 서비스는 모든 데이터를 클라이언트 사이드에서만 처리하므로,
              실제 중요한 데이터를 문의 메일에 포함시킬 필요가 없습니다.
            </p>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              ⚡ 자주 묻는 질문
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Q. 입력한 데이터는 어디에 저장되나요?</h3>
                <p className="text-sm">
                  A. 모든 도구는 클라이언트 사이드(브라우저)에서만 작동하며,
                  입력한 데이터는 서버로 전송되거나 저장되지 않습니다.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Q. 모든 도구가 무료인가요?</h3>
                <p className="text-sm">
                  A. 네, Developer Tools의 모든 도구는 완전히 무료이며
                  제한 없이 사용하실 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Q. 회원가입이 필요한가요?</h3>
                <p className="text-sm">
                  A. 아니요, 회원가입 없이 바로 모든 도구를 사용하실 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Q. 모바일에서도 사용할 수 있나요?</h3>
                <p className="text-sm">
                  A. 네, 모든 도구는 반응형으로 제작되어 모바일, 태블릿, 데스크톱
                  모든 기기에서 최적화된 경험을 제공합니다.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Q. 오프라인에서도 사용할 수 있나요?</h3>
                <p className="text-sm">
                  A. 현재는 인터넷 연결이 필요합니다. PWA(Progressive Web App) 지원을
                  통한 오프라인 기능은 향후 추가될 예정입니다.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-lg mb-2">🙏 피드백에 감사드립니다</h3>
            <p className="leading-relaxed">
              여러분의 소중한 의견은 Developer Tools를 더 나은 서비스로 만드는 데
              큰 도움이 됩니다. 작은 의견이라도 주저하지 마시고 보내주세요!
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
