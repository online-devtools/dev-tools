'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

// Tool configuration with translation keys
const toolsConfig = [
  {
    categoryKey: 'category.encoding',
    items: [
      { nameKey: 'tool.base64', path: '/base64', icon: '🔤', descKey: 'tool.base64.desc' },
      { nameKey: 'tool.url', path: '/url', icon: '🔗', descKey: 'tool.url.desc' },
      { nameKey: 'tool.htmlEntities', path: '/html-entities', icon: '&', descKey: 'HTML 엔티티 인코딩/디코딩' },
      { nameKey: 'tool.base64File', path: '/base64-file', icon: '📁', descKey: '파일 ↔ Base64 변환' },
    ]
  },
  {
    categoryKey: 'category.security',
    items: [
      { nameKey: 'tool.jasypt', path: '/jasypt', icon: '🔐', descKey: 'tool.jasypt.desc' },
      { nameKey: 'tool.hash', path: '/hash', icon: '🔒', descKey: 'tool.hash.desc' },
      { nameKey: 'tool.password', path: '/password', icon: '🔑', descKey: 'tool.password.desc' },
      { nameKey: 'tool.bcrypt', path: '/bcrypt', icon: '🔐', descKey: 'Bcrypt 비밀번호 해싱' },
      { nameKey: 'tool.hmac', path: '/hmac', icon: '🔒', descKey: 'HMAC 메시지 인증 코드' },
      { nameKey: 'tool.otp', path: '/otp', icon: '🔢', descKey: 'OTP 일회용 비밀번호 생성' },
      { nameKey: 'tool.basicAuth', path: '/basic-auth', icon: '🔑', descKey: 'HTTP 기본 인증 생성' },
      { nameKey: 'tool.stringObfuscator', path: '/string-obfuscator', icon: '🎭', descKey: '문자열 마스킹/난독화' },
      { nameKey: 'tool.passwordStrength', path: '/password-strength', icon: '💪', descKey: '비밀번호 강도 분석' },
      { nameKey: 'tool.bip39', path: '/bip39', icon: '🔐', descKey: 'BIP39 니모닉 생성' },
    ]
  },
  {
    categoryKey: 'category.dataFormat',
    items: [
      { nameKey: 'tool.json', path: '/json', icon: '📋', descKey: 'tool.json.desc' },
      { nameKey: 'tool.jwt', path: '/jwt', icon: '🎫', descKey: 'tool.jwt.desc' },
      { nameKey: 'tool.sql', path: '/sql', icon: '🗃️', descKey: 'tool.sql.desc' },
      { nameKey: 'tool.mybatis', path: '/mybatis', icon: '🐦', descKey: 'tool.mybatis.desc' },
      { nameKey: 'tool.csv', path: '/csv', icon: '📊', descKey: 'tool.csv.desc' },
      { nameKey: 'tool.html', path: '/html', icon: '🏷️', descKey: 'tool.html.desc' },
      { nameKey: 'tool.yamlJson', path: '/yaml-json', icon: '🔄', descKey: 'YAML ↔ JSON 변환' },
      { nameKey: 'tool.yamlToml', path: '/yaml-toml', icon: '🔄', descKey: 'YAML ↔ TOML 변환' },
      { nameKey: 'tool.jsonToml', path: '/json-toml', icon: '🔄', descKey: 'JSON ↔ TOML 변환' },
      { nameKey: 'tool.xmlJson', path: '/xml-json', icon: '🔄', descKey: 'XML ↔ JSON 변환' },
      { nameKey: 'tool.markdownHtml', path: '/markdown-html', icon: '📝', descKey: 'Markdown → HTML 변환' },
      { nameKey: 'tool.jsonMinify', path: '/json-minify', icon: '📦', descKey: 'JSON 압축/포맷' },
      { nameKey: 'tool.jsonCsv', path: '/json-csv', icon: '📊', descKey: 'JSON → CSV 변환' },
      { nameKey: 'tool.jsonDiff', path: '/json-diff', icon: '🔍', descKey: 'JSON 비교' },
    ]
  },
  {
    categoryKey: 'category.generators',
    items: [
      { nameKey: 'tool.uuid', path: '/uuid', icon: '🆔', descKey: 'tool.uuid.desc' },
      { nameKey: 'tool.qrcode', path: '/qrcode', icon: '📱', descKey: 'tool.qrcode.desc' },
      { nameKey: 'tool.lorem', path: '/lorem', icon: '📄', descKey: 'tool.lorem.desc' },
      { nameKey: 'tool.tokenGenerator', path: '/token-generator', icon: '🎲', descKey: '랜덤 토큰/문자열 생성' },
      { nameKey: 'tool.ulid', path: '/ulid', icon: '🆔', descKey: 'ULID 생성기' },
      { nameKey: 'tool.portGenerator', path: '/port-generator', icon: '🔌', descKey: '랜덤 포트 생성기' },
      { nameKey: 'tool.emojiPicker', path: '/emoji-picker', icon: '😀', descKey: '이모지 선택 및 복사' },
      { nameKey: 'tool.asciiArt', path: '/ascii-art', icon: '🎨', descKey: 'ASCII 아트 생성' },
      { nameKey: 'tool.macAddress', path: '/mac-address', icon: '🖧', descKey: 'MAC 주소 생성/검증' },
    ]
  },
  {
    categoryKey: 'category.converters',
    items: [
      { nameKey: 'tool.timestamp', path: '/timestamp', icon: '⏰', descKey: 'tool.timestamp.desc' },
      { nameKey: 'tool.color', path: '/color', icon: '🎨', descKey: 'tool.color.desc' },
      { nameKey: 'tool.case', path: '/case', icon: '📝', descKey: 'tool.case.desc' },
      { nameKey: 'tool.baseconv', path: '/baseconv', icon: '🔢', descKey: 'tool.baseconv.desc' },
      { nameKey: 'tool.romanNumeral', path: '/roman-numeral', icon: 'Ⅰ', descKey: '로마 숫자 변환' },
      { nameKey: 'tool.tempConverter', path: '/temp-converter', icon: '🌡️', descKey: '온도 변환기' },
    ]
  },
  {
    categoryKey: 'category.text',
    items: [
      { nameKey: 'tool.slugify', path: '/slugify', icon: '🔗', descKey: 'URL/파일명 안전 문자열 변환' },
      { nameKey: 'tool.natoAlphabet', path: '/nato-alphabet', icon: '📻', descKey: 'NATO 음성 문자 변환' },
      { nameKey: 'tool.textBinary', path: '/text-binary', icon: '0', descKey: '텍스트 ↔ 이진수 변환' },
      { nameKey: 'tool.textUnicode', path: '/text-unicode', icon: 'U', descKey: '텍스트 ↔ 유니코드 변환' },
      { nameKey: 'tool.textStats', path: '/text-stats', icon: '📊', descKey: '텍스트 통계 분석' },
      { nameKey: 'tool.numeronym', path: '/numeronym', icon: 'i18n', descKey: 'Numeronym 생성기' },
      { nameKey: 'tool.listConverter', path: '/list-converter', icon: '📃', descKey: '리스트 정렬/변환' },
      { nameKey: 'tool.emailNormalizer', path: '/email-normalizer', icon: '📧', descKey: '이메일 정규화' },
    ]
  },
  {
    categoryKey: 'category.calculators',
    items: [
      { nameKey: 'tool.mathEval', path: '/math-eval', icon: '🧮', descKey: '수식 계산기' },
      { nameKey: 'tool.percentageCalc', path: '/percentage-calc', icon: '%', descKey: '퍼센트 계산기' },
    ]
  },
  {
    categoryKey: 'category.info',
    items: [
      { nameKey: 'tool.httpStatus', path: '/http-status', icon: '🌐', descKey: 'HTTP 상태 코드 목록' },
      { nameKey: 'tool.mimeTypes', path: '/mime-types', icon: '📄', descKey: 'MIME 타입 변환' },
      { nameKey: 'tool.keycode', path: '/keycode', icon: '⌨️', descKey: '키보드 이벤트 정보' },
      { nameKey: 'tool.deviceInfo', path: '/device-info', icon: '📱', descKey: '기기 정보' },
      { nameKey: 'tool.userAgent', path: '/user-agent', icon: '🖥️', descKey: 'User Agent 파서' },
      { nameKey: 'tool.phoneParser', path: '/phone-parser', icon: '📞', descKey: '전화번호 파싱/검증' },
      { nameKey: 'tool.ibanValidator', path: '/iban-validator', icon: '🏦', descKey: 'IBAN 검증/파싱' },
    ]
  },
  {
    categoryKey: 'category.linux',
    items: [
      { nameKey: 'tool.chmod', path: '/chmod', icon: '🔐', descKey: 'tool.chmod.desc' },
      { nameKey: 'tool.regex', path: '/regex', icon: '🔍', descKey: 'tool.regex.desc' },
      { nameKey: 'tool.cron', path: '/cron', icon: '⏰', descKey: 'tool.cron.desc' },
    ]
  },
  {
    categoryKey: 'category.network',
    items: [
      { nameKey: 'tool.ipcalc', path: '/ipcalc', icon: '🌐', descKey: 'tool.ipcalc.desc' },
      { nameKey: 'tool.diff', path: '/diff', icon: '📄', descKey: 'tool.diff.desc' },
      { nameKey: 'tool.urlParser', path: '/url-parser', icon: '🔍', descKey: 'URL 분석 및 파싱' },
      { nameKey: 'tool.ipv4Converter', path: '/ipv4-converter', icon: '🔢', descKey: 'IPv4 주소 변환' },
    ]
  }
]

