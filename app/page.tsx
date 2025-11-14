import Link from 'next/link'

const tools = [
  {
    category: 'Encoding & Decoding',
    items: [
      { name: 'Base64 Encoder/Decoder', path: '/base64', icon: '🔤', desc: 'Base64 인코딩 및 디코딩' },
      { name: 'URL Encoder/Decoder', path: '/url', icon: '🔗', desc: 'URL 인코딩 및 디코딩' },
    ]
  },
  {
    category: 'Security & Encryption',
    items: [
      { name: 'Jasypt Encryption', path: '/jasypt', icon: '🔐', desc: 'AES 암호화 및 복호화' },
      { name: 'Hash Generator', path: '/hash', icon: '🔒', desc: 'MD5, SHA 해시 생성' },
    ]
  },
  {
    category: 'Data Format',
    items: [
      { name: 'JSON Formatter', path: '/json', icon: '📋', desc: 'JSON 포맷팅 및 검증' },
      { name: 'JWT Decoder', path: '/jwt', icon: '🎫', desc: 'JWT 토큰 디코딩 및 검증' },
      { name: 'SQL Formatter', path: '/sql', icon: '🗃️', desc: 'SQL 쿼리 포맷팅' },
      { name: 'MyBatis to SQL', path: '/mybatis', icon: '🐦', desc: 'MyBatis 쿼리를 실행 가능한 SQL로 변환' },
      { name: 'CSV/JSON Converter', path: '/csv', icon: '📊', desc: 'CSV ↔ JSON 변환' },
      { name: 'HTML/XML Formatter', path: '/html', icon: '🏷️', desc: 'HTML/XML 포맷팅' },
    ]
  },
  {
    category: 'Generators',
    items: [
      { name: 'UUID Generator', path: '/uuid', icon: '🆔', desc: 'UUID 생성' },
      { name: 'QR Code Generator', path: '/qrcode', icon: '📱', desc: 'QR 코드 생성' },
      { name: 'Lorem Ipsum Generator', path: '/lorem', icon: '📄', desc: '더미 텍스트 생성' },
    ]
  },
  {
    category: 'Converters',
    items: [
      { name: 'Timestamp Converter', path: '/timestamp', icon: '⏰', desc: '타임스탬프 변환' },
      { name: 'Color Converter', path: '/color', icon: '🎨', desc: 'HEX/RGB/HSL 변환' },
      { name: 'Case Converter', path: '/case', icon: '📝', desc: '문자열 케이스 변환' },
    ]
  },
  {
    category: 'Tools',
    items: [
      { name: 'Regex Tester', path: '/regex', icon: '🔍', desc: '정규식 테스트' },
      { name: 'Cron Parser', path: '/cron', icon: '⏰', desc: 'Cron 표현식 해석' },
      { name: 'Diff Checker', path: '/diff', icon: '📄', desc: '텍스트 비교' },
    ]
  }
]

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          개발자를 위한 필수 도구 모음
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          개발하면서 자주 사용하는 유틸리티 도구들을 한 곳에서
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          ✨ 18개의 전문 개발 도구 제공
        </p>
      </div>

      {/* 소개 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Developer Tools란?
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="leading-relaxed">
            Developer Tools는 웹 개발자, 백엔드 개발자, 프론트엔드 개발자, 풀스택 개발자 등
            모든 개발자들이 일상적으로 필요로 하는 다양한 온라인 유틸리티 도구를 한 곳에서
            제공하는 무료 웹 서비스입니다. Base64 인코딩/디코딩, JSON 포맷팅, JWT 토큰 디코딩,
            정규식 테스트, QR 코드 생성 등 개발 과정에서 자주 사용되는 18가지 이상의 전문 도구를
            별도의 설치나 회원가입 없이 바로 사용할 수 있습니다.
          </p>
          <p className="leading-relaxed">
            모든 도구는 클라이언트 사이드에서만 작동하여 사용자의 데이터가 서버로 전송되지 않으므로
            완벽한 프라이버시를 보장합니다. 또한 반응형 디자인으로 제작되어 데스크톱, 태블릿,
            모바일 등 모든 기기에서 최적화된 사용 경험을 제공합니다. 다크 모드를 자동으로 지원하여
            장시간 개발 작업 시에도 눈의 피로를 최소화할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 주요 특징 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md p-8 mb-8 border border-blue-200 dark:border-gray-600">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          왜 Developer Tools를 선택해야 할까요?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">완전 무료</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                모든 도구를 무료로 제한 없이 사용할 수 있습니다. 숨겨진 비용이나 프리미엄 플랜이 없습니다.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">프라이버시 우선</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                모든 처리는 브라우저에서만 이루어지며, 입력 데이터가 서버로 전송되지 않아 안전합니다.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">빠른 성능</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                서버 통신 없이 즉시 결과를 확인할 수 있어 빠르고 효율적입니다.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">모든 기기 지원</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                PC, 태블릿, 스마트폰 등 어떤 기기에서도 최적화된 경험을 제공합니다.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              5
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">회원가입 불필요</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                복잡한 가입 절차 없이 바로 접속해서 사용할 수 있습니다.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              6
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">지속적인 업데이트</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                개발자 커뮤니티의 피드백을 반영하여 새로운 도구를 지속적으로 추가합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {tools.map((category) => (
          <div key={category.category}>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-3xl">{tool.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
