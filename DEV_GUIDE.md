# 개발자 가이드

## 개요
이 프로젝트는 TypeScript 기반의 Next.js 15(App Router) 애플리케이션입니다. `app/` 아래의 파일은 기본적으로 서버 컴포넌트이며, 상호작용이 필요한 UI는 `components/` 폴더에서 `'use client'`를 선언하고 작성합니다. `tsconfig.json`에 정의된 `@/*` 경로 별칭 덕분에 `@/components/Base64Tool`처럼 루트 기준으로 쉽게 import 할 수 있습니다.

## 핵심 개념
- **클라이언트 vs 서버 컴포넌트**: 사용자의 입력을 처리하거나 브라우저 API를 써야 하는 파일은 꼭 `'use client'`로 시작해야 하며, `useState`, `useEffect` 등 React 훅을 사용할 수 있습니다. 라우트 파일(`app/base64/page.tsx` 등)은 서버에서 렌더링되지만, 내부에서 클라이언트 컴포넌트를 포함할 수 있습니다.
- **TypeScript 상태/프롭스**: `components/TextAreaWithCopy.tsx`처럼 간단한 인터페이스를 선언해두면 IDE 자동완성이 좋아지고, `useState<string>('')` 형태로 상태 타입을 명시할 수 있습니다. 문법은 기존 JS와 동일하며 타입 표시는 IDE를 위한 힌트라고 보면 됩니다.
- **컨텍스트 & 다국어**: `contexts/LanguageContext.tsx`는 `useLanguage()` 훅을 제공하여 `{ language, setLanguage, t }`를 어디에서나 불러올 수 있게 합니다. `t(key, replacements?)`는 문자열 치환까지 지원하므로 모든 UI 텍스트는 이 함수를 통해 노출됩니다.
- **유틸리티 분리**: 재사용되거나 테스트가 필요한 로직은 `utils/`에 배치합니다. `utils/encoding.ts`는 Node/브라우저 양쪽에서 동작하는 Base64 변환을, `utils/jwt.ts`는 CryptoJS 기반 HMAC 서명을 담당합니다. 이 구조 덕분에 Vitest로 순수 로직만 따로 검증할 수 있습니다.

## 도구 추가/수정 흐름
1. `app/<tool>/page.tsx`를 만들고 필요한 클라이언트 컴포넌트를 렌더링합니다.
2. UI는 `components/`에 작성하며 Tailwind 클래스를 활용합니다. 텍스트가 있으면 `useLanguage()`를 import 하고 `'use client'`를 선언합니다.
3. 새 도구를 `components/Navigation.tsx`의 `toolCategories` 배열에 추가해 네비게이션에서 노출시킵니다.
4. 레이블, 플레이스홀더, 에러 메시지는 `LanguageContext` 번역 객체에 키를 추가합니다.
5. 연산/변환 로직이 재사용 가능하면 `utils/<feature>.ts`에 작성하고, `tests/`에 Vitest 테스트를 추가합니다.

## 명령어 & 테스트
- `npm run dev`: 개발 서버 (핫 리로드) – http://localhost:3000
- `npm run build` / `npm start`: 프로덕션 빌드 및 로컬 미리보기
- `npm run lint`: Next.js + ESLint 규칙 (TypeScript strict mode)
- `npm run test`: Vitest 테스트 (Base64, 정규식, JWT 유틸 로직 커버)

## JWT 서명 구조 이해하기
`components/JWTSignerTool.tsx`는 JSON 입력을 검증하고 `utils/jwt.ts`의 `createSignedJwt()`를 호출해 HS256/384/512 토큰을 생성합니다. React 컴포넌트는 사용자 입력과 상태만 다루고, 실제 암호화 로직은 유틸로 분리하는 패턴은 대부분의 다른 도구에서도 동일하게 적용됩니다. 이 구조를 참고해 새로운 기능도 React(UI)와 순수 로직을 분리해서 개발하는 것을 권장합니다.
