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


가이드/튜토리얼
실무 가이드 & 튜토리얼
검수 시 “가치 있는 콘텐츠”를 보여주기 위해 각 도구의 실제 사용 흐름과 코드를 제공합니다.

🧾
JWT 디버깅과 보안 체크
•
exp, aud, iss 등 필수 클레임을 검증하여 잘못된 발급을 방지합니다.
•
서명 실패 시 kid 불일치, 만료, 알고리즘 다운그레이드 여부를 로그로 남깁니다.
•
테스트용 토큰을 생성할 때 HS256/RS256 예제를 제공해 환경별로 복기합니다.
•
보안 팁: 짧은 만료 시간, 키 로테이션, HTTPS, 토큰 저장 위치(LocalStorage 금지) 안내.
Node.js 검증 예제

import jwt from 'jsonwebtoken'

const token = jwt.sign(
  { sub: 'user-123', aud: 'dev-tools', iss: 'dev-tools', exp: Math.floor(Date.now() / 1000) + 300 },
  process.env.JWT_SECRET!,
  { algorithm: 'HS256', keyid: 'v1' }
)

try {
  const payload = jwt.verify(token, process.env.JWT_SECRET!, { audience: 'dev-tools', issuer: 'dev-tools' })
  console.log('valid payload', payload)
} catch (error) {
  console.error('verify failed', error)
}
🔍
정규식 안전 가이드
•
이메일/URL/전화번호 패턴을 비교하며 플래그별 차이를 설명합니다.
•
그리디 vs. 논그리디, 이스케이프 누락 등 흔한 오류를 사례로 제시합니다.
•
ReDoS 방지를 위해 입력 길이 제한, 타임아웃, 안전한 패턴 작성 원칙을 제공합니다.
•
접근성: 입력 유효성 메시지와 ARIA 속성을 함께 안내합니다.
URL 검증 예제

const urlPattern = /^(https?:\/\/)([\w.-]+)(:[0-9]+)?(\/.*)?$/i

function validateUrl(value) {
  if (value.length > 2048) throw new Error('Too long input to avoid ReDoS')
  return urlPattern.test(value)
}

console.log(validateUrl('https://dev-tools.example.com/path?query=1'))
📊
CSV ↔ JSON 데이터 정제
•
헤더 유효성 검사와 BOM 제거 과정을 단계별로 보여줍니다.
•
잘못된 구분자나 따옴표 누락 시 오류 메시지와 수정 방법을 안내합니다.
•
실무 흐름: 변환 → 결측치 확인 → 스키마 매핑 → 업로드까지 순서대로 설명합니다.
•
UTF-8 인코딩, 줄바꿈 혼합(CRLF) 사례를 다루며 해결책을 제시합니다.
파이썬 변환 예제

import csv
import json

def convert(path):
    with open(path, 'r', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        rows = [row for row in reader]
        if not reader.fieldnames:
            raise ValueError('Missing header row')
        return json.dumps(rows, ensure_ascii=False, indent=2)

print(convert('data.csv'))
🗃️
SQL 포맷 & 안전 실행
•
SELECT * 대신 컬럼 지정, LIMIT/WHERE 필수화 등 가독성 규칙을 제시합니다.
•
파라미터 바인딩 예제를 통해 SQL 인젝션을 예방하는 코드를 제공합니다.
•
인덱스 힌트/쿼리 플랜 확인 등 기초 튜닝 포인트를 요약합니다.
•
트랜잭션 사용 시 롤백 전략과 에러 로깅 포맷을 예시로 제시합니다.
Node.js 안전 쿼리 예제

import { Pool } from 'pg'

const pool = new Pool()

async function getUsers(limit = 20) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      'SELECT id, email FROM users WHERE status = $1 ORDER BY created_at DESC LIMIT $2',
      ['active', limit]
    )
    return result.rows
  } finally {
    client.release()
  }
}

getUsers().catch((err) => {
  console.error('query failed', err)
})
콘텐츠 강화 추가 팁
1
각 섹션 끝에 FAQ/오류 사례를 배치해 체류 시간을 늘립니다.

2
실행 가능한 코드 스니펫과 결과 스크린샷(또는 설명)을 함께 둡니다.

3
“이 도구를 쓰면 시간을 얼마나 절약하는가”를 수치로 표현합니다.

4
관련 도구(Regex ↔ JSON validator 등)로 이어지는 내부 링크를 추가합니다.