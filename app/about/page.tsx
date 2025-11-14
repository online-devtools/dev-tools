import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '소개',
  description: 'Developer Tools는 개발자를 위한 필수 온라인 도구 모음입니다. Base64 인코딩, JSON 포맷팅, JWT 디코딩 등 18가지 이상의 무료 개발 도구를 제공합니다.',
  openGraph: {
    title: '소개 - Developer Tools',
    description: '개발자를 위한 필수 온라인 도구 모음',
  },
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Developer Tools 소개
        </h1>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              우리의 미션
            </h2>
            <p className="leading-relaxed">
              Developer Tools는 개발자들이 일상적으로 필요로 하는 다양한 유틸리티 도구들을
              한 곳에서 쉽고 빠르게 사용할 수 있도록 제공하는 무료 온라인 서비스입니다.
              복잡한 설치나 회원가입 없이, 브라우저에서 바로 사용할 수 있는 18가지 이상의
              전문 개발 도구를 제공합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              제공하는 도구들
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">인코딩 & 디코딩</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Base64 인코더/디코더</li>
                  <li>URL 인코더/디코더</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">보안 & 암호화</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Jasypt 암호화/복호화</li>
                  <li>해시 생성기 (MD5, SHA-1, SHA-256, SHA-512)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">데이터 포맷</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>JSON 포맷터</li>
                  <li>JWT 디코더</li>
                  <li>SQL 포맷터</li>
                  <li>CSV/JSON 변환기</li>
                  <li>HTML/XML 포맷터</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">생성기</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>UUID 생성기</li>
                  <li>QR 코드 생성기</li>
                  <li>Lorem Ipsum 생성기</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">변환기</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>타임스탬프 변환기</li>
                  <li>컬러 변환기 (HEX/RGB/HSL)</li>
                  <li>케이스 변환기</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">유틸리티</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>정규식 테스터</li>
                  <li>Cron 표현식 파서</li>
                  <li>Diff Checker</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              핵심 특징
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>완전 무료:</strong> 모든 도구를 무료로 제한 없이 사용할 수 있습니다.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>프라이버시 보호:</strong> 모든 데이터는 클라이언트 사이드에서만 처리되며, 서버로 전송되지 않습니다.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>빠른 성능:</strong> 브라우저에서 직접 처리되어 빠르고 즉각적인 결과를 제공합니다.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>반응형 디자인:</strong> 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 경험을 제공합니다.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>다크 모드 지원:</strong> 눈의 피로를 줄이는 다크 모드를 자동으로 지원합니다.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span><strong>직관적인 UI:</strong> 복잡한 설명 없이도 쉽게 사용할 수 있는 인터페이스를 제공합니다.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              기술 스택
            </h2>
            <p className="leading-relaxed">
              Developer Tools는 최신 웹 기술을 사용하여 구축되었습니다:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Next.js 15 - 최신 React 프레임워크</li>
              <li>TypeScript - 타입 안전성</li>
              <li>Tailwind CSS - 현대적인 스타일링</li>
              <li>crypto-js - 보안 암호화</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              지속적인 개선
            </h2>
            <p className="leading-relaxed">
              우리는 개발자 커뮤니티의 피드백을 바탕으로 지속적으로 새로운 도구를 추가하고
              기존 도구를 개선하고 있습니다. 더 나은 개발 경험을 제공하기 위해 항상 노력하고 있습니다.
            </p>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              문의하기
            </h2>
            <p className="leading-relaxed">
              Developer Tools에 대한 제안이나 문의사항이 있으시면
              <a href="/contact" className="text-blue-500 hover:text-blue-600 ml-1">
                문의 페이지
              </a>
              를 통해 연락해 주세요.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
