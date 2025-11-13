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
