import RegexTool from '@/components/RegexTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '정규식 테스터',
  description: '정규식 패턴을 테스트하고 매칭 결과를 실시간으로 확인할 수 있는 무료 온라인 Regex 테스터입니다. 자주 사용하는 패턴 제공.',
  keywords: ['정규식', 'regex', 'regular expression', '정규표현식', 'regex tester', '정규식 테스터', '패턴 매칭'],
  openGraph: {
    title: '정규식 테스터 - Developer Tools',
    description: '정규식 패턴을 테스트하는 무료 온라인 도구',
  },
}

export default function RegexPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <RegexTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          정규식(Regular Expression)이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed">
              정규식은 문자열에서 특정 패턴을 찾거나 검증하기 위한 강력한 도구입니다.
              이메일 주소, 전화번호, URL 등의 형식을 검증하거나, 로그 파일에서 특정 패턴을 추출하거나,
              텍스트를 치환할 때 사용됩니다. 프로그래밍 언어 대부분이 정규식을 지원하며,
              한 번 작성한 패턴을 여러 언어에서 유사하게 사용할 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>입력 검증:</strong> 이메일, 전화번호, 비밀번호 형식이 올바른지 확인</li>
              <li><strong>데이터 추출:</strong> 로그 파일이나 텍스트에서 IP 주소, 날짜 등 추출</li>
              <li><strong>텍스트 치환:</strong> 특정 패턴을 찾아 다른 문자열로 교체</li>
              <li><strong>파싱:</strong> HTML, XML 등에서 태그나 속성 값 추출</li>
              <li><strong>URL 라우팅:</strong> 웹 프레임워크에서 URL 패턴 매칭</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              자주 사용하는 패턴 예시
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <p className="text-sm font-semibold mb-1">이메일 주소</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$</code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <p className="text-sm font-semibold mb-1">한국 전화번호</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">^01[0-9]-\d{3,4}-\d{4}$</code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <p className="text-sm font-semibold mb-1">URL</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$</code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <p className="text-sm font-semibold mb-1">IPv4 주소</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$</code>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>ReDoS 공격:</strong> 복잡한 정규식은 특정 입력에서 극도로 느려질 수 있습니다. 입력 길이 제한을 두세요.</li>
                <li><strong>이스케이프:</strong> 특수문자(., *, +, ?, [, ], {, }, (, ), ^, $, |, \)는 \ 로 이스케이프해야 합니다.</li>
                <li><strong>그리디 vs 비그리디:</strong> .*는 최대한 많이 매칭하고, .*?는 최소한만 매칭합니다.</li>
                <li><strong>언어별 차이:</strong> JavaScript, Python, Java 등 언어마다 정규식 문법이 약간씩 다를 수 있습니다.</li>
                <li><strong>HTML 파싱:</strong> 복잡한 HTML은 정규식보다 DOM 파서를 사용하는 것이 좋습니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              정규식 플래그
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">플래그</th>
                    <th className="px-4 py-2 text-left border-b">설명</th>
                    <th className="px-4 py-2 text-left border-b">예시</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b"><code>g</code></td>
                    <td className="px-4 py-2 border-b">전역 검색 (모든 매칭 찾기)</td>
                    <td className="px-4 py-2 border-b">/abc/g</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><code>i</code></td>
                    <td className="px-4 py-2 border-b">대소문자 구분 안 함</td>
                    <td className="px-4 py-2 border-b">/abc/i</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><code>m</code></td>
                    <td className="px-4 py-2 border-b">여러 줄 모드</td>
                    <td className="px-4 py-2 border-b">/^abc/m</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2"><code>s</code></td>
                    <td className="px-4 py-2">. 이 줄바꿈 포함</td>
                    <td className="px-4 py-2">/a.b/s</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              더 알아보기
            </h3>
            <div className="grid gap-4">
              <a href="/snippets" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">💻 코드 스니펫</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">언어별 정규식 사용 예제</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
