import UUIDTool from '@/components/UUIDTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UUID 생성기',
  description: 'UUID(Universally Unique Identifier) v4를 무료로 생성합니다. 대량 생성 지원(최대 100개). 온라인 UUID 생성 도구.',
  keywords: ['UUID', 'UUID 생성기', 'UUID generator', 'GUID', 'unique id', 'random uuid', 'uuid v4'],
  openGraph: {
    title: 'UUID 생성기 - Developer Tools',
    description: 'UUID를 무료로 생성하는 온라인 도구',
  },
}

export default function UUIDPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <UUIDTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          UUID(Universally Unique Identifier)란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              UUID는 범용 고유 식별자로, 중앙 조정 없이 고유성을 보장하는 128비트 값입니다.
              데이터베이스 기본 키, 세션 ID, 파일명 등 전 세계적으로 유일한 식별자가 필요할 때 사용됩니다.
            </p>
            <p className="leading-relaxed">
              UUID는 36자 형식(8-4-4-4-12)으로 표현되며, 예시: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm">550e8400-e29b-41d4-a716-446655440000</code>
              <br />
              충돌 확률이 극히 낮아 (2^122번 생성해야 50% 충돌) 분산 시스템에서 안전하게 사용할 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>데이터베이스 Primary Key:</strong> 순차적 ID 대신 UUID를 기본 키로 사용하여 보안 강화</li>
              <li><strong>분산 시스템:</strong> 여러 서버에서 동시에 ID를 생성해도 충돌 없음</li>
              <li><strong>세션 ID:</strong> 예측 불가능한 세션 식별자로 보안 향상</li>
              <li><strong>파일 업로드:</strong> 중복되지 않는 고유한 파일명 생성</li>
              <li><strong>API 리소스:</strong> RESTful API에서 리소스의 고유 식별자</li>
              <li><strong>메시지 추적:</strong> 로그, 이벤트, 트랜잭션의 고유 ID</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              UUID 버전 비교
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">버전</th>
                    <th className="px-4 py-2 text-left border-b">생성 방식</th>
                    <th className="px-4 py-2 text-left border-b">용도</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">v1</td>
                    <td className="px-4 py-2 border-b">타임스탬프 + MAC 주소</td>
                    <td className="px-4 py-2 border-b">시간 순서 보장 (보안 약함)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">v3</td>
                    <td className="px-4 py-2 border-b">MD5 해시 기반</td>
                    <td className="px-4 py-2 border-b">이름 기반 UUID (레거시)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">v4</td>
                    <td className="px-4 py-2 border-b">랜덤 생성</td>
                    <td className="px-4 py-2 border-b">가장 흔함, 범용적 사용</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">v5</td>
                    <td className="px-4 py-2 border-b">SHA-1 해시 기반</td>
                    <td className="px-4 py-2 border-b">이름 기반 UUID (권장)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">v6, v7</td>
                    <td className="px-4 py-2">타임스탬프 + 랜덤</td>
                    <td className="px-4 py-2">최신 표준, 정렬 가능</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-3 text-gray-600 dark:text-gray-400">
              이 도구는 가장 널리 사용되는 UUID v4(완전 랜덤)를 생성합니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 1: 데이터베이스 스키마</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  CREATE TABLE users (<br />
                  &nbsp;&nbsp;id UUID PRIMARY KEY DEFAULT gen_random_uuid(),<br />
                  &nbsp;&nbsp;name VARCHAR(100),<br />
                  &nbsp;&nbsp;created_at TIMESTAMP<br />
                  );
                </code>
                <p className="text-sm mt-2">순차적 ID보다 보안성 높고 분산 환경에 적합</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 2: 파일 업로드</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  원본 파일명: profile.jpg<br />
                  저장 파일명: 550e8400-e29b-41d4-a716-446655440000.jpg
                </code>
                <p className="text-sm mt-2">파일명 충돌 방지 및 원본 파일명 노출 방지</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 3: REST API 리소스</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  GET /api/users/550e8400-e29b-41d4-a716-446655440000<br />
                  DELETE /api/posts/7c9e6679-7425-40de-944b-e07fc1f90ae7
                </code>
                <p className="text-sm mt-2">예측 불가능한 ID로 보안 강화</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>크기:</strong> UUID는 36바이트(문자열) 또는 16바이트(이진)로 정수형 ID보다 큽니다.</li>
                <li><strong>정렬:</strong> UUID v4는 무작위라 시간순 정렬이 안 됩니다. 정렬이 필요하면 v7을 고려하세요.</li>
                <li><strong>인덱싱:</strong> 랜덤한 UUID는 B-tree 인덱스 성능이 떨어질 수 있습니다. 대용량 DB에서는 주의 필요.</li>
                <li><strong>가독성:</strong> 긴 문자열이라 사람이 읽거나 기억하기 어렵습니다.</li>
                <li><strong>충돌 가능성:</strong> 이론적으로 가능하지만 실질적으로는 0에 가깝습니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              UUID vs 다른 ID 방식
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">방식</th>
                    <th className="px-4 py-2 text-left border-b">장점</th>
                    <th className="px-4 py-2 text-left border-b">단점</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">순차 정수</td>
                    <td className="px-4 py-2 border-b">작고 빠름, 정렬 가능</td>
                    <td className="px-4 py-2 border-b">예측 가능, 분산 환경 불리</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">UUID</td>
                    <td className="px-4 py-2 border-b">고유성 보장, 분산 가능</td>
                    <td className="px-4 py-2 border-b">크기 큼, 가독성 낮음</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">ULID/NanoID</td>
                    <td className="px-4 py-2">짧고 정렬 가능</td>
                    <td className="px-4 py-2">비표준, 라이브러리 필요</td>
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
              <a href="/password" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔑 비밀번호 생성기</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">안전한 랜덤 비밀번호 생성</p>
              </a>
              <a href="/snippets" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">💻 코드 스니펫</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">언어별 UUID 생성 예제</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