export default function Home() {
  const { t } = useLanguage()
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section - 핵심 가치 제안 */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-2xl shadow-lg p-8 md:p-12 mb-12 border border-blue-100 dark:border-gray-700">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            개발자 필수 도구
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            개발 작업을 더 빠르고 쉽게
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Base64 인코딩부터 JWT 디버깅까지, 개발자가 자주 사용하는 70개 이상의 온라인 도구를
            <span className="font-bold text-blue-600 dark:text-blue-400"> 무료로, 설치 없이, 안전하게</span> 사용하세요
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            ✨ 모든 데이터는 브라우저에서만 처리되어 서버로 전송되지 않습니다
          </p>

          {/* Key Features - 핵심 특징 */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">완벽한 프라이버시</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">클라이언트 사이드 처리</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">즉시 사용</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">회원가입 불필요</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-2xl mb-2">💯</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">완전 무료</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">모든 기능 제한 없음</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">모든 기기 지원</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">반응형 디자인</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {toolsConfig.map((category) => (
          <div key={category.categoryKey}>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {t(category.categoryKey)}
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
                        {t(tool.nameKey)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(tool.descKey)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {t('nav.snippets')}
            </p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-1">
              {t('home.snippets.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('home.snippets.desc')}
            </p>
          </div>
          <Link
            href="/snippets"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('home.snippets.cta')}
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {t('nav.changelog')}
            </p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-1">
              {t('home.changelog.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('home.changelog.desc')}
            </p>
          </div>
          <Link
            href="/changelog"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('home.changelog.cta')}
          </Link>
        </div>
      </div>

      {/* 접을 수 있는 소개 섹션 - 맨 아래 */}
      <div className="mt-12">
        <button
          onClick={() => setIsAboutOpen(!isAboutOpen)}
          className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center justify-between"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t('home.aboutTitle')}
          </h2>
          <svg
            className={`w-6 h-6 text-gray-600 dark:text-gray-400 transition-transform ${
              isAboutOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isAboutOpen && (
          <div className="mt-4 space-y-6">
            {/* 소개 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                  {t('home.aboutText1')}
                </p>
                <p className="leading-relaxed">
                  {t('home.aboutText2')}
                </p>
              </div>
            </div>

            {/* 주요 특징 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md p-8 border border-blue-200 dark:border-gray-600">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                {t('home.whyTitle')}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {num}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                        {t(`home.feature${num}.title`)}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t(`home.feature${num}.desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
