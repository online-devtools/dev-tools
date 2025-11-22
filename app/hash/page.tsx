import HashTool from '@/components/HashTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '해시 생성기',
  description: 'MD5, SHA-1, SHA-256, SHA-512 해시를 무료로 생성합니다. 텍스트를 암호화 해시로 변환하는 온라인 해시 생성 도구입니다.',
  keywords: ['해시 생성기', 'hash generator', 'MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'hash calculator', '암호화 해시'],
  openGraph: {
    title: '해시 생성기 - Developer Tools',
    description: 'MD5, SHA 해시를 생성하는 무료 온라인 도구',
  },
}

export default function HashPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <HashTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          암호화 해시란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed">
              해시 함수는 임의의 길이 데이터를 고정 길이의 해시 값으로 변환합니다.
              같은 입력은 항상 같은 해시 값을 생성하지만, 해시 값에서 원본 데이터를 복원할 수 없는 일방향 함수입니다.
              비밀번호 저장, 파일 무결성 검증, 데이터 중복 확인 등에 사용됩니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              해시 알고리즘 비교
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">알고리즘</th>
                    <th className="px-4 py-2 text-left border-b">길이</th>
                    <th className="px-4 py-2 text-left border-b">보안성</th>
                    <th className="px-4 py-2 text-left border-b">용도</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">MD5</td>
                    <td className="px-4 py-2 border-b">128bit</td>
                    <td className="px-4 py-2 border-b text-red-600">낮음</td>
                    <td className="px-4 py-2 border-b">체크섬 (보안용 비추천)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">SHA-1</td>
                    <td className="px-4 py-2 border-b">160bit</td>
                    <td className="px-4 py-2 border-b text-orange-600">중간</td>
                    <td className="px-4 py-2 border-b">Git 커밋 (보안용 비추천)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">SHA-256</td>
                    <td className="px-4 py-2 border-b">256bit</td>
                    <td className="px-4 py-2 border-b text-green-600">높음</td>
                    <td className="px-4 py-2 border-b">블록체인, 인증서</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">SHA-512</td>
                    <td className="px-4 py-2">512bit</td>
                    <td className="px-4 py-2 text-green-600">매우 높음</td>
                    <td className="px-4 py-2">고보안 데이터</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>파일 무결성:</strong> 다운로드한 파일이 변조되지 않았는지 해시값으로 확인</li>
              <li><strong>비밀번호 저장:</strong> 비밀번호를 해시로 변환하여 데이터베이스에 저장 (단, bcrypt, argon2 권장)</li>
              <li><strong>데이터 중복 제거:</strong> 같은 내용의 파일/데이터를 해시로 빠르게 찾기</li>
              <li><strong>디지털 서명:</strong> 문서의 해시값에 서명하여 무결성 보장</li>
              <li><strong>캐시 키:</strong> 데이터의 해시값을 캐시 키로 사용</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>MD5/SHA-1 비추천:</strong> MD5와 SHA-1은 충돌 공격에 취약하므로 보안 용도로 사용하지 마세요.</li>
                <li><strong>비밀번호 해싱:</strong> 단순 해시는 레인보우 테이블 공격에 취약합니다. bcrypt, scrypt, argon2를 사용하세요.</li>
                <li><strong>Salt 추가:</strong> 비밀번호 해싱 시 반드시 랜덤 salt를 추가해야 합니다.</li>
                <li><strong>일방향:</strong> 해시값에서 원본 데이터를 복원할 수 없습니다 (암호화가 아님).</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              더 알아보기
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/snippets" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">💻 코드 스니펫</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">언어별 해시 생성 예제</p>
              </a>
              <a href="/password" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">🔑 비밀번호 생성기</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">안전한 비밀번호 생성</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
