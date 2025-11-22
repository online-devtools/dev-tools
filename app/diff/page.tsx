import DiffTool from '@/components/DiffTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diff Checker - 텍스트 비교',
  description: '두 텍스트의 차이점을 비교하고 변경사항을 하이라이트합니다. 무료 온라인 텍스트 비교 및 Diff 도구입니다.',
  keywords: ['diff', 'diff checker', '텍스트 비교', 'text compare', 'text difference', 'compare text', 'text diff'],
  openGraph: {
    title: 'Diff Checker - Developer Tools',
    description: '두 텍스트를 비교하는 무료 온라인 도구',
  },
}

export default function DiffPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <DiffTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Diff(차이점 비교)란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              Diff(Difference)는 두 텍스트나 파일 간의 차이점을 비교하여 추가, 삭제, 변경된 부분을 시각적으로 보여주는 도구입니다.
              코드 리뷰, 문서 비교, 설정 파일 검증 등에서 변경사항을 빠르게 파악할 수 있습니다.
            </p>
            <p className="leading-relaxed">
              Git, SVN 등 버전 관리 시스템에서도 diff 알고리즘을 사용하여 커밋 간 변경사항을 추적합니다.
              개발자는 diff를 통해 코드 변경의 영향 범위를 정확히 파악하고 실수를 방지할 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>코드 리뷰:</strong> Pull Request의 변경사항 검토</li>
              <li><strong>설정 비교:</strong> 개발/운영 환경의 설정 파일 차이 확인</li>
              <li><strong>문서 버전 관리:</strong> 문서 수정 전후 비교</li>
              <li><strong>API 응답 비교:</strong> 예상 응답과 실제 응답 차이 분석</li>
              <li><strong>마이그레이션 검증:</strong> 데이터 이동 전후 비교</li>
              <li><strong>충돌 해결:</strong> Git 머지 충돌 시 양쪽 변경사항 확인</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 1: 설정 파일 비교</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="mb-2 font-semibold">개발 환경 (config.dev.json)</p>
                    <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                      {`{
  "database": "dev_db",
  "port": 3000,
  "debug": true
}`}
                    </code>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold">운영 환경 (config.prod.json)</p>
                    <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                      {`{
  "database": "prod_db",
  "port": 8080,
  "debug": false
}`}
                    </code>
                  </div>
                </div>
                <p className="text-sm mt-2">차이: database, port, debug 값이 모두 다름</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 2: 코드 변경사항</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  <span className="text-red-600">- function calculateTotal(items) {'{'}</span><br />
                  <span className="text-green-600">+ function calculateTotal(items, discount = 0) {'{'}</span><br />
                  &nbsp;&nbsp;let total = items.reduce((sum, item) =&gt; sum + item.price, 0)<br />
                  <span className="text-green-600">+  total = total * (1 - discount)</span><br />
                  &nbsp;&nbsp;return total<br />
                  {'}'}
                </code>
                <p className="text-sm mt-2">함수 시그니처와 할인 로직 추가</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Diff 표현 방식
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">표시</th>
                    <th className="px-4 py-2 text-left border-b">의미</th>
                    <th className="px-4 py-2 text-left border-b">설명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b"><span className="text-green-600">+ 줄</span></td>
                    <td className="px-4 py-2 border-b">추가됨 (Added)</td>
                    <td className="px-4 py-2 border-b">새로운 내용이 추가됨</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><span className="text-red-600">- 줄</span></td>
                    <td className="px-4 py-2 border-b">삭제됨 (Deleted)</td>
                    <td className="px-4 py-2 border-b">기존 내용이 삭제됨</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><span className="text-blue-600">~ 줄</span></td>
                    <td className="px-4 py-2 border-b">변경됨 (Modified)</td>
                    <td className="px-4 py-2 border-b">내용이 수정됨</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">&nbsp; 줄</td>
                    <td className="px-4 py-2">동일 (Unchanged)</td>
                    <td className="px-4 py-2">변경 없음 (컨텍스트)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>공백/들여쓰기:</strong> 공백 차이만 있어도 변경으로 표시됩니다. 포맷터를 먼저 적용하세요.</li>
                <li><strong>줄바꿈 문자:</strong> Windows(CRLF)와 Unix(LF) 줄바꿈 차이에 주의하세요.</li>
                <li><strong>대량 변경:</strong> 파일 전체가 변경된 경우 diff가 의미 없을 수 있습니다.</li>
                <li><strong>바이너리 파일:</strong> 이미지, PDF 등 바이너리 파일은 diff로 비교할 수 없습니다.</li>
                <li><strong>인코딩:</strong> 파일 인코딩이 다르면 같은 내용도 다르게 보일 수 있습니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Diff 알고리즘
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm mb-3">대표적인 diff 알고리즘:</p>
              <ul className="text-sm space-y-2">
                <li>• <strong>Myers Diff:</strong> 가장 널리 사용되는 알고리즘. Git에서 사용.</li>
                <li>• <strong>Patience Diff:</strong> 코드의 구조적 변경을 더 잘 감지.</li>
                <li>• <strong>Histogram Diff:</strong> Patience의 개선 버전. 성능 향상.</li>
                <li>• <strong>Word Diff:</strong> 줄 단위가 아닌 단어 단위 비교.</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              더 알아보기
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/json" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">📋 JSON 포맷터</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">JSON 포맷 후 비교하기</p>
              </a>
              <a href="/html" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">🌐 HTML 포맷터</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">HTML 포맷 후 비교하기</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
