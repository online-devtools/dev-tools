import { MetadataRoute } from 'next'

/**
 * PWA Manifest 설정
 *
 * 웹 앱을 홈 화면에 추가할 때 사용되는 메타데이터를 정의합니다.
 * - name/short_name: 앱 이름 (홈 화면, 앱 전환기에 표시)
 * - description: 앱 설명
 * - icons: 다양한 크기의 앱 아이콘
 * - display: standalone으로 설정하여 네이티브 앱처럼 표시
 *
 * Note: Next.js의 manifest.ts는 정적으로 생성되므로 다국어 지원은
 * 기본 영어로 설정하고, 주요 키워드는 다국어로 포함합니다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    // 다국어 사용자를 위해 영어와 한국어 병기
    name: 'Developer Tools - 170+ Online Utilities',
    short_name: 'Dev Tools',
    // 170+ 도구로 업데이트된 설명
    description: '170+ essential online tools for developers. Base64, JSON, JWT, Regex, UUID, QR Code, and more. Free, fast, and privacy-focused.',
    start_url: '/',
    // standalone 모드로 네이티브 앱처럼 표시
    display: 'standalone',
    background_color: '#ffffff',
    // 브랜드 색상 - blue-500
    theme_color: '#3B82F6',
    // 반응형이므로 any orientation 허용
    orientation: 'any',
    // 앱 아이콘 - 다양한 크기 제공
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        // any 목적의 아이콘도 추가 (일부 브라우저 호환성)
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    // 앱 카테고리 - 앱 스토어 분류용
    categories: ['productivity', 'utilities', 'developer tools'],
    // 스크린샷 (앱 스토어 표시용)
    screenshots: [
      {
        src: '/screenshot1.png',
        sizes: '1280x720',
        type: 'image/png',
      },
    ],
    // 다국어 지원 표시
    lang: 'en',
    // 추가 메타데이터
    scope: '/',
    // 가로 모드 스크린샷 (선택적)
    prefer_related_applications: false,
  }
}
