import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '자주 묻는 질문',
  description: 'Developer Tools에 대한 자주 묻는 질문과 답변입니다. 사용 방법, 데이터 보안, 기능 등에 대한 정보를 확인하세요.',
  openGraph: {
    title: '자주 묻는 질문 - Developer Tools',
    description: 'Developer Tools 사용에 대한 FAQ',
  },
}

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          자주 묻는 질문 (FAQ)
        </h1>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Developer Tools 사용과 관련된 자주 묻는 질문과 답변입니다.
          </p>

          {/* 일반 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              일반
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. Developer Tools는 무엇인가요?</h3>
                <p className="text-sm leading-relaxed">
                  A. Developer Tools는 개발자들이 자주 사용하는 유틸리티 도구 23개를 한 곳에서 제공하는 무료 웹 서비스입니다.
                  Base64 인코딩, JWT 디버깅, JSON 포맷팅, 정규식 테스트 등 다양한 도구를 설치 없이 브라우저에서 바로 사용할 수 있습니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 모든 기능이 무료인가요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 네, Developer Tools의 모든 도구는 완전히 무료이며 제한 없이 사용하실 수 있습니다.
                  숨겨진 비용, 프리미엄 플랜, 사용 제한 등이 전혀 없습니다. 앞으로도 영구적으로 무료로 제공될 예정입니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 회원가입이 필요한가요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 아니요, 회원가입 없이 바로 모든 도구를 사용하실 수 있습니다.
                  복잡한 가입 절차나 로그인 과정 없이 사이트에 접속하시면 즉시 사용 가능합니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 어떤 도구들이 있나요?</h3>
                <p className="text-sm leading-relaxed mb-2">
                  A. 현재 23개 이상의 도구를 제공하고 있으며, 주요 카테고리는 다음과 같습니다:
                </p>
                <ul className="text-sm list-disc list-inside space-y-1 ml-4">
                  <li><strong>인코딩/디코딩:</strong> Base64, URL 인코더</li>
                  <li><strong>보안/암호화:</strong> Jasypt, Hash 생성기, JWT 디코더/서명기</li>
                  <li><strong>데이터 포맷:</strong> JSON, SQL, CSV/JSON, MyBatis, HTML/XML 포맷터</li>
                  <li><strong>생성기:</strong> UUID, QR 코드, Lorem Ipsum, 비밀번호 생성기</li>
                  <li><strong>변환기:</strong> 타임스탬프, 컬러, 케이스, 진법 변환기</li>
                  <li><strong>도구:</strong> 정규식 테스터, Cron 파서, Diff Checker</li>
                  <li><strong>시스템:</strong> chmod 계산기, IP 계산기</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 데이터 보안 & 프라이버시 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              데이터 보안 & 프라이버시
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 입력한 데이터는 어디에 저장되나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 입력하신 데이터는 <strong>절대 서버로 전송되거나 저장되지 않습니다</strong>.
                  모든 도구는 클라이언트 사이드(사용자의 브라우저)에서만 작동하며,
                  모든 처리는 사용자의 컴퓨터에서 이루어집니다. 따라서 민감한 데이터도 안전하게 사용하실 수 있습니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 개인정보를 수집하나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 아니요, Developer Tools는 사용자의 개인정보를 수집하지 않습니다.
                  이름, 이메일, 전화번호 등의 개인 식별 정보나 도구에 입력된 데이터를 수집하거나 저장하지 않습니다.
                  다만, Google Analytics를 통한 익명 사용 통계와 Google AdSense 광고 쿠키는 사용될 수 있습니다.
                  자세한 내용은 <a href="/privacy" className="text-blue-500 hover:text-blue-600">개인정보 처리방침</a>을 참고해 주세요.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 비밀번호나 API 키를 입력해도 안전한가요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 기술적으로는 안전합니다. 모든 데이터는 브라우저에서만 처리되고 서버로 전송되지 않습니다.
                  하지만 보안을 위해 실제 운영 환경에서 사용 중인 비밀번호나 API 키 대신
                  테스트 데이터나 더미 값을 사용하는 것을 권장합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 사용 방법 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              사용 방법
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 모바일에서도 사용할 수 있나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 네, 모든 도구는 반응형으로 제작되어 모바일, 태블릿, 데스크톱 모든 기기에서
                  최적화된 경험을 제공합니다. 스마트폰 브라우저에서도 편리하게 사용하실 수 있습니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 오프라인에서도 사용할 수 있나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 현재는 인터넷 연결이 필요합니다. 하지만 페이지를 한 번 로드하신 후에는
                  일부 도구를 오프라인에서도 사용하실 수 있습니다(브라우저 캐시 이용).
                  향후 PWA(Progressive Web App) 지원을 통한 완전한 오프라인 기능 추가를 계획하고 있습니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 어떤 브라우저에서 사용할 수 있나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. Chrome, Firefox, Safari, Edge 등 모든 최신 웹 브라우저에서 사용하실 수 있습니다.
                  최상의 경험을 위해 브라우저를 최신 버전으로 업데이트하시는 것을 권장합니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 다크 모드를 사용할 수 있나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 네, 사용자의 시스템 설정에 따라 자동으로 다크 모드가 적용됩니다.
                  macOS/Windows/iOS/Android의 다크 모드 설정을 활성화하시면
                  Developer Tools도 자동으로 다크 모드로 전환됩니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 도구 사용법을 어디서 배울 수 있나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 각 도구 페이지의 설명과 예제 섹션을 참고하세요. 주요 사용법과 주의사항을 함께 정리해 두었습니다.
                  또한 <a href="/snippets" className="text-blue-500 hover:text-blue-600">코드 스니펫 페이지</a>에서
                  다양한 프로그래밍 언어별 예제 코드도 제공하고 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 기술 지원 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              기술 지원
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 버그를 발견했어요. 어디에 제보하나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. <a href="/contact" className="text-blue-500 hover:text-blue-600">문의 페이지</a>를 통해
                  버그 리포트를 보내주세요. 발생한 오류의 스크린샷, 사용 중인 브라우저 정보,
                  재현 방법 등을 함께 보내주시면 빠르게 해결하는 데 도움이 됩니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 새로운 도구를 제안하고 싶어요.</h3>
                <p className="text-sm leading-relaxed">
                  A. 훌륭합니다! <a href="/contact" className="text-blue-500 hover:text-blue-600">문의 페이지</a>를 통해
                  새로운 도구 아이디어를 제안해 주세요. 개발자 커뮤니티에 유용한 도구라면
                  적극적으로 검토하여 추가하도록 하겠습니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 도구가 제대로 작동하지 않아요.</h3>
                <p className="text-sm leading-relaxed mb-2">
                  A. 다음 단계를 시도해 보세요:
                </p>
                <ol className="text-sm list-decimal list-inside space-y-1 ml-4">
                  <li>브라우저를 새로고침(Ctrl+F5 또는 Cmd+Shift+R)해 보세요</li>
                  <li>브라우저 캐시를 삭제하고 다시 시도해 보세요</li>
                  <li>다른 브라우저에서 시도해 보세요</li>
                  <li>브라우저를 최신 버전으로 업데이트해 보세요</li>
                  <li>그래도 해결되지 않으면 <a href="/contact" className="text-blue-500 hover:text-blue-600">문의 페이지</a>로 연락주세요</li>
                </ol>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 업데이트 이력을 확인할 수 있나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 네, <a href="/changelog" className="text-blue-500 hover:text-blue-600">변경 로그 페이지</a>에서
                  모든 업데이트 이력을 확인하실 수 있습니다. 새로운 기능 추가, 버그 수정, 개선 사항 등이
                  날짜별로 기록되어 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 기타 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              기타
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 다국어를 지원하나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 네, 현재 한국어와 영어를 지원하고 있습니다. 사이트 상단의 언어 전환 버튼을 통해
                  원하시는 언어로 전환하실 수 있습니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. 광고가 표시되나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 네, 서비스 운영을 위해 Google AdSense 광고가 표시될 수 있습니다.
                  광고는 방해가 되지 않도록 최소화하여 배치되며, 모든 도구는 광고 여부와 관계없이
                  정상적으로 작동합니다.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Q. API를 제공하나요?</h3>
                <p className="text-sm leading-relaxed">
                  A. 현재는 API를 제공하지 않습니다. 모든 도구는 웹 인터페이스를 통해서만 사용 가능합니다.
                  하지만 <a href="/snippets" className="text-blue-500 hover:text-blue-600">코드 스니펫 페이지</a>에서
                  각 기능을 구현하는 예제 코드를 제공하고 있어, 직접 프로젝트에 통합하실 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
            <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">더 궁금한 점이 있으신가요?</h3>
              <p className="leading-relaxed mb-3">
                위 질문에서 원하는 답변을 찾지 못하셨다면
                <a href="/contact" className="text-blue-500 hover:text-blue-600 ml-1">문의 페이지</a>를
                통해 직접 질문해 주세요.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                이메일: wxyz0904@naver.com (영업일 기준 1-2일 내 답변)
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
