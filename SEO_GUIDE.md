# SEO 최적화 가이드

이 프로젝트는 검색 엔진 최적화(SEO)를 위한 모든 설정이 완료되어 있습니다.

## ✅ 구현된 SEO 기능

### 1. 메타데이터 최적화
- **루트 레이아웃**: 전체 사이트 메타데이터 설정
- **페이지별 메타데이터**: 각 도구 페이지에 맞춤형 메타데이터
- **키워드**: 한국어 및 영어 검색어 최적화
- **Open Graph**: 소셜 미디어 공유 최적화
- **Twitter Card**: 트위터 공유 최적화

### 2. 구조화된 데이터 (JSON-LD)
- Schema.org의 WebApplication 타입 사용
- 15개 도구의 기능 목록 포함
- 무료 제공 명시 (price: 0)

### 3. Sitemap & Robots
- **sitemap.xml**: 모든 페이지 자동 생성
  - 접근: `https://your-domain.com/sitemap.xml`
- **robots.txt**: 검색 엔진 크롤링 규칙
  - 접근: `https://your-domain.com/robots.txt`

### 4. PWA (Progressive Web App)
- **manifest.json**: 앱 설치 지원
- 아이콘 및 스크린샷 설정

### 5. 성능 최적화
- GZIP 압축 활성화
- 이미지 최적화 (AVIF, WebP)
- 보안 헤더 설정

## 📋 배포 후 해야 할 일

### 1. URL 설정
메타데이터/robots/sitemap의 base URL은 `utils/siteUrl.ts`에서 공통으로 계산합니다.

- **권장**: `NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 설정
- **대체**: 미설정 시 `VERCEL_URL` 또는 기본값(`https://dev-tools-online.vercel.app`)을 사용

### 2. Google Search Console 등록
1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 추가 (도메인 또는 URL 접두어)
3. 소유권 확인
4. Sitemap 제출: `https://your-domain.com/sitemap.xml`
5. `app/layout.tsx`의 `verification.google` 값을 실제 코드로 변경

### 3. 네이버 웹마스터 도구
1. [네이버 서치어드바이저](https://searchadvisor.naver.com/) 접속
2. 사이트 등록
3. 소유권 확인
4. 사이트맵 제출: `https://your-domain.com/sitemap.xml`

### 4. Bing 웹마스터 도구
1. [Bing Webmaster Tools](https://www.bing.com/webmasters) 접속
2. 사이트 추가
3. 소유권 확인
4. Sitemap 제출

### 5. 이미지 파일 생성
다음 이미지 파일들을 생성하여 `public` 폴더에 추가하세요:

- `og-image.png` (1200x630px) - Open Graph 이미지
- `icon-192x192.png` (192x192px) - PWA 아이콘
- `icon-512x512.png` (512x512px) - PWA 아이콘
- `screenshot1.png` (1280x720px) - 앱 스크린샷

### 6. Google Analytics 추가 (선택사항)
1. [Google Analytics](https://analytics.google.com/) 계정 생성
2. 추적 ID 발급
3. Next.js에 Google Analytics 추가:

```tsx
// app/layout.tsx
import Script from 'next/script'

// <head> 태그 안에 추가
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

### 7. 검색 엔진 색인 확인
배포 후 며칠 뒤 다음 검색으로 색인 여부를 확인하세요:
- Google: `site:your-domain.com`
- Naver: `site:your-domain.com`

## 🎯 SEO 체크리스트

- [x] 메타 태그 (title, description, keywords)
- [x] Open Graph 태그
- [x] Twitter Card 태그
- [x] Canonical URL
- [x] robots.txt
- [x] sitemap.xml
- [x] 구조화된 데이터 (JSON-LD)
- [x] PWA manifest
- [x] 모바일 반응형 디자인
- [x] 페이지 로딩 속도 최적화
- [x] HTTPS (배포 시 적용)
- [x] 보안 헤더
- [ ] Google Search Console 등록
- [ ] 이미지 파일 생성
- [ ] 실제 도메인 사용 시 `NEXT_PUBLIC_SITE_URL` 설정

## 📊 SEO 성능 측정

배포 후 다음 도구들로 SEO 성능을 측정하세요:

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev/

2. **Google Mobile-Friendly Test**
   - https://search.google.com/test/mobile-friendly

3. **Google Rich Results Test**
   - https://search.google.com/test/rich-results

4. **Lighthouse** (Chrome DevTools)
   - Performance, Accessibility, SEO 점수 확인

## 💡 추가 최적화 팁

### 내부 링크
- 모든 도구 페이지가 메인 페이지와 네비게이션으로 연결됨 ✅

### 콘텐츠 품질
- 각 페이지에 고유한 제목과 설명 ✅
- 키워드가 자연스럽게 포함됨 ✅

### 기술적 SEO
- 빠른 로딩 속도 (클라이언트 사이드 처리) ✅
- 모바일 최적화 (반응형 디자인) ✅
- 시맨틱 HTML 사용 ✅

### 사용자 경험
- 직관적인 네비게이션 ✅
- 다크 모드 지원 ✅
- 원클릭 복사 기능 ✅

## 🔄 정기 업데이트

SEO는 지속적인 관리가 필요합니다:
- 매월 Google Search Console에서 성능 확인
- 검색 쿼리 분석 및 콘텐츠 개선
- 새로운 도구 추가 시 sitemap 자동 업데이트
- 메타데이터 최적화

## 📞 문제 해결

### Sitemap이 표시되지 않는 경우
1. 빌드 후 배포했는지 확인
2. URL이 올바른지 확인
3. 서버가 정상 작동하는지 확인

### Google에 색인되지 않는 경우
1. Google Search Console에서 URL 검사
2. 색인 생성 요청
3. robots.txt가 크롤링을 차단하지 않는지 확인
4. 충분한 시간 대기 (최대 1-2주)

## 🚀 배포 플랫폼별 가이드

### Vercel
- 자동으로 HTTPS 적용
- 환경 변수에 도메인 설정
- Analytics 활성화 권장

### Netlify
- Custom domain 설정
- HTTPS 강제 적용
- Forms 기능 활용 가능

### AWS Amplify
- CloudFront CDN 자동 설정
- Route 53으로 도메인 관리
- CloudWatch로 모니터링
