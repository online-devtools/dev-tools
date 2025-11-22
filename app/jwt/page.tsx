import JWTTool from '@/components/JWTTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JWT 디코더',
  description: 'JWT(JSON Web Token)을 디코딩하고 Header와 Payload를 확인할 수 있는 무료 온라인 JWT 디코더 도구입니다.',
  keywords: ['JWT', 'JWT 디코더', 'JWT decoder', 'JSON Web Token', 'JWT 분석', 'token decoder'],
  openGraph: {
    title: 'JWT 디코더 - Developer Tools',
    description: 'JWT 토큰을 디코딩하는 무료 온라인 도구',
  },
}

export default function JWTPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <JWTTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          JWT(JSON Web Token)란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed">
              JWT는 웹 애플리케이션에서 사용자 인증과 정보 교환을 위한 표준 토큰 형식입니다.
              서버와 클라이언트 간에 안전하게 정보를 전달할 수 있으며, 토큰 자체에 사용자 정보가 포함되어 있어
              별도의 세션 저장소 없이도 인증을 구현할 수 있습니다. 특히 마이크로서비스 아키텍처나
              API 기반 애플리케이션에서 널리 사용됩니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>토큰 디버깅:</strong> 로그인 실패 시 JWT 토큰의 헤더와 페이로드를 확인하여 문제 원인 파악</li>
              <li><strong>개발/테스트:</strong> API 응답으로 받은 JWT의 내용을 빠르게 확인</li>
              <li><strong>토큰 검증:</strong> exp(만료시간), iss(발급자), aud(대상) 등 클레임 값 확인</li>
              <li><strong>권한 확인:</strong> 토큰에 포함된 role, permissions 등 권한 정보 확인</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm mb-3"><strong>시나리오:</strong> 로그인 후 "Unauthorized" 오류가 발생하는 경우</p>
              <ol className="text-sm list-decimal list-inside space-y-2">
                <li>브라우저 개발자 도구에서 JWT 토큰 복사</li>
                <li>JWT 디코더에 붙여넣기하여 페이로드 확인</li>
                <li>exp(만료시간)이 현재 시간보다 이전인지 확인</li>
                <li>iss(발급자)와 aud(대상)가 서버 설정과 일치하는지 확인</li>
                <li>role이나 permissions가 접근하려는 API에 필요한 권한을 가지고 있는지 확인</li>
              </ol>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>민감한 정보 노출:</strong> JWT는 Base64로 인코딩되어 있어 누구나 디코딩할 수 있습니다. 비밀번호, API 키 등 민감한 정보는 절대 포함하지 마세요.</li>
                <li><strong>서명 검증:</strong> 이 도구는 디코딩만 수행합니다. 실제 서명 검증은 서버에서 이루어져야 합니다.</li>
                <li><strong>만료시간 확인:</strong> exp 클레임을 항상 확인하여 토큰이 유효한지 확인하세요.</li>
                <li><strong>토큰 크기:</strong> JWT에 너무 많은 정보를 담으면 토큰 크기가 커져 네트워크 오버헤드가 발생할 수 있습니다.</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              더 알아보기
            </h3>
            <div className="grid gap-4">
              <a href="/snippets" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">💻 코드 스니펫</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Node.js, Java, Go 등 언어별 JWT 구현 예제</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
