import PasswordGeneratorTool from '@/components/PasswordGeneratorTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Secure Password Generator | Developer Tools',
  description: '안전한 비밀번호 생성기. 대소문자, 숫자, 특수문자를 포함한 강력한 랜덤 비밀번호를 생성합니다',
  keywords: ['password generator', 'secure password', 'random password', '비밀번호 생성기', '안전한 비밀번호'],
}

export default function PasswordPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PasswordGeneratorTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          안전한 비밀번호 생성이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              강력한 비밀번호는 계정 보안의 첫 번째 방어선입니다.
              사전 공격(Dictionary Attack), 무차별 대입(Brute Force), 레인보우 테이블(Rainbow Table) 등
              다양한 해킹 기법으로부터 계정을 보호하려면 예측 불가능한 무작위 비밀번호가 필요합니다.
            </p>
            <p className="leading-relaxed">
              인간이 만드는 비밀번호는 패턴이 있어 취약하지만, 암호학적으로 안전한 난수 생성기(CSPRNG)를
              사용하면 진정한 무작위 비밀번호를 생성할 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>새 계정 생성:</strong> 웹사이트, 앱, 서비스 가입 시 고유한 비밀번호 생성</li>
              <li><strong>비밀번호 재설정:</strong> 기존 취약한 비밀번호를 강력한 것으로 교체</li>
              <li><strong>임시 비밀번호:</strong> 관리자가 사용자에게 제공할 임시 비밀번호 생성</li>
              <li><strong>API 키/토큰:</strong> 애플리케이션 간 인증에 사용할 시크릿 키 생성</li>
              <li><strong>데이터베이스 암호:</strong> 데이터베이스, 관리자 패널 등의 강력한 암호 설정</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              강력한 비밀번호 요구사항
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-3 font-semibold">비밀번호 강도 구성 요소</p>
                <ul className="text-sm space-y-2">
                  <li>✅ <strong>최소 12자 이상:</strong> 16자 이상 권장 (길수록 안전)</li>
                  <li>✅ <strong>대문자 포함:</strong> A-Z 중 최소 1개</li>
                  <li>✅ <strong>소문자 포함:</strong> a-z 중 최소 1개</li>
                  <li>✅ <strong>숫자 포함:</strong> 0-9 중 최소 1개</li>
                  <li>✅ <strong>특수문자 포함:</strong> !@#$%^&* 등 최소 1개</li>
                  <li>❌ <strong>사전 단어 금지:</strong> 영어/한글 사전에 있는 단어 사용 안 함</li>
                  <li>❌ <strong>개인정보 금지:</strong> 생일, 이름, 전화번호 사용 안 함</li>
                  <li>❌ <strong>연속 문자 금지:</strong> 123456, abcdef, qwerty 같은 패턴 사용 안 함</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">엔트로피(Entropy) 계산</p>
                <p className="text-xs mb-2">비밀번호 강도는 엔트로피로 측정됩니다:</p>
                <ul className="text-xs space-y-1">
                  <li>• 소문자만 8자: 약 38비트 (1초 내 크랙 가능)</li>
                  <li>• 대소문자+숫자 8자: 약 48비트 (몇 시간 소요)</li>
                  <li>• 대소문자+숫자+특수문자 12자: 약 78비트 (수년 소요)</li>
                  <li>• 대소문자+숫자+특수문자 16자: 약 104비트 (사실상 불가능)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>비밀번호 재사용 금지:</strong> 모든 서비스마다 다른 비밀번호를 사용하세요. 한 곳에서 유출되면 다른 계정도 위험합니다.</li>
                <li><strong>비밀번호 관리자 사용:</strong> 복잡한 비밀번호를 기억하기 어려우므로 1Password, Bitwarden 같은 관리자를 사용하세요.</li>
                <li><strong>2단계 인증(2FA):</strong> 비밀번호만으로는 부족합니다. 가능한 모든 서비스에서 2FA를 활성화하세요.</li>
                <li><strong>정기 변경 불필요:</strong> 강력한 비밀번호는 정기적으로 변경할 필요가 없습니다. 유출 의심 시만 변경하세요.</li>
                <li><strong>브라우저 저장 주의:</strong> 공용 컴퓨터에서는 브라우저에 비밀번호를 저장하지 마세요.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              일반적인 취약한 비밀번호
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">유형</th>
                    <th className="px-4 py-2 text-left border-b">예시</th>
                    <th className="px-4 py-2 text-left border-b">크랙 시간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">연속 숫자</td>
                    <td className="px-4 py-2 border-b">123456, 111111</td>
                    <td className="px-4 py-2 border-b text-red-600">즉시</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">키보드 패턴</td>
                    <td className="px-4 py-2 border-b">qwerty, asdfgh</td>
                    <td className="px-4 py-2 border-b text-red-600">즉시</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">흔한 단어</td>
                    <td className="px-4 py-2 border-b">password, admin</td>
                    <td className="px-4 py-2 border-b text-red-600">즉시</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">단어+숫자</td>
                    <td className="px-4 py-2 border-b">password123</td>
                    <td className="px-4 py-2 border-b text-orange-600">몇 초</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">강력한 비밀번호</td>
                    <td className="px-4 py-2">7$kL9@pQz#2mX8rT</td>
                    <td className="px-4 py-2 text-green-600">수천 년</td>
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
              <a href="/hash" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔐 해시 생성기</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">비밀번호 해시 생성 및 검증</p>
              </a>
              <a href="/uuid" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">🆔 UUID 생성기</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">고유 식별자 생성</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
