import CSVConverter from '@/components/CSVConverter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSV/JSON 변환기',
  description: 'CSV와 JSON 형식을 상호 변환합니다. 무료 온라인 CSV to JSON, JSON to CSV 변환 도구입니다.',
  keywords: ['CSV', 'JSON', 'CSV to JSON', 'JSON to CSV', 'CSV converter', 'JSON converter', '데이터 변환'],
  openGraph: {
    title: 'CSV/JSON 변환기 - Developer Tools',
    description: 'CSV와 JSON 형식을 상호 변환하는 무료 온라인 도구',
  },
}

export default function CSVPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <CSVConverter />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          CSV/JSON 변환이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed">
              CSV(Comma-Separated Values)는 엑셀 등에서 사용하는 표 형식 데이터이고,
              JSON은 웹 API에서 사용하는 구조화된 데이터 형식입니다.
              두 형식 간 변환은 데이터를 다른 시스템으로 이동하거나, 엑셀 데이터를 웹 애플리케이션에서 사용하거나,
              API 응답을 엑셀로 분석할 때 필요합니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>데이터 임포트:</strong> 엑셀/CSV 파일을 JSON으로 변환하여 웹 애플리케이션에 업로드</li>
              <li><strong>데이터 익스포트:</strong> API 응답(JSON)을 CSV로 변환하여 엑셀에서 분석</li>
              <li><strong>데이터 정제:</strong> CSV 데이터를 JSON으로 변환 후 프로그래밍 방식으로 가공</li>
              <li><strong>데이터베이스 마이그레이션:</strong> CSV 덤프 파일을 JSON으로 변환하여 NoSQL DB에 입력</li>
              <li><strong>테스트 데이터:</strong> CSV로 작성한 테스트 데이터를 JSON으로 변환</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm mb-3 font-semibold">시나리오: 고객 데이터 임포트</p>
              <ol className="text-sm list-decimal list-inside space-y-2">
                <li>마케팅팀이 엑셀로 작성한 고객 리스트를 CSV로 내보내기</li>
                <li>CSV를 JSON으로 변환 (헤더 행이 키가 됨)</li>
                <li>변환된 JSON 데이터를 웹 애플리케이션 API로 전송</li>
                <li>데이터베이스에 일괄 저장</li>
              </ol>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>헤더 필수:</strong> CSV를 JSON으로 변환할 때는 첫 행이 반드시 헤더(컬럼명)여야 합니다.</li>
                <li><strong>인코딩:</strong> 한글이 포함된 CSV는 UTF-8 BOM으로 저장해야 정확히 변환됩니다.</li>
                <li><strong>쉼표/따옴표:</strong> 데이터에 쉼표나 따옴표가 포함되면 이스케이프 처리 필요합니다.</li>
                <li><strong>중첩 구조:</strong> JSON의 중첩 객체/배열은 CSV로 완벽히 표현하기 어렵습니다.</li>
                <li><strong>데이터 타입:</strong> CSV는 모든 값을 문자열로 취급하므로 숫자/불리언 변환 주의</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              CSV vs JSON
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">특징</th>
                    <th className="px-4 py-2 text-left border-b">CSV</th>
                    <th className="px-4 py-2 text-left border-b">JSON</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">구조</td>
                    <td className="px-4 py-2 border-b">2차원 표 (행/열)</td>
                    <td className="px-4 py-2 border-b">계층적 구조 가능</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">가독성</td>
                    <td className="px-4 py-2 border-b">엑셀에서 직관적</td>
                    <td className="px-4 py-2 border-b">프로그래머에게 친숙</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">용도</td>
                    <td className="px-4 py-2">데이터 분석, 엑셀</td>
                    <td className="px-4 py-2">웹 API, 설정 파일</td>
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
                <p className="text-sm text-gray-700 dark:text-gray-300">언어별 CSV/JSON 변환 예제</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
