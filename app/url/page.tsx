import URLTool from '@/components/URLTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'URL 인코더/디코더',
  description: 'URL을 안전한 형식으로 인코딩하거나 디코딩합니다. 무료 온라인 URL 인코딩 및 디코딩 도구입니다.',
  keywords: ['URL 인코더', 'URL 디코더', 'URL encoding', 'URL decoding', 'URI encode', 'URI decode', 'percent encoding'],
  openGraph: {
    title: 'URL 인코더/디코더 - Developer Tools',
    description: 'URL을 인코딩하거나 디코딩하는 무료 온라인 도구',
  },
}

export default function URLPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <URLTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          URL 인코딩/디코딩이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              URL(Uniform Resource Locator)은 영문자, 숫자, 일부 특수문자만 사용할 수 있습니다.
              한글, 공백, 특수문자 등을 URL에 포함하려면 퍼센트 인코딩(Percent Encoding)을 사용해야 합니다.
            </p>
            <p className="leading-relaxed">
              URL 인코딩은 안전하지 않은 문자를 %XX 형식의 16진수로 변환합니다.
              예를 들어, 공백은 %20으로, 한글 '안녕'은 %EC%95%88%EB%85%95으로 인코딩됩니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>쿼리 파라미터:</strong> GET 요청의 파라미터 값에 특수문자나 한글이 포함될 때</li>
              <li><strong>검색 URL:</strong> 검색어에 공백, 특수문자, 한글이 포함된 URL 생성 시</li>
              <li><strong>파일명:</strong> 한글 파일명을 URL에 포함할 때</li>
              <li><strong>디버깅:</strong> 인코딩된 URL을 읽기 쉽게 디코딩하여 확인</li>
              <li><strong>API 테스트:</strong> Postman, curl 등에서 URL 파라미터 테스트 시</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 1: 검색 쿼리 인코딩</p>
                <p className="text-xs mb-2">원본:</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto mb-2">
                  https://example.com/search?q=자바스크립트 배열 메서드
                </code>
                <p className="text-xs">인코딩 후:</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto mt-2">
                  https://example.com/search?q=%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%EB%B0%B0%EC%97%B4%20%EB%A9%94%EC%84%9C%EB%93%9C
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 2: 특수문자 인코딩</p>
                <p className="text-xs mb-2">원본: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">key=value&special=a+b=c</code></p>
                <p className="text-xs">인코딩: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">key=value&special=a%2Bb%3Dc</code></p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>이중 인코딩:</strong> 이미 인코딩된 URL을 다시 인코딩하지 않도록 주의하세요.</li>
                <li><strong>전체 URL vs 파라미터:</strong> 전체 URL을 인코딩하면 http://가 깨집니다. 파라미터 값만 인코딩하세요.</li>
                <li><strong>+ vs %20:</strong> 공백은 +로도 표현되지만, %20이 더 표준적입니다. URL 경로에서는 %20만 사용해야 합니다.</li>
                <li><strong>예약 문자:</strong> : / ? # [ ] @ 등은 URL 구조에 사용되므로 컨텍스트에 따라 인코딩 여부를 결정하세요.</li>
                <li><strong>UTF-8 인코딩:</strong> 한글 등 유니코드는 UTF-8로 인코딩한 후 퍼센트 인코딩됩니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              인코딩이 필요한 문자
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">문자</th>
                    <th className="px-4 py-2 text-left border-b">인코딩</th>
                    <th className="px-4 py-2 text-left border-b">설명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b">공백</td>
                    <td className="px-4 py-2 border-b">%20</td>
                    <td className="px-4 py-2 border-b">가장 흔하게 인코딩되는 문자</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">!</td>
                    <td className="px-4 py-2 border-b">%21</td>
                    <td className="px-4 py-2 border-b">느낌표</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">#</td>
                    <td className="px-4 py-2 border-b">%23</td>
                    <td className="px-4 py-2 border-b">해시 (앵커 구분자)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">$</td>
                    <td className="px-4 py-2 border-b">%24</td>
                    <td className="px-4 py-2 border-b">달러 기호</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">&</td>
                    <td className="px-4 py-2 border-b">%26</td>
                    <td className="px-4 py-2 border-b">앰퍼샌드 (파라미터 구분자)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">+</td>
                    <td className="px-4 py-2 border-b">%2B</td>
                    <td className="px-4 py-2 border-b">플러스 (공백으로 해석될 수 있음)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">=</td>
                    <td className="px-4 py-2 border-b">%3D</td>
                    <td className="px-4 py-2 border-b">등호 (키-값 구분자)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">?</td>
                    <td className="px-4 py-2">%3F</td>
                    <td className="px-4 py-2">물음표 (쿼리 시작)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              더 알아보기
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/base64" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔤 Base64 인코더</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Base64 인코딩/디코딩 도구</p>
              </a>
              <a href="/snippets" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">💻 코드 스니펫</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">언어별 URL 인코딩 예제</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
