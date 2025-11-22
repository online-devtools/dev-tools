import JSONTool from '@/components/JSONTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON 포맷터/검증기',
  description: 'JSON을 예쁘게 포맷하고, 압축하고, 유효성을 검증합니다. 무료 온라인 JSON 포맷터 및 검증 도구입니다.',
  keywords: ['JSON', 'JSON 포맷터', 'JSON formatter', 'JSON 검증', 'JSON validator', 'JSON minify', 'JSON 압축'],
  openGraph: {
    title: 'JSON 포맷터/검증기 - Developer Tools',
    description: 'JSON을 포맷하고 검증하는 무료 온라인 도구',
  },
}

export default function JSONPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <JSONTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          JSON이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed">
              JSON(JavaScript Object Notation)은 데이터를 저장하고 교환하기 위한 경량 텍스트 형식입니다.
              웹 API, 설정 파일, 데이터베이스 등에서 가장 널리 사용되는 데이터 형식으로,
              사람이 읽고 쓰기 쉬우면서 기계가 파싱하고 생성하기도 쉽습니다.
              거의 모든 프로그래밍 언어가 JSON을 지원하여 서로 다른 시스템 간 데이터 교환에 적합합니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>API 응답 확인:</strong> REST API에서 받은 JSON 응답 데이터를 포맷하여 가독성 높게 확인</li>
              <li><strong>JSON 유효성 검증:</strong> 잘못된 JSON 형식을 찾아 수정</li>
              <li><strong>압축/최소화:</strong> JSON 파일 크기를 줄여 네트워크 전송 최적화</li>
              <li><strong>설정 파일 편집:</strong> package.json, tsconfig.json 등 설정 파일 포맷팅</li>
              <li><strong>데이터 변환:</strong> CSV, XML 등 다른 형식에서 JSON으로 변환 후 검증</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 1: API 응답 디버깅</p>
                <p className="text-xs mb-2">압축된 JSON을 포맷하여 구조 파악</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto mb-2">
                  {"{"}"user":{"{"}"id":1,"name":"John","email":"john@example.com"{"}"},"status":"success"{"}"}
                </code>
                <p className="text-xs">↓ 포맷 후</p>
                <pre className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded overflow-x-auto mt-2">
{`{
  "user": {
    "id": 1,
    "name": "John",
    "email": "john@example.com"
  },
  "status": "success"
}`}
                </pre>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 2: 오류 찾기</p>
                <p className="text-xs">잘못된 JSON을 검증하여 오류 위치 확인 (trailing comma, 따옴표 오류 등)</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Trailing Comma:</strong> JSON은 마지막 요소 뒤에 쉼표를 허용하지 않습니다.</li>
                <li><strong>따옴표:</strong> 반드시 큰따옴표(")를 사용해야 하며, 작은따옴표(')는 사용할 수 없습니다.</li>
                <li><strong>키 이름:</strong> 모든 키는 반드시 따옴표로 감싸야 합니다.</li>
                <li><strong>데이터 타입:</strong> undefined, 함수, Date 객체 등은 JSON에서 지원되지 않습니다.</li>
                <li><strong>순환 참조:</strong> 객체가 자기 자신을 참조하면 JSON으로 변환할 수 없습니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              JSON vs 다른 데이터 형식
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">형식</th>
                    <th className="px-4 py-2 text-left border-b">장점</th>
                    <th className="px-4 py-2 text-left border-b">단점</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">JSON</td>
                    <td className="px-4 py-2 border-b">간결, 빠름, 언어 독립적</td>
                    <td className="px-4 py-2 border-b">주석 불가, 제한된 데이터 타입</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">XML</td>
                    <td className="px-4 py-2 border-b">메타데이터, 스키마 검증</td>
                    <td className="px-4 py-2 border-b">장황함, 파싱 느림</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">YAML</td>
                    <td className="px-4 py-2">가독성 좋음, 주석 가능</td>
                    <td className="px-4 py-2">들여쓰기 민감, 파싱 복잡</td>
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
              <a href="/csv" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">📊 CSV 변환기</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">CSV와 JSON 형식 상호 변환</p>
              </a>
              <a href="/jwt" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">🎫 JWT 디코더</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">JWT 토큰의 JSON 페이로드 확인</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
