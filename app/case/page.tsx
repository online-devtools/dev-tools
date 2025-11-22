import CaseTool from '@/components/CaseTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '케이스 변환기',
  description: '문자열을 camelCase, PascalCase, snake_case, kebab-case 등 다양한 케이스 스타일로 변환합니다. 무료 온라인 문자열 케이스 변환 도구입니다.',
  keywords: ['케이스 변환', 'case converter', 'camelCase', 'PascalCase', 'snake_case', 'kebab-case', 'string case', 'text case'],
  openGraph: {
    title: '케이스 변환기 - Developer Tools',
    description: '문자열을 다양한 케이스로 변환하는 무료 도구',
  },
}

export default function CasePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <CaseTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          케이스 변환(Case Conversion)이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              프로그래밍 언어와 프레임워크마다 변수명, 함수명, 파일명에 사용하는 명명 규칙(Naming Convention)이 다릅니다.
              케이스 변환은 문자열을 다양한 케이스 스타일로 빠르게 변환하여 코드 일관성을 유지하고
              언어 간 데이터 교환 시 형식을 맞추는 데 유용합니다.
            </p>
            <p className="leading-relaxed">
              예시: "user name"을 JavaScript에서는 <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm">userName</code> (camelCase),
              Python에서는 <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm">user_name</code> (snake_case)로 사용합니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>변수명 통일:</strong> 프로젝트의 코딩 컨벤션에 맞게 변수명 변환</li>
              <li><strong>API 필드 매핑:</strong> JSON 키를 다른 언어 형식으로 변환 (camelCase ↔ snake_case)</li>
              <li><strong>데이터베이스 컬럼:</strong> 테이블 컬럼명을 코드 변수로 변환</li>
              <li><strong>파일명 생성:</strong> URL 슬러그, 파일명을 kebab-case로 변환</li>
              <li><strong>코드 리팩토링:</strong> 대량의 변수명을 한 번에 변환</li>
              <li><strong>마이그레이션:</strong> 레거시 코드의 명명 규칙을 현대적으로 변경</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              케이스 스타일 비교
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">케이스</th>
                    <th className="px-4 py-2 text-left border-b">예시</th>
                    <th className="px-4 py-2 text-left border-b">사용처</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">camelCase</td>
                    <td className="px-4 py-2 border-b">userName</td>
                    <td className="px-4 py-2 border-b">JavaScript, Java 변수/함수</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">PascalCase</td>
                    <td className="px-4 py-2 border-b">UserName</td>
                    <td className="px-4 py-2 border-b">C#, Java 클래스/컴포넌트</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">snake_case</td>
                    <td className="px-4 py-2 border-b">user_name</td>
                    <td className="px-4 py-2 border-b">Python, Ruby, DB 컬럼</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">UPPER_SNAKE</td>
                    <td className="px-4 py-2 border-b">USER_NAME</td>
                    <td className="px-4 py-2 border-b">상수, 환경변수</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">kebab-case</td>
                    <td className="px-4 py-2 border-b">user-name</td>
                    <td className="px-4 py-2 border-b">URL, CSS 클래스, 파일명</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">UPPER-KEBAB</td>
                    <td className="px-4 py-2 border-b">USER-NAME</td>
                    <td className="px-4 py-2 border-b">HTTP 헤더</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Train-Case</td>
                    <td className="px-4 py-2">User-Name</td>
                    <td className="px-4 py-2">타이틀, HTTP 헤더</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 1: API 응답 필드 변환</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`// Python API (snake_case)
{"user_name": "john", "created_at": "2024-01-01"}

// JavaScript (camelCase)로 변환
{userName: "john", createdAt: "2024-01-01"}`}
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 2: 환경변수 명명</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`# 환경변수는 UPPER_SNAKE_CASE 사용
DATABASE_URL=postgresql://localhost/mydb
API_SECRET_KEY=abc123
MAX_RETRY_COUNT=3`}
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 3: URL 슬러그 생성</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`원본 제목: "How to Use React Hooks"
kebab-case URL: https://blog.com/how-to-use-react-hooks`}
                </code>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>약어 처리:</strong> "HTML"을 PascalCase로 변환 시 "Html"과 "HTML" 중 프로젝트 컨벤션을 따르세요.</li>
                <li><strong>숫자 포함:</strong> "user2name"은 "user2Name" (camelCase) 또는 "user_2_name" (snake_case)로 변환됩니다.</li>
                <li><strong>특수문자:</strong> 일부 케이스는 특수문자를 허용하지 않습니다 (변수명에 하이픈 불가).</li>
                <li><strong>예약어:</strong> 변환 후 언어의 예약어와 충돌하지 않는지 확인하세요.</li>
                <li><strong>일관성:</strong> 프로젝트 전체에서 하나의 케이스 스타일을 일관되게 사용하세요.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언어별 권장 케이스
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">언어/프레임워크</th>
                    <th className="px-4 py-2 text-left border-b">변수/함수</th>
                    <th className="px-4 py-2 text-left border-b">클래스/타입</th>
                    <th className="px-4 py-2 text-left border-b">상수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">JavaScript</td>
                    <td className="px-4 py-2 border-b">camelCase</td>
                    <td className="px-4 py-2 border-b">PascalCase</td>
                    <td className="px-4 py-2 border-b">UPPER_SNAKE</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">Python</td>
                    <td className="px-4 py-2 border-b">snake_case</td>
                    <td className="px-4 py-2 border-b">PascalCase</td>
                    <td className="px-4 py-2 border-b">UPPER_SNAKE</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">Java</td>
                    <td className="px-4 py-2 border-b">camelCase</td>
                    <td className="px-4 py-2 border-b">PascalCase</td>
                    <td className="px-4 py-2 border-b">UPPER_SNAKE</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">Go</td>
                    <td className="px-4 py-2 border-b">camelCase</td>
                    <td className="px-4 py-2 border-b">PascalCase</td>
                    <td className="px-4 py-2 border-b">PascalCase</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">CSS/HTML</td>
                    <td className="px-4 py-2">kebab-case</td>
                    <td className="px-4 py-2">kebab-case</td>
                    <td className="px-4 py-2">-</td>
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
              <a href="/url" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔗 URL 인코더</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">URL 슬러그 생성</p>
              </a>
              <a href="/snippets" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">💻 코드 스니펫</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">언어별 케이스 변환 예제</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
