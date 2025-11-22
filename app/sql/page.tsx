import SQLFormatter from '@/components/SQLFormatter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SQL 포맷터',
  description: 'SQL 쿼리를 포맷하고 최적화합니다. 무료 온라인 SQL 포맷터 및 정리 도구입니다.',
  keywords: ['SQL', 'SQL 포맷터', 'SQL formatter', 'SQL beautifier', 'SQL 정리', 'query formatter', 'SQL minify'],
  openGraph: {
    title: 'SQL 포맷터 - Developer Tools',
    description: 'SQL 쿼리를 포맷하고 최적화하는 무료 온라인 도구',
  },
}

export default function SQLPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SQLFormatter />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          SQL 포맷팅이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              SQL(Structured Query Language)은 데이터베이스를 조작하는 언어입니다.
              복잡한 SQL 쿼리는 한 줄로 작성되거나 들여쓰기가 엉망인 경우가 많아 가독성이 떨어집니다.
              SQL 포맷터는 쿼리를 읽기 쉽게 정렬하고 들여쓰기를 일관되게 적용합니다.
            </p>
            <p className="leading-relaxed">
              정리된 SQL은 디버깅이 쉽고, 쿼리 최적화 지점을 찾기 용이하며,
              팀원 간 코드 리뷰 시 의사소통을 원활하게 합니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>쿼리 디버깅:</strong> 에러 발생 시 쿼리 구조를 명확히 파악</li>
              <li><strong>로그 분석:</strong> 애플리케이션 로그에서 추출한 SQL 정리</li>
              <li><strong>코드 리뷰:</strong> 일관된 포맷으로 쿼리 검토</li>
              <li><strong>문서화:</strong> 프로젝트 문서에 포함할 SQL 예제 정리</li>
              <li><strong>성능 최적화:</strong> 쿼리 실행 계획 분석 전 포맷팅</li>
              <li><strong>학습:</strong> 복잡한 예제 쿼리를 이해하기 쉽게 변환</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">압축된 SQL → 포맷팅</p>
                <p className="text-xs mb-2">원본:</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto mb-2">
                  SELECT u.id,u.name,COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.active=1 GROUP BY u.id HAVING COUNT(o.id)&gt;5 ORDER BY order_count DESC
                </code>
                <p className="text-xs">포맷팅 후:</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto mt-2">
                  {`SELECT
  u.id,
  u.name,
  COUNT(o.id) AS order_count
FROM
  users u
  LEFT JOIN orders o ON u.id = o.user_id
WHERE
  u.active = 1
GROUP BY
  u.id
HAVING
  COUNT(o.id) > 5
ORDER BY
  order_count DESC`}
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">복잡한 서브쿼리</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`SELECT
  p.product_name,
  p.price,
  (
    SELECT
      AVG(price)
    FROM
      products
    WHERE
      category_id = p.category_id
  ) AS category_avg
FROM
  products p
WHERE
  p.price > (
    SELECT
      AVG(price)
    FROM
      products
  )`}
                </code>
                <p className="text-sm mt-2">서브쿼리 구조가 명확하게 보임</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              SQL 스타일 가이드
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm mb-3 font-semibold">일반적인 SQL 포맷팅 규칙:</p>
              <ul className="text-sm space-y-2">
                <li>✅ <strong>키워드 대문자:</strong> SELECT, FROM, WHERE 등 SQL 키워드는 대문자</li>
                <li>✅ <strong>한 줄에 하나:</strong> SELECT 절의 각 컬럼을 별도 줄에 작성</li>
                <li>✅ <strong>들여쓰기:</strong> 중첩된 구문은 2칸 또는 4칸 들여쓰기</li>
                <li>✅ <strong>JOIN 명시:</strong> INNER JOIN, LEFT JOIN 등 명시적으로 작성</li>
                <li>✅ <strong>AS 사용:</strong> 별칭은 AS 키워드로 명확히 표시</li>
                <li>✅ <strong>서브쿼리 정렬:</strong> 서브쿼리도 동일한 규칙 적용</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>문법 오류:</strong> 포맷터는 문법 검증을 하지 않습니다. 실행 전 반드시 테스트하세요.</li>
                <li><strong>데이터베이스 방언:</strong> MySQL, PostgreSQL, Oracle 등 DB마다 문법이 약간 다를 수 있습니다.</li>
                <li><strong>주석 보존:</strong> 포맷팅 시 주석이 유지되는지 확인하세요.</li>
                <li><strong>문자열 리터럴:</strong> 쿼리 내 문자열은 그대로 유지되어야 합니다.</li>
                <li><strong>성능:</strong> 포맷팅은 실행 성능에 영향을 주지 않지만, 가독성 향상으로 최적화를 돕습니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              SQL vs NoSQL
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">특징</th>
                    <th className="px-4 py-2 text-left border-b">SQL (관계형)</th>
                    <th className="px-4 py-2 text-left border-b">NoSQL (비관계형)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">데이터 구조</td>
                    <td className="px-4 py-2 border-b">테이블, 행, 열</td>
                    <td className="px-4 py-2 border-b">문서, 키-값, 그래프</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">스키마</td>
                    <td className="px-4 py-2 border-b">고정 스키마</td>
                    <td className="px-4 py-2 border-b">유연한 스키마</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">확장성</td>
                    <td className="px-4 py-2 border-b">수직 확장</td>
                    <td className="px-4 py-2 border-b">수평 확장</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">용도</td>
                    <td className="px-4 py-2">복잡한 쿼리, 트랜잭션</td>
                    <td className="px-4 py-2">빠른 읽기/쓰기, 대용량</td>
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
              <a href="/json" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">📋 JSON 포맷터</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">NoSQL 데이터 포맷팅</p>
              </a>
              <a href="/snippets" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">💻 코드 스니펫</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">SQL 쿼리 예제</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
