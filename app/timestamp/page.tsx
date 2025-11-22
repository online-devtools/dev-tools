import TimestampTool from '@/components/TimestampTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '타임스탬프 변환기',
  description: '실시간 타임스탬프를 확인하고 Unix timestamp와 날짜를 상호 변환합니다. 한국 시간대를 지원하는 무료 온라인 타임스탬프 변환 도구입니다.',
  keywords: ['타임스탬프', 'timestamp', 'unix timestamp', '시간 변환', 'timestamp converter', 'epoch converter', 'unix time'],
  openGraph: {
    title: '타임스탬프 변환기 - Developer Tools',
    description: 'Unix timestamp와 날짜를 변환하는 무료 도구',
  },
}

export default function TimestampPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <TimestampTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          타임스탬프(Timestamp)란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              Unix 타임스탬프(Unix Timestamp)는 1970년 1월 1일 00:00:00 UTC부터 경과한 초 수를 나타내는 정수입니다.
              시간대(timezone)와 무관하게 전 세계적으로 동일한 값을 가지므로, 시스템 간 시간 정보 교환에 이상적입니다.
            </p>
            <p className="leading-relaxed">
              예시: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm">1704067200</code>은
              2024년 1월 1일 00:00:00 UTC를 의미합니다.
              데이터베이스, API, 로그 시스템 등에서 널리 사용됩니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>API 응답:</strong> REST API에서 시간 정보를 타임스탬프로 전달</li>
              <li><strong>데이터베이스:</strong> created_at, updated_at 등을 정수형 타임스탬프로 저장</li>
              <li><strong>로그 분석:</strong> 서버 로그의 타임스탬프를 읽기 쉬운 날짜로 변환</li>
              <li><strong>시간 계산:</strong> 두 시점 간 차이를 초 단위로 쉽게 계산</li>
              <li><strong>캐시 만료:</strong> 캐시 유효 기간을 타임스탬프로 관리</li>
              <li><strong>JWT 토큰:</strong> exp(만료), iat(발급 시각) 클레임에 타임스탬프 사용</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 1: API 응답 시간</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`{
  "user": "john",
  "created_at": 1704067200,
  "last_login": 1706745600
}`}
                </code>
                <p className="text-sm mt-2">타임스탬프를 날짜로 변환: 2024-01-01, 2024-02-01</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 2: 시간 차이 계산</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  시작: 1704067200 (2024-01-01 00:00:00)<br />
                  종료: 1704153600 (2024-01-02 00:00:00)<br />
                  차이: 86400초 = 1일
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 3: JWT 토큰 만료 시간</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`{
  "sub": "user123",
  "iat": 1704067200,  // 발급 시각
  "exp": 1704153600   // 만료 시각 (24시간 후)
}`}
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
                <li><strong>2038년 문제:</strong> 32비트 시스템에서 2038년 1월 19일에 오버플로우 발생. 64비트 사용 권장.</li>
                <li><strong>시간대 혼동:</strong> 타임스탬프는 UTC 기준입니다. 로컬 시간으로 표시 시 시간대 변환 필요.</li>
                <li><strong>밀리초 vs 초:</strong> JavaScript는 밀리초(13자리), 대부분 시스템은 초(10자리) 사용. 변환 주의.</li>
                <li><strong>윤초:</strong> 타임스탬프는 윤초를 고려하지 않으므로 정밀한 시간 측정에는 부적합.</li>
                <li><strong>시간대 표시:</strong> 사용자에게 보여줄 때는 반드시 로컬 시간대로 변환하세요.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              타임스탬프 단위
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">단위</th>
                    <th className="px-4 py-2 text-left border-b">자릿수</th>
                    <th className="px-4 py-2 text-left border-b">예시</th>
                    <th className="px-4 py-2 text-left border-b">사용처</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">초(s)</td>
                    <td className="px-4 py-2 border-b">10자리</td>
                    <td className="px-4 py-2 border-b">1704067200</td>
                    <td className="px-4 py-2 border-b">Unix, PHP, Python</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">밀리초(ms)</td>
                    <td className="px-4 py-2 border-b">13자리</td>
                    <td className="px-4 py-2 border-b">1704067200000</td>
                    <td className="px-4 py-2 border-b">JavaScript, Java</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">마이크로초(μs)</td>
                    <td className="px-4 py-2 border-b">16자리</td>
                    <td className="px-4 py-2 border-b">1704067200000000</td>
                    <td className="px-4 py-2 border-b">Go, Rust</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">나노초(ns)</td>
                    <td className="px-4 py-2">19자리</td>
                    <td className="px-4 py-2">1704067200000000000</td>
                    <td className="px-4 py-2">C++, 고성능 시스템</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              유용한 계산
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm mb-3 font-semibold">자주 사용하는 초 단위 변환</p>
              <ul className="text-sm space-y-1">
                <li>• 1분 = 60초</li>
                <li>• 1시간 = 3,600초</li>
                <li>• 1일 = 86,400초</li>
                <li>• 1주 = 604,800초</li>
                <li>• 1개월(30일) ≈ 2,592,000초</li>
                <li>• 1년(365일) ≈ 31,536,000초</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              더 알아보기
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/jwt" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🎫 JWT 디코더</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">JWT 토큰의 타임스탬프 확인</p>
              </a>
              <a href="/snippets" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">💻 코드 스니펫</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">언어별 타임스탬프 변환 예제</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
