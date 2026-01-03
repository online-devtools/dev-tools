'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { getSiteBaseUrl } from '@/utils/siteUrl'

// HowTo 스키마의 각 단계 타입 정의
interface HowToStep {
  name: string        // 단계 이름 (예: "텍스트 입력")
  text: string        // 단계 설명 (예: "인코딩할 텍스트를 입력창에 붙여넣으세요")
  image?: string      // 단계별 이미지 URL (선택)
}

interface HowToSchemaProps {
  name: string              // 가이드 제목 (예: "Base64 인코딩 방법")
  description: string       // 가이드 설명
  steps: HowToStep[]        // 단계 배열
  toolPath: string          // 도구 경로 (예: "/base64")
  totalTime?: string        // 총 소요 시간 ISO 8601 형식 (예: "PT2M" = 2분)
}

/**
 * HowToSchema 컴포넌트
 *
 * Schema.org HowTo 구조화된 데이터를 생성합니다.
 * Google 검색 결과에서 단계별 가이드가 리치 스니펫으로 표시됩니다.
 *
 * @example
 * <HowToSchema
 *   name="Base64 인코딩 방법"
 *   description="텍스트를 Base64로 인코딩하는 방법"
 *   toolPath="/base64"
 *   steps={[
 *     { name: "텍스트 입력", text: "인코딩할 텍스트를 입력하세요" },
 *     { name: "인코딩 클릭", text: "Encode 버튼을 클릭하세요" },
 *     { name: "결과 복사", text: "결과를 복사하세요" }
 *   ]}
 * />
 */
export default function HowToSchema({
  name,
  description,
  steps,
  toolPath,
  totalTime = 'PT1M', // 기본 1분
}: HowToSchemaProps) {
  const { language } = useLanguage()
  const siteBaseUrl = getSiteBaseUrl()
  const toolUrl = `${siteBaseUrl}/${language}${toolPath}`

  // Schema.org HowTo 구조 생성
  // https://schema.org/HowTo 스펙 준수
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url: toolUrl,
    // 총 소요 시간 (ISO 8601 duration 형식)
    totalTime,
    // 도구/재료 (웹 도구이므로 브라우저만 필요)
    tool: {
      '@type': 'HowToTool',
      name: 'Web Browser',
    },
    // 각 단계를 HowToStep으로 변환
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${toolUrl}#step-${index + 1}`,
      ...(step.image && { image: step.image }),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
    />
  )
}

// 주요 도구별 HowTo 데이터 사전 정의
// 각 도구 페이지에서 import하여 사용
export const HOWTO_DATA: Record<string, {
  ko: { name: string; description: string; steps: HowToStep[] };
  en: { name: string; description: string; steps: HowToStep[] };
}> = {
  base64: {
    ko: {
      name: 'Base64 인코딩/디코딩 방법',
      description: '텍스트를 Base64로 인코딩하거나 디코딩하는 방법을 알아보세요',
      steps: [
        { name: '텍스트 입력', text: '인코딩 또는 디코딩할 텍스트를 입력창에 붙여넣으세요' },
        { name: '변환 버튼 클릭', text: 'Encode 또는 Decode 버튼을 클릭하세요' },
        { name: '결과 복사', text: '변환된 결과를 복사 버튼으로 클립보드에 저장하세요' },
      ],
    },
    en: {
      name: 'How to Encode/Decode Base64',
      description: 'Learn how to encode or decode text using Base64',
      steps: [
        { name: 'Enter Text', text: 'Paste the text you want to encode or decode into the input field' },
        { name: 'Click Convert', text: 'Click the Encode or Decode button' },
        { name: 'Copy Result', text: 'Copy the converted result to your clipboard using the copy button' },
      ],
    },
  },
  json: {
    ko: {
      name: 'JSON 포맷팅 방법',
      description: 'JSON 데이터를 보기 좋게 포맷하는 방법을 알아보세요',
      steps: [
        { name: 'JSON 입력', text: '포맷할 JSON 데이터를 입력창에 붙여넣으세요' },
        { name: '포맷 버튼 클릭', text: 'Format 버튼을 클릭하세요' },
        { name: '결과 확인', text: '들여쓰기가 적용된 깔끔한 JSON을 확인하세요' },
      ],
    },
    en: {
      name: 'How to Format JSON',
      description: 'Learn how to format JSON data for better readability',
      steps: [
        { name: 'Enter JSON', text: 'Paste the JSON data you want to format into the input field' },
        { name: 'Click Format', text: 'Click the Format button' },
        { name: 'View Result', text: 'View the properly indented and formatted JSON' },
      ],
    },
  },
  jwt: {
    ko: {
      name: 'JWT 토큰 디코딩 방법',
      description: 'JWT 토큰의 헤더와 페이로드를 디코딩하는 방법을 알아보세요',
      steps: [
        { name: 'JWT 토큰 입력', text: 'JWT 토큰을 입력창에 붙여넣으세요' },
        { name: '자동 디코딩 확인', text: '헤더와 페이로드가 자동으로 디코딩됩니다' },
        { name: '만료 시간 확인', text: 'exp 클레임에서 토큰 만료 시간을 확인하세요' },
      ],
    },
    en: {
      name: 'How to Decode JWT Token',
      description: 'Learn how to decode JWT token header and payload',
      steps: [
        { name: 'Enter JWT Token', text: 'Paste your JWT token into the input field' },
        { name: 'View Decoded Data', text: 'The header and payload are automatically decoded' },
        { name: 'Check Expiration', text: 'Check the token expiration time in the exp claim' },
      ],
    },
  },
  uuid: {
    ko: {
      name: 'UUID 생성 방법',
      description: '고유한 UUID를 생성하는 방법을 알아보세요',
      steps: [
        { name: 'UUID 버전 선택', text: 'v1, v4 등 원하는 UUID 버전을 선택하세요' },
        { name: '생성 버튼 클릭', text: 'Generate 버튼을 클릭하세요' },
        { name: 'UUID 복사', text: '생성된 UUID를 복사하여 사용하세요' },
      ],
    },
    en: {
      name: 'How to Generate UUID',
      description: 'Learn how to generate unique UUIDs',
      steps: [
        { name: 'Select UUID Version', text: 'Choose the UUID version you need (v1, v4, etc.)' },
        { name: 'Click Generate', text: 'Click the Generate button' },
        { name: 'Copy UUID', text: 'Copy the generated UUID to use in your project' },
      ],
    },
  },
  hash: {
    ko: {
      name: '해시 생성 방법',
      description: '텍스트의 해시값(MD5, SHA256 등)을 생성하는 방법을 알아보세요',
      steps: [
        { name: '텍스트 입력', text: '해시를 생성할 텍스트를 입력하세요' },
        { name: '알고리즘 선택', text: 'MD5, SHA256, SHA512 등 알고리즘을 선택하세요' },
        { name: '해시값 확인', text: '생성된 해시값을 복사하여 사용하세요' },
      ],
    },
    en: {
      name: 'How to Generate Hash',
      description: 'Learn how to generate hash values (MD5, SHA256, etc.) from text',
      steps: [
        { name: 'Enter Text', text: 'Enter the text you want to hash' },
        { name: 'Select Algorithm', text: 'Choose an algorithm like MD5, SHA256, or SHA512' },
        { name: 'Copy Hash', text: 'Copy the generated hash value' },
      ],
    },
  },
  regex: {
    ko: {
      name: '정규식 테스트 방법',
      description: '정규식 패턴을 테스트하고 매칭 결과를 확인하는 방법을 알아보세요',
      steps: [
        { name: '정규식 입력', text: '테스트할 정규식 패턴을 입력하세요' },
        { name: '테스트 문자열 입력', text: '패턴을 적용할 테스트 문자열을 입력하세요' },
        { name: '매칭 결과 확인', text: '하이라이트된 매칭 결과를 확인하세요' },
      ],
    },
    en: {
      name: 'How to Test Regular Expressions',
      description: 'Learn how to test regex patterns and view matching results',
      steps: [
        { name: 'Enter Regex', text: 'Enter the regular expression pattern to test' },
        { name: 'Enter Test String', text: 'Enter the test string to apply the pattern to' },
        { name: 'View Matches', text: 'View the highlighted matching results' },
      ],
    },
  },
  qrcode: {
    ko: {
      name: 'QR 코드 생성 방법',
      description: 'URL이나 텍스트로 QR 코드를 생성하는 방법을 알아보세요',
      steps: [
        { name: 'URL 또는 텍스트 입력', text: 'QR 코드로 변환할 URL이나 텍스트를 입력하세요' },
        { name: 'QR 코드 생성', text: '자동으로 QR 코드가 생성됩니다' },
        { name: '다운로드', text: 'PNG 또는 SVG 형식으로 QR 코드를 다운로드하세요' },
      ],
    },
    en: {
      name: 'How to Generate QR Code',
      description: 'Learn how to generate QR codes from URLs or text',
      steps: [
        { name: 'Enter URL or Text', text: 'Enter the URL or text to convert to a QR code' },
        { name: 'Generate QR Code', text: 'The QR code is automatically generated' },
        { name: 'Download', text: 'Download the QR code as PNG or SVG' },
      ],
    },
  },
  timestamp: {
    ko: {
      name: '타임스탬프 변환 방법',
      description: 'Unix 타임스탬프를 날짜로 변환하는 방법을 알아보세요',
      steps: [
        { name: '타임스탬프 입력', text: 'Unix 타임스탬프 또는 날짜를 입력하세요' },
        { name: '변환 결과 확인', text: '자동으로 변환된 결과를 확인하세요' },
        { name: '원하는 형식 선택', text: 'ISO 8601, RFC 2822 등 원하는 형식을 선택하세요' },
      ],
    },
    en: {
      name: 'How to Convert Timestamp',
      description: 'Learn how to convert Unix timestamps to dates and vice versa',
      steps: [
        { name: 'Enter Timestamp', text: 'Enter a Unix timestamp or date' },
        { name: 'View Conversion', text: 'View the automatically converted result' },
        { name: 'Select Format', text: 'Choose your preferred format like ISO 8601 or RFC 2822' },
      ],
    },
  },
  color: {
    ko: {
      name: '컬러 코드 변환 방법',
      description: 'HEX, RGB, HSL 등 색상 코드를 변환하는 방법을 알아보세요',
      steps: [
        { name: '색상 코드 입력', text: 'HEX, RGB, HSL 형식의 색상 코드를 입력하세요' },
        { name: '다른 형식 확인', text: '자동으로 다른 형식으로 변환된 결과를 확인하세요' },
        { name: '원하는 형식 복사', text: '필요한 형식의 색상 코드를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Convert Color Codes',
      description: 'Learn how to convert between HEX, RGB, HSL color formats',
      steps: [
        { name: 'Enter Color Code', text: 'Enter a color code in HEX, RGB, or HSL format' },
        { name: 'View Conversions', text: 'View the automatically converted results in other formats' },
        { name: 'Copy Format', text: 'Copy the color code in your preferred format' },
      ],
    },
  },
  url: {
    ko: {
      name: 'URL 인코딩/디코딩 방법',
      description: 'URL을 인코딩하거나 디코딩하는 방법을 알아보세요',
      steps: [
        { name: 'URL 입력', text: '인코딩 또는 디코딩할 URL을 입력하세요' },
        { name: '변환 버튼 클릭', text: 'Encode 또는 Decode 버튼을 클릭하세요' },
        { name: '결과 복사', text: '변환된 URL을 복사하세요' },
      ],
    },
    en: {
      name: 'How to Encode/Decode URL',
      description: 'Learn how to encode or decode URLs',
      steps: [
        { name: 'Enter URL', text: 'Enter the URL to encode or decode' },
        { name: 'Click Convert', text: 'Click the Encode or Decode button' },
        { name: 'Copy Result', text: 'Copy the converted URL' },
      ],
    },
  },
  semver: {
    ko: {
      name: 'SemVer 버전 비교 및 정렬 방법',
      description: 'Semantic Versioning 규칙으로 버전을 비교하고 정렬하는 방법을 알아보세요',
      steps: [
        { name: '버전 입력', text: '비교할 두 버전(예: 1.2.3, 2.0.0-beta)을 입력하세요' },
        { name: '비교 버튼 클릭', text: '비교 버튼을 클릭하여 어느 버전이 더 높은지 확인하세요' },
        { name: '버전 목록 정렬', text: '여러 버전을 한 줄씩 입력하고 오름차순/내림차순으로 정렬하세요' },
      ],
    },
    en: {
      name: 'How to Compare and Sort SemVer Versions',
      description: 'Learn how to compare and sort versions using Semantic Versioning rules',
      steps: [
        { name: 'Enter Versions', text: 'Enter two versions to compare (e.g., 1.2.3, 2.0.0-beta)' },
        { name: 'Click Compare', text: 'Click the Compare button to see which version is higher' },
        { name: 'Sort Version List', text: 'Enter multiple versions (one per line) and sort them in ascending or descending order' },
      ],
    },
  },
  bcrypt: {
    ko: {
      name: 'Bcrypt 해시 생성 및 검증 방법',
      description: '비밀번호를 bcrypt로 해시하고 검증하는 방법을 알아보세요',
      steps: [
        { name: '비밀번호 입력', text: '해시할 비밀번호를 입력하세요' },
        { name: '해시 생성', text: 'Hash 버튼을 클릭하여 bcrypt 해시를 생성하세요' },
        { name: '검증', text: '원본 비밀번호와 해시를 입력하여 일치 여부를 확인하세요' },
      ],
    },
    en: {
      name: 'How to Generate and Verify Bcrypt Hash',
      description: 'Learn how to hash and verify passwords using bcrypt',
      steps: [
        { name: 'Enter Password', text: 'Enter the password to hash' },
        { name: 'Generate Hash', text: 'Click the Hash button to generate a bcrypt hash' },
        { name: 'Verify', text: 'Enter the original password and hash to verify matching' },
      ],
    },
  },
  htmlEntities: {
    ko: {
      name: 'HTML 엔티티 인코딩/디코딩 방법',
      description: 'HTML 특수 문자를 엔티티로 변환하거나 원래대로 복원하는 방법을 알아보세요',
      steps: [
        { name: 'HTML 입력', text: '변환할 HTML 또는 엔티티를 입력하세요' },
        { name: '변환 선택', text: 'Encode 또는 Decode 버튼을 클릭하세요' },
        { name: '결과 복사', text: '변환된 결과를 복사하여 사용하세요' },
      ],
    },
    en: {
      name: 'How to Encode/Decode HTML Entities',
      description: 'Learn how to convert HTML special characters to entities and vice versa',
      steps: [
        { name: 'Enter HTML', text: 'Enter the HTML or entities to convert' },
        { name: 'Select Conversion', text: 'Click the Encode or Decode button' },
        { name: 'Copy Result', text: 'Copy the converted result to use' },
      ],
    },
  },
  csv: {
    ko: {
      name: 'CSV 포맷팅 및 변환 방법',
      description: 'CSV 데이터를 포맷하거나 JSON으로 변환하는 방법을 알아보세요',
      steps: [
        { name: 'CSV 입력', text: 'CSV 데이터를 입력하세요' },
        { name: '포맷 선택', text: '원하는 형식(포맷, JSON 변환)을 선택하세요' },
        { name: '결과 확인', text: '변환된 결과를 확인하고 복사하세요' },
      ],
    },
    en: {
      name: 'How to Format and Convert CSV',
      description: 'Learn how to format CSV data or convert it to JSON',
      steps: [
        { name: 'Enter CSV', text: 'Enter your CSV data' },
        { name: 'Select Format', text: 'Choose your desired format (format, JSON conversion)' },
        { name: 'View Result', text: 'View and copy the converted result' },
      ],
    },
  },
  cron: {
    ko: {
      name: 'Cron 표현식 생성 및 검증 방법',
      description: 'Cron 표현식을 생성하거나 해석하는 방법을 알아보세요',
      steps: [
        { name: 'Cron 입력', text: 'Cron 표현식을 입력하거나 시간을 선택하세요' },
        { name: '표현식 확인', text: 'Cron 표현식이 자동으로 생성됩니다' },
        { name: '다음 실행 시간 확인', text: '다음 실행 시간을 확인하세요' },
      ],
    },
    en: {
      name: 'How to Generate and Validate Cron Expressions',
      description: 'Learn how to generate or interpret cron expressions',
      steps: [
        { name: 'Enter Cron', text: 'Enter a cron expression or select time' },
        { name: 'Verify Expression', text: 'The cron expression is automatically generated' },
        { name: 'Check Next Run', text: 'View the next execution times' },
      ],
    },
  },
  ipcalc: {
    ko: {
      name: 'IP 주소 계산 방법',
      description: 'IP 주소와 서브넷을 계산하는 방법을 알아보세요',
      steps: [
        { name: 'IP 입력', text: 'IP 주소와 CIDR를 입력하세요 (예: 192.168.1.0/24)' },
        { name: '계산', text: '자동으로 서브넷 정보가 계산됩니다' },
        { name: '결과 확인', text: '네트워크 주소, 브로드캐스트, 호스트 범위를 확인하세요' },
      ],
    },
    en: {
      name: 'How to Calculate IP Addresses',
      description: 'Learn how to calculate IP addresses and subnets',
      steps: [
        { name: 'Enter IP', text: 'Enter IP address with CIDR (e.g., 192.168.1.0/24)' },
        { name: 'Calculate', text: 'Subnet information is calculated automatically' },
        { name: 'View Results', text: 'View network address, broadcast, and host range' },
      ],
    },
  },
  diff: {
    ko: {
      name: '텍스트 비교 방법',
      description: '두 텍스트의 차이점을 시각적으로 비교하는 방법을 알아보세요',
      steps: [
        { name: '텍스트 입력', text: '비교할 두 텍스트를 각각 입력하세요' },
        { name: '비교 실행', text: 'Compare 버튼을 클릭하세요' },
        { name: '차이점 확인', text: '추가, 삭제, 변경된 부분을 색상으로 확인하세요' },
      ],
    },
    en: {
      name: 'How to Compare Text Differences',
      description: 'Learn how to visually compare differences between two texts',
      steps: [
        { name: 'Enter Texts', text: 'Enter the two texts to compare' },
        { name: 'Run Comparison', text: 'Click the Compare button' },
        { name: 'View Differences', text: 'View additions, deletions, and changes in color' },
      ],
    },
  },
  lorem: {
    ko: {
      name: 'Lorem Ipsum 생성 방법',
      description: '더미 텍스트를 생성하는 방법을 알아보세요',
      steps: [
        { name: '길이 선택', text: '생성할 단어, 문장 또는 단락 수를 선택하세요' },
        { name: '생성', text: 'Generate 버튼을 클릭하세요' },
        { name: '복사', text: '생성된 Lorem Ipsum 텍스트를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Generate Lorem Ipsum',
      description: 'Learn how to generate placeholder text',
      steps: [
        { name: 'Select Length', text: 'Choose the number of words, sentences, or paragraphs' },
        { name: 'Generate', text: 'Click the Generate button' },
        { name: 'Copy', text: 'Copy the generated Lorem Ipsum text' },
      ],
    },
  },
  case: {
    ko: {
      name: '텍스트 케이스 변환 방법',
      description: '텍스트를 다양한 케이스로 변환하는 방법을 알아보세요',
      steps: [
        { name: '텍스트 입력', text: '변환할 텍스트를 입력하세요' },
        { name: '케이스 선택', text: 'camelCase, snake_case, UPPER_CASE 등을 선택하세요' },
        { name: '결과 복사', text: '변환된 텍스트를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Convert Text Case',
      description: 'Learn how to convert text to various cases',
      steps: [
        { name: 'Enter Text', text: 'Enter the text to convert' },
        { name: 'Select Case', text: 'Choose camelCase, snake_case, UPPER_CASE, etc.' },
        { name: 'Copy Result', text: 'Copy the converted text' },
      ],
    },
  },
  slugify: {
    ko: {
      name: 'URL Slug 생성 방법',
      description: '텍스트를 URL 친화적인 slug로 변환하는 방법을 알아보세요',
      steps: [
        { name: '텍스트 입력', text: 'slug로 변환할 텍스트를 입력하세요' },
        { name: '자동 변환', text: '자동으로 URL 친화적 형식으로 변환됩니다' },
        { name: '옵션 조정', text: '구분자, 대소문자 등의 옵션을 조정하세요' },
      ],
    },
    en: {
      name: 'How to Generate URL Slugs',
      description: 'Learn how to convert text to URL-friendly slugs',
      steps: [
        { name: 'Enter Text', text: 'Enter the text to convert to a slug' },
        { name: 'Auto Convert', text: 'The text is automatically converted to URL-friendly format' },
        { name: 'Adjust Options', text: 'Adjust separator, case, and other options' },
      ],
    },
  },
  chmod: {
    ko: {
      name: 'Chmod 권한 계산 방법',
      description: 'Unix 파일 권한을 숫자와 기호로 변환하는 방법을 알아보세요',
      steps: [
        { name: '권한 선택', text: '소유자, 그룹, 기타 사용자의 권한을 선택하세요' },
        { name: '숫자 확인', text: '자동으로 계산된 chmod 숫자를 확인하세요' },
        { name: '명령어 복사', text: '생성된 chmod 명령어를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Calculate Chmod Permissions',
      description: 'Learn how to convert Unix file permissions between numeric and symbolic',
      steps: [
        { name: 'Select Permissions', text: 'Choose permissions for owner, group, and others' },
        { name: 'View Number', text: 'View the automatically calculated chmod number' },
        { name: 'Copy Command', text: 'Copy the generated chmod command' },
      ],
    },
  },
  password: {
    ko: {
      name: '강력한 비밀번호 생성 방법',
      description: '안전한 비밀번호를 생성하는 방법을 알아보세요',
      steps: [
        { name: '길이 설정', text: '비밀번호 길이를 16자 이상으로 설정하세요' },
        { name: '옵션 선택', text: '대문자, 소문자, 숫자, 특수문자를 포함하도록 선택하세요' },
        { name: '생성 및 복사', text: 'Generate 버튼을 클릭하고 생성된 비밀번호를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Generate Strong Password',
      description: 'Learn how to generate secure passwords',
      steps: [
        { name: 'Set Length', text: 'Set password length to 16 characters or more' },
        { name: 'Select Options', text: 'Include uppercase, lowercase, numbers, and symbols' },
        { name: 'Generate & Copy', text: 'Click Generate button and copy the password' },
      ],
    },
  },
  yamlJson: {
    ko: {
      name: 'YAML과 JSON 상호 변환 방법',
      description: 'YAML을 JSON으로, JSON을 YAML로 변환하는 방법을 알아보세요',
      steps: [
        { name: '데이터 입력', text: 'YAML 또는 JSON 데이터를 입력창에 붙여넣으세요' },
        { name: '변환 선택', text: 'YAML→JSON 또는 JSON→YAML 버튼을 클릭하세요' },
        { name: '결과 복사', text: '변환된 결과를 복사 버튼으로 저장하세요' },
      ],
    },
    en: {
      name: 'How to Convert Between YAML and JSON',
      description: 'Learn how to convert YAML to JSON and vice versa',
      steps: [
        { name: 'Enter Data', text: 'Paste YAML or JSON data into the input field' },
        { name: 'Select Conversion', text: 'Click YAML→JSON or JSON→YAML button' },
        { name: 'Copy Result', text: 'Copy the converted result' },
      ],
    },
  },
  xmlJson: {
    ko: {
      name: 'XML과 JSON 상호 변환 방법',
      description: 'XML을 JSON으로, JSON을 XML로 변환하는 방법을 알아보세요',
      steps: [
        { name: '데이터 입력', text: 'XML 또는 JSON 데이터를 입력창에 붙여넣으세요' },
        { name: '변환 선택', text: 'XML→JSON 또는 JSON→XML 버튼을 클릭하세요' },
        { name: '결과 복사', text: '변환된 결과를 복사하여 사용하세요' },
      ],
    },
    en: {
      name: 'How to Convert Between XML and JSON',
      description: 'Learn how to convert XML to JSON and vice versa',
      steps: [
        { name: 'Enter Data', text: 'Paste XML or JSON data into the input field' },
        { name: 'Select Conversion', text: 'Click XML→JSON or JSON→XML button' },
        { name: 'Copy Result', text: 'Copy the converted result' },
      ],
    },
  },
  markdownHtml: {
    ko: {
      name: 'Markdown을 HTML로 변환하는 방법',
      description: 'Markdown 문법을 HTML로 변환하는 방법을 알아보세요',
      steps: [
        { name: 'Markdown 입력', text: 'Markdown 문법으로 작성된 텍스트를 입력하세요' },
        { name: '미리보기', text: 'HTML 미리보기를 확인하세요' },
        { name: 'HTML 복사', text: '변환된 HTML 코드를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Convert Markdown to HTML',
      description: 'Learn how to convert Markdown syntax to HTML',
      steps: [
        { name: 'Enter Markdown', text: 'Enter text written in Markdown syntax' },
        { name: 'Preview', text: 'Check the HTML preview' },
        { name: 'Copy HTML', text: 'Copy the converted HTML code' },
      ],
    },
  },
  basicAuth: {
    ko: {
      name: 'Basic Auth 헤더 생성 방법',
      description: 'HTTP Basic Authentication 헤더를 생성하는 방법을 알아보세요',
      steps: [
        { name: '인증 정보 입력', text: '사용자명과 비밀번호를 입력하세요' },
        { name: '헤더 생성', text: 'Generate 버튼을 클릭하세요' },
        { name: '헤더 복사', text: '생성된 Authorization 헤더를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Generate Basic Auth Header',
      description: 'Learn how to generate HTTP Basic Authentication header',
      steps: [
        { name: 'Enter Credentials', text: 'Enter username and password' },
        { name: 'Generate Header', text: 'Click the Generate button' },
        { name: 'Copy Header', text: 'Copy the generated Authorization header' },
      ],
    },
  },
  hmac: {
    ko: {
      name: 'HMAC 해시 생성 방법',
      description: '메시지와 시크릿 키로 HMAC을 생성하는 방법을 알아보세요',
      steps: [
        { name: '메시지 입력', text: '해시할 메시지를 입력하세요' },
        { name: '시크릿 키 입력', text: '시크릿 키를 입력하고 알고리즘을 선택하세요' },
        { name: 'HMAC 생성', text: 'Generate 버튼을 클릭하여 HMAC을 생성하고 복사하세요' },
      ],
    },
    en: {
      name: 'How to Generate HMAC Hash',
      description: 'Learn how to generate HMAC with message and secret key',
      steps: [
        { name: 'Enter Message', text: 'Enter the message to hash' },
        { name: 'Enter Secret Key', text: 'Enter secret key and select algorithm' },
        { name: 'Generate HMAC', text: 'Click Generate button to create and copy HMAC' },
      ],
    },
  },
  otp: {
    ko: {
      name: 'OTP 생성 및 검증 방법',
      description: 'TOTP 기반 일회용 비밀번호를 생성하고 검증하는 방법을 알아보세요',
      steps: [
        { name: '시크릿 생성', text: 'Generate Secret 버튼으로 시크릿 키를 생성하세요' },
        { name: 'OTP 생성', text: 'Generate Token 버튼으로 6자리 OTP를 생성하세요' },
        { name: 'OTP 검증', text: '시크릿 키와 토큰을 입력하여 유효성을 검증하세요' },
      ],
    },
    en: {
      name: 'How to Generate and Verify OTP',
      description: 'Learn how to generate and verify TOTP-based one-time password',
      steps: [
        { name: 'Generate Secret', text: 'Click Generate Secret button to create secret key' },
        { name: 'Generate OTP', text: 'Click Generate Token button to create 6-digit OTP' },
        { name: 'Verify OTP', text: 'Enter secret key and token to verify validity' },
      ],
    },
  },
  ulid: {
    ko: {
      name: 'ULID 생성 방법',
      description: '정렬 가능한 고유 식별자 ULID를 생성하는 방법을 알아보세요',
      steps: [
        { name: '개수 입력', text: '생성할 ULID 개수를 입력하세요 (1-1000)' },
        { name: 'ULID 생성', text: 'Generate 버튼을 클릭하세요' },
        { name: '결과 복사', text: '생성된 ULID를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Generate ULID',
      description: 'Learn how to generate sortable unique identifier ULID',
      steps: [
        { name: 'Enter Count', text: 'Enter number of ULIDs to generate (1-1000)' },
        { name: 'Generate ULID', text: 'Click the Generate button' },
        { name: 'Copy Result', text: 'Copy the generated ULIDs' },
      ],
    },
  },
  jsonToml: {
    ko: {
      name: 'JSON과 TOML 상호 변환 방법',
      description: 'JSON을 TOML로, TOML을 JSON으로 변환하는 방법을 알아보세요',
      steps: [
        { name: '데이터 입력', text: 'JSON 또는 TOML 데이터를 입력창에 붙여넣으세요' },
        { name: '변환 선택', text: 'JSON→TOML 또는 TOML→JSON 버튼을 클릭하세요' },
        { name: '결과 복사', text: '변환된 결과를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Convert Between JSON and TOML',
      description: 'Learn how to convert JSON to TOML and vice versa',
      steps: [
        { name: 'Enter Data', text: 'Paste JSON or TOML data into the input field' },
        { name: 'Select Conversion', text: 'Click JSON→TOML or TOML→JSON button' },
        { name: 'Copy Result', text: 'Copy the converted result' },
      ],
    },
  },
  base64File: {
    ko: {
      name: '파일 Base64 변환 방법',
      description: '파일을 Base64로 인코딩하거나 Base64를 파일로 디코딩하는 방법을 알아보세요',
      steps: [
        { name: '파일 선택', text: '변환할 파일을 업로드하세요' },
        { name: 'Base64 확인', text: '생성된 Base64 문자열을 확인하세요' },
        { name: '결과 복사', text: 'Base64 문자열을 복사하거나 파일로 다운로드하세요' },
      ],
    },
    en: {
      name: 'How to Convert File to Base64',
      description: 'Learn how to encode file to Base64 or decode Base64 to file',
      steps: [
        { name: 'Select File', text: 'Upload the file to convert' },
        { name: 'View Base64', text: 'View the generated Base64 string' },
        { name: 'Copy Result', text: 'Copy Base64 string or download as file' },
      ],
    },
  },
  jwtSigner: {
    ko: {
      name: 'JWT 토큰 서명 방법',
      description: 'JWT 토큰을 생성하고 서명하는 방법을 알아보세요',
      steps: [
        { name: '페이로드 입력', text: 'JWT 페이로드 데이터를 JSON 형식으로 입력하세요' },
        { name: '시크릿 키 입력', text: '서명에 사용할 시크릿 키를 입력하세요' },
        { name: 'JWT 생성', text: 'Sign 버튼을 클릭하여 서명된 JWT를 생성하고 복사하세요' },
      ],
    },
    en: {
      name: 'How to Sign JWT Token',
      description: 'Learn how to create and sign JWT tokens',
      steps: [
        { name: 'Enter Payload', text: 'Enter JWT payload data in JSON format' },
        { name: 'Enter Secret', text: 'Enter the secret key for signing' },
        { name: 'Generate JWT', text: 'Click Sign button to create and copy signed JWT' },
      ],
    },
  },
  userAgent: {
    ko: {
      name: 'User Agent 분석 방법',
      description: 'User Agent 문자열을 파싱하여 브라우저와 OS 정보를 확인하는 방법을 알아보세요',
      steps: [
        { name: 'User Agent 입력', text: 'User Agent 문자열을 입력하세요' },
        { name: '자동 파싱', text: '브라우저, OS, 디바이스 정보가 자동으로 파싱됩니다' },
        { name: '결과 확인', text: '파싱된 정보를 확인하세요' },
      ],
    },
    en: {
      name: 'How to Parse User Agent',
      description: 'Learn how to parse User Agent string to identify browser and OS',
      steps: [
        { name: 'Enter User Agent', text: 'Enter the User Agent string' },
        { name: 'Auto Parse', text: 'Browser, OS, and device info are parsed automatically' },
        { name: 'View Results', text: 'View the parsed information' },
      ],
    },
  },
  jsonMinify: {
    ko: {
      name: 'JSON 압축 방법',
      description: 'JSON을 압축하여 공백을 제거하는 방법을 알아보세요',
      steps: [
        { name: 'JSON 입력', text: '압축할 JSON 데이터를 입력하세요' },
        { name: 'Minify 버튼 클릭', text: 'Minify 버튼을 클릭하세요' },
        { name: '압축된 JSON 복사', text: '공백이 제거된 JSON을 복사하세요' },
      ],
    },
    en: {
      name: 'How to Minify JSON',
      description: 'Learn how to minify JSON by removing whitespace',
      steps: [
        { name: 'Enter JSON', text: 'Enter the JSON data to minify' },
        { name: 'Click Minify', text: 'Click the Minify button' },
        { name: 'Copy Minified JSON', text: 'Copy the JSON with whitespace removed' },
      ],
    },
  },
  urlParser: {
    ko: {
      name: 'URL 파싱 방법',
      description: 'URL을 구성 요소별로 분해하여 분석하는 방법을 알아보세요',
      steps: [
        { name: 'URL 입력', text: '파싱할 URL을 입력하세요' },
        { name: '자동 파싱', text: '프로토콜, 호스트, 경로, 쿼리 파라미터가 자동으로 파싱됩니다' },
        { name: '결과 확인', text: '각 구성 요소를 확인하고 복사하세요' },
      ],
    },
    en: {
      name: 'How to Parse URL',
      description: 'Learn how to parse URL into its components',
      steps: [
        { name: 'Enter URL', text: 'Enter the URL to parse' },
        { name: 'Auto Parse', text: 'Protocol, host, path, and query params are parsed automatically' },
        { name: 'View Results', text: 'View and copy each component' },
      ],
    },
  },
  passwordStrength: {
    ko: {
      name: '비밀번호 강도 확인 방법',
      description: '비밀번호의 강도를 분석하고 개선 방법을 확인하는 방법을 알아보세요',
      steps: [
        { name: '비밀번호 입력', text: '확인할 비밀번호를 입력하세요' },
        { name: '강도 확인', text: '강도 점수와 예상 크랙 시간을 확인하세요' },
        { name: '개선 방법 확인', text: '더 강력한 비밀번호를 위한 제안을 확인하세요' },
      ],
    },
    en: {
      name: 'How to Check Password Strength',
      description: 'Learn how to analyze password strength and get improvement suggestions',
      steps: [
        { name: 'Enter Password', text: 'Enter the password to check' },
        { name: 'View Strength', text: 'View the strength score and estimated crack time' },
        { name: 'View Suggestions', text: 'View suggestions for a stronger password' },
      ],
    },
  },
  imageBase64: {
    ko: {
      name: '이미지 Base64 변환 방법',
      description: '이미지를 Base64로 인코딩하거나 디코딩하는 방법을 알아보세요',
      steps: [
        { name: '이미지 업로드', text: '변환할 이미지 파일을 업로드하세요' },
        { name: 'Base64 확인', text: '생성된 Base64 문자열과 미리보기를 확인하세요' },
        { name: '결과 복사', text: 'Base64 문자열을 복사하여 사용하세요' },
      ],
    },
    en: {
      name: 'How to Convert Image to Base64',
      description: 'Learn how to encode image to Base64 or decode Base64 to image',
      steps: [
        { name: 'Upload Image', text: 'Upload the image file to convert' },
        { name: 'View Base64', text: 'View the generated Base64 string and preview' },
        { name: 'Copy Result', text: 'Copy the Base64 string to use' },
      ],
    },
  },
  httpStatus: {
    ko: {
      name: 'HTTP 상태 코드 조회 방법',
      description: 'HTTP 상태 코드의 의미를 검색하고 확인하는 방법을 알아보세요',
      steps: [
        { name: '상태 코드 입력', text: '조회할 HTTP 상태 코드를 입력하세요 (예: 404)' },
        { name: '설명 확인', text: '상태 코드의 의미와 설명을 확인하세요' },
        { name: '카테고리 탐색', text: '2xx, 4xx, 5xx 등 카테고리별로 탐색하세요' },
      ],
    },
    en: {
      name: 'How to Look Up HTTP Status Codes',
      description: 'Learn how to search and view HTTP status code meanings',
      steps: [
        { name: 'Enter Status Code', text: 'Enter the HTTP status code to look up (e.g., 404)' },
        { name: 'View Description', text: 'View the meaning and description of the status code' },
        { name: 'Browse Categories', text: 'Browse by category like 2xx, 4xx, 5xx' },
      ],
    },
  },
  baseconv: {
    ko: {
      name: '진법 변환 방법',
      description: '숫자를 2진수, 8진수, 10진수, 16진수로 변환하는 방법을 알아보세요',
      steps: [
        { name: '숫자 입력', text: '변환할 숫자를 입력하세요' },
        { name: '입력 진법 선택', text: '입력한 숫자의 진법을 선택하세요' },
        { name: '변환 결과 확인', text: '다른 진법으로 변환된 결과를 확인하고 복사하세요' },
      ],
    },
    en: {
      name: 'How to Convert Number Bases',
      description: 'Learn how to convert numbers between binary, octal, decimal, and hexadecimal',
      steps: [
        { name: 'Enter Number', text: 'Enter the number to convert' },
        { name: 'Select Input Base', text: 'Select the base of the input number' },
        { name: 'View Conversions', text: 'View and copy the converted results in other bases' },
      ],
    },
  },
  textStats: {
    ko: {
      name: '텍스트 통계 확인 방법',
      description: '텍스트의 문자 수, 단어 수, 줄 수를 확인하는 방법을 알아보세요',
      steps: [
        { name: '텍스트 입력', text: '분석할 텍스트를 입력하세요' },
        { name: '통계 확인', text: '문자 수, 단어 수, 줄 수가 실시간으로 계산됩니다' },
        { name: '상세 정보 확인', text: '평균 단어 길이, 읽기 시간 등 상세 정보를 확인하세요' },
      ],
    },
    en: {
      name: 'How to Check Text Statistics',
      description: 'Learn how to count characters, words, and lines in text',
      steps: [
        { name: 'Enter Text', text: 'Enter the text to analyze' },
        { name: 'View Statistics', text: 'Character, word, and line counts are calculated in real-time' },
        { name: 'View Details', text: 'View detailed info like average word length and reading time' },
      ],
    },
  },
  jsonPath: {
    ko: {
      name: 'JSON 경로 검색 방법',
      description: 'JSONPath로 JSON 데이터를 쿼리하는 방법을 알아보세요',
      steps: [
        { name: 'JSON 입력', text: '검색할 JSON 데이터를 입력하세요' },
        { name: 'JSONPath 입력', text: 'JSONPath 표현식을 입력하세요 (예: $.users[0].name)' },
        { name: '결과 확인', text: '매칭된 값을 확인하고 복사하세요' },
      ],
    },
    en: {
      name: 'How to Search JSON with JSONPath',
      description: 'Learn how to query JSON data using JSONPath',
      steps: [
        { name: 'Enter JSON', text: 'Enter the JSON data to search' },
        { name: 'Enter JSONPath', text: 'Enter JSONPath expression (e.g., $.users[0].name)' },
        { name: 'View Results', text: 'View and copy the matched values' },
      ],
    },
  },
  regexDebugger: {
    ko: {
      name: '정규식 디버깅 방법',
      description: '정규식 패턴을 테스트하고 디버깅하는 방법을 알아보세요',
      steps: [
        { name: '정규식 입력', text: '테스트할 정규식 패턴을 입력하세요' },
        { name: '테스트 문자열 입력', text: '매칭을 확인할 테스트 문자열을 입력하세요' },
        { name: '결과 분석', text: '매칭 결과와 캡처 그룹을 확인하세요' },
      ],
    },
    en: {
      name: 'How to Debug Regular Expressions',
      description: 'Learn how to test and debug regex patterns',
      steps: [
        { name: 'Enter Regex', text: 'Enter the regex pattern to test' },
        { name: 'Enter Test String', text: 'Enter test string to check matches' },
        { name: 'Analyze Results', text: 'View matching results and capture groups' },
      ],
    },
  },
  sqlBuilder: {
    ko: {
      name: 'SQL 쿼리 생성 방법',
      description: 'GUI로 SQL 쿼리를 생성하는 방법을 알아보세요',
      steps: [
        { name: '쿼리 타입 선택', text: 'SELECT, INSERT, UPDATE, DELETE 중 선택하세요' },
        { name: '테이블과 컬럼 설정', text: '대상 테이블과 컬럼을 선택하세요' },
        { name: 'SQL 생성', text: '생성된 SQL 쿼리를 확인하고 복사하세요' },
      ],
    },
    en: {
      name: 'How to Build SQL Queries',
      description: 'Learn how to generate SQL queries using GUI',
      steps: [
        { name: 'Select Query Type', text: 'Choose SELECT, INSERT, UPDATE, or DELETE' },
        { name: 'Set Tables and Columns', text: 'Select target tables and columns' },
        { name: 'Generate SQL', text: 'View and copy the generated SQL query' },
      ],
    },
  },
  gitignoreGenerator: {
    ko: {
      name: '.gitignore 파일 생성 방법',
      description: '프로젝트에 맞는 .gitignore 파일을 생성하는 방법을 알아보세요',
      steps: [
        { name: '기술 스택 선택', text: '사용하는 언어와 프레임워크를 선택하세요' },
        { name: '추가 패턴 입력', text: '커스텀 제외 패턴을 추가하세요' },
        { name: '.gitignore 생성', text: '생성된 .gitignore 파일을 복사하세요' },
      ],
    },
    en: {
      name: 'How to Generate .gitignore File',
      description: 'Learn how to create .gitignore file for your project',
      steps: [
        { name: 'Select Tech Stack', text: 'Choose languages and frameworks you use' },
        { name: 'Add Custom Patterns', text: 'Add custom exclusion patterns' },
        { name: 'Generate .gitignore', text: 'Copy the generated .gitignore file' },
      ],
    },
  },
  envManager: {
    ko: {
      name: '환경변수 관리 방법',
      description: '.env 파일을 관리하고 변환하는 방법을 알아보세요',
      steps: [
        { name: '환경변수 입력', text: 'KEY=VALUE 형식으로 환경변수를 입력하세요' },
        { name: '포맷 선택', text: '변환할 형식을 선택하세요 (JSON, YAML 등)' },
        { name: '결과 복사', text: '변환된 환경변수를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Manage Environment Variables',
      description: 'Learn how to manage and convert .env files',
      steps: [
        { name: 'Enter Variables', text: 'Enter environment variables in KEY=VALUE format' },
        { name: 'Select Format', text: 'Choose output format (JSON, YAML, etc.)' },
        { name: 'Copy Result', text: 'Copy the converted environment variables' },
      ],
    },
  },
  mockData: {
    ko: {
      name: 'Mock 데이터 생성 방법',
      description: '테스트용 가짜 데이터를 생성하는 방법을 알아보세요',
      steps: [
        { name: '데이터 타입 선택', text: '생성할 데이터 타입을 선택하세요 (이름, 이메일 등)' },
        { name: '개수 설정', text: '생성할 데이터 개수를 설정하세요' },
        { name: '데이터 생성', text: 'Generate 버튼을 클릭하여 Mock 데이터를 생성하세요' },
      ],
    },
    en: {
      name: 'How to Generate Mock Data',
      description: 'Learn how to create fake data for testing',
      steps: [
        { name: 'Select Data Type', text: 'Choose data type to generate (name, email, etc.)' },
        { name: 'Set Count', text: 'Set the number of records to generate' },
        { name: 'Generate Data', text: 'Click Generate button to create mock data' },
      ],
    },
  },
  sorter: {
    ko: {
      name: '텍스트 정렬 방법',
      description: '텍스트 줄을 정렬하는 방법을 알아보세요',
      steps: [
        { name: '텍스트 입력', text: '정렬할 텍스트를 한 줄씩 입력하세요' },
        { name: '정렬 옵션 선택', text: '오름차순/내림차순, 대소문자 구분 여부를 선택하세요' },
        { name: '정렬 실행', text: 'Sort 버튼을 클릭하여 정렬된 결과를 확인하세요' },
      ],
    },
    en: {
      name: 'How to Sort Text Lines',
      description: 'Learn how to sort text lines',
      steps: [
        { name: 'Enter Text', text: 'Enter text to sort, one line at a time' },
        { name: 'Select Options', text: 'Choose ascending/descending and case sensitivity' },
        { name: 'Sort', text: 'Click Sort button to view sorted results' },
      ],
    },
  },
  yamlToml: {
    ko: {
      name: 'YAML과 TOML 변환 방법',
      description: 'YAML을 TOML로, TOML을 YAML로 변환하는 방법을 알아보세요',
      steps: [
        { name: '데이터 입력', text: 'YAML 또는 TOML 데이터를 입력하세요' },
        { name: '변환 방향 선택', text: 'YAML→TOML 또는 TOML→YAML 버튼을 클릭하세요' },
        { name: '결과 복사', text: '변환된 결과를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Convert Between YAML and TOML',
      description: 'Learn how to convert YAML to TOML and vice versa',
      steps: [
        { name: 'Enter Data', text: 'Enter YAML or TOML data' },
        { name: 'Select Direction', text: 'Click YAML→TOML or TOML→YAML button' },
        { name: 'Copy Result', text: 'Copy the converted result' },
      ],
    },
  },
  deviceInfo: {
    ko: {
      name: '디바이스 정보 확인 방법',
      description: '브라우저와 디바이스 정보를 확인하는 방법을 알아보세요',
      steps: [
        { name: '페이지 접속', text: '디바이스 정보 도구 페이지에 접속하세요' },
        { name: '정보 확인', text: '자동으로 감지된 브라우저, OS, 화면 정보를 확인하세요' },
        { name: '정보 복사', text: '필요한 정보를 복사하여 사용하세요' },
      ],
    },
    en: {
      name: 'How to Check Device Information',
      description: 'Learn how to view browser and device information',
      steps: [
        { name: 'Access Page', text: 'Access the device info tool page' },
        { name: 'View Info', text: 'View automatically detected browser, OS, and screen info' },
        { name: 'Copy Info', text: 'Copy the information you need' },
      ],
    },
  },
  'bson': {
    ko: {
      name: 'BSON 변환 방법',
      description: 'JSON을 BSON으로, BSON을 JSON으로 변환하는 방법을 알아보세요',
      steps: [
        { name: 'JSON 입력', text: '변환할 JSON 데이터를 입력하세요' },
        { name: 'BSON 변환', text: 'Convert to BSON 버튼을 클릭하세요' },
        { name: '결과 확인', text: 'BSON 바이너리 또는 Hex 표현을 확인하세요' },
      ],
    },
    en: {
      name: 'How to Convert BSON',
      description: 'Learn how to convert between JSON and BSON',
      steps: [
        { name: 'Enter JSON', text: 'Enter JSON data to convert' },
        { name: 'Convert to BSON', text: 'Click Convert to BSON button' },
        { name: 'View Result', text: 'View BSON binary or Hex representation' },
      ],
    },
  },
  markdownTable: {
    ko: {
      name: 'Markdown 테이블 생성 방법',
      description: 'Markdown 형식의 테이블을 생성하는 방법을 알아보세요',
      steps: [
        { name: '테이블 크기 설정', text: '행과 열의 개수를 설정하세요' },
        { name: '데이터 입력', text: '각 셀에 데이터를 입력하세요' },
        { name: 'Markdown 생성', text: '생성된 Markdown 테이블을 복사하세요' },
      ],
    },
    en: {
      name: 'How to Create Markdown Table',
      description: 'Learn how to generate Markdown tables',
      steps: [
        { name: 'Set Table Size', text: 'Set the number of rows and columns' },
        { name: 'Enter Data', text: 'Enter data in each cell' },
        { name: 'Generate Markdown', text: 'Copy the generated Markdown table' },
      ],
    },
  },
  dataUrl: {
    ko: {
      name: 'Data URL 변환 방법',
      description: '파일을 Data URL로 변환하거나 Data URL을 파일로 다운로드하는 방법을 알아보세요',
      steps: [
        { name: '파일 선택', text: '변환할 파일을 선택하세요' },
        { name: 'Data URL 확인', text: '생성된 Data URL을 확인하고 복사하세요' },
        { name: '파일 다운로드', text: 'Data URL을 붙여넣어 파일로 다운로드하세요' },
      ],
    },
    en: {
      name: 'How to Convert Data URL',
      description: 'Learn how to convert files to Data URL or download Data URL as files',
      steps: [
        { name: 'Select File', text: 'Select the file to convert' },
        { name: 'View Data URL', text: 'View and copy the generated Data URL' },
        { name: 'Download File', text: 'Paste Data URL to download as file' },
      ],
    },
  },
  tempConverter: {
    ko: {
      name: '온도 변환 방법',
      description: '섭씨, 화씨, 켈빈, 랭킨 온도를 변환하는 방법을 알아보세요',
      steps: [
        { name: '온도 값 입력', text: '변환할 온도 값을 입력하세요' },
        { name: '단위 선택', text: '입력한 온도의 단위를 선택하세요' },
        { name: '변환 결과 확인', text: '모든 단위로 변환된 결과를 확인하세요' },
      ],
    },
    en: {
      name: 'How to Convert Temperature',
      description: 'Learn how to convert Celsius, Fahrenheit, Kelvin, and Rankine',
      steps: [
        { name: 'Enter Temperature', text: 'Enter the temperature value to convert' },
        { name: 'Select Unit', text: 'Select the unit of the input temperature' },
        { name: 'View Results', text: 'View converted results in all units' },
      ],
    },
  },
  tokenGenerator: {
    ko: {
      name: '랜덤 토큰 생성 방법',
      description: '암호학적으로 안전한 랜덤 토큰을 생성하는 방법을 알아보세요',
      steps: [
        { name: '길이 설정', text: '생성할 토큰의 길이를 설정하세요' },
        { name: '문자 유형 선택', text: '대문자, 소문자, 숫자, 특수문자 포함 여부를 선택하세요' },
        { name: '토큰 생성', text: 'Generate 버튼을 클릭하여 랜덤 토큰을 생성하세요' },
      ],
    },
    en: {
      name: 'How to Generate Random Token',
      description: 'Learn how to generate cryptographically secure random tokens',
      steps: [
        { name: 'Set Length', text: 'Set the length of the token to generate' },
        { name: 'Select Character Types', text: 'Select uppercase, lowercase, numbers, and symbols' },
        { name: 'Generate Token', text: 'Click Generate button to create random token' },
      ],
    },
  },
  a11yCheck: {
    ko: {
      name: '접근성 검사 방법',
      description: 'HTML을 검사하여 웹 접근성 문제를 찾는 방법을 알아보세요',
      steps: [
        { name: 'HTML 입력', text: '검사할 HTML 코드를 입력하세요' },
        { name: '검사 실행', text: '접근성 규칙에 따라 자동 검사를 실행하세요' },
        { name: '결과 확인', text: '발견된 접근성 문제와 개선 방법을 확인하세요' },
      ],
    },
    en: {
      name: 'How to Check Accessibility',
      description: 'Learn how to check HTML for web accessibility issues',
      steps: [
        { name: 'Enter HTML', text: 'Enter the HTML code to check' },
        { name: 'Run Check', text: 'Run automatic check based on accessibility rules' },
        { name: 'View Results', text: 'View found accessibility issues and improvements' },
      ],
    },
  },
  contractTester: {
    ko: {
      name: 'API 계약 테스트 방법',
      description: 'API 계약을 정의하고 테스트하는 방법을 알아보세요',
      steps: [
        { name: '계약 정의', text: 'API 요청과 응답 스키마를 정의하세요' },
        { name: '테스트 실행', text: '실제 API를 호출하여 계약을 검증하세요' },
        { name: '결과 분석', text: '계약 위반 사항과 차이점을 확인하세요' },
      ],
    },
    en: {
      name: 'How to Test API Contract',
      description: 'Learn how to define and test API contracts',
      steps: [
        { name: 'Define Contract', text: 'Define API request and response schemas' },
        { name: 'Run Test', text: 'Call actual API to verify contract' },
        { name: 'Analyze Results', text: 'Check contract violations and differences' },
      ],
    },
  },
  apiResponseTime: {
    ko: {
      name: 'API 응답 시간 측정 방법',
      description: 'API 엔드포인트의 응답 시간을 측정하는 방법을 알아보세요',
      steps: [
        { name: 'URL 입력', text: '테스트할 API URL을 입력하세요' },
        { name: '요청 설정', text: 'HTTP 메서드와 헤더를 설정하세요' },
        { name: '응답 시간 확인', text: '평균, 최소, 최대 응답 시간을 확인하세요' },
      ],
    },
    en: {
      name: 'How to Measure API Response Time',
      description: 'Learn how to measure response time of API endpoints',
      steps: [
        { name: 'Enter URL', text: 'Enter the API URL to test' },
        { name: 'Configure Request', text: 'Set HTTP method and headers' },
        { name: 'Check Response Time', text: 'View average, min, and max response times' },
      ],
    },
  },
  apiScenario: {
    ko: {
      name: 'API 시나리오 테스트 방법',
      description: '여러 API 호출을 순차적으로 테스트하는 방법을 알아보세요',
      steps: [
        { name: '시나리오 작성', text: 'API 호출 순서와 조건을 정의하세요' },
        { name: '변수 설정', text: '이전 응답의 값을 다음 요청에 사용하세요' },
        { name: '시나리오 실행', text: '전체 시나리오를 실행하고 결과를 확인하세요' },
      ],
    },
    en: {
      name: 'How to Test API Scenario',
      description: 'Learn how to test multiple API calls sequentially',
      steps: [
        { name: 'Write Scenario', text: 'Define API call sequence and conditions' },
        { name: 'Set Variables', text: 'Use values from previous responses in next requests' },
        { name: 'Run Scenario', text: 'Execute entire scenario and check results' },
      ],
    },
  },
  asciiArt: {
    ko: {
      name: 'ASCII 아트 생성 방법',
      description: '텍스트를 ASCII 아트로 변환하는 방법을 알아보세요',
      steps: [
        { name: '텍스트 입력', text: 'ASCII 아트로 변환할 텍스트를 입력하세요' },
        { name: '폰트 선택', text: '원하는 ASCII 아트 스타일을 선택하세요' },
        { name: '결과 복사', text: '생성된 ASCII 아트를 복사하여 사용하세요' },
      ],
    },
    en: {
      name: 'How to Generate ASCII Art',
      description: 'Learn how to convert text to ASCII art',
      steps: [
        { name: 'Enter Text', text: 'Enter text to convert to ASCII art' },
        { name: 'Select Font', text: 'Choose desired ASCII art style' },
        { name: 'Copy Result', text: 'Copy generated ASCII art to use' },
      ],
    },
  },
  bip39: {
    ko: {
      name: 'BIP39 니모닉 생성 방법',
      description: '암호화폐 지갑을 위한 니모닉 문구를 생성하는 방법을 알아보세요',
      steps: [
        { name: '단어 수 선택', text: '12, 15, 18, 21, 24 단어 중 선택하세요' },
        { name: '니모닉 생성', text: '랜덤 니모닉 문구를 생성하세요' },
        { name: '시드 확인', text: '생성된 시드 값과 주소를 확인하세요' },
      ],
    },
    en: {
      name: 'How to Generate BIP39 Mnemonic',
      description: 'Learn how to generate mnemonic phrases for cryptocurrency wallets',
      steps: [
        { name: 'Select Word Count', text: 'Choose from 12, 15, 18, 21, or 24 words' },
        { name: 'Generate Mnemonic', text: 'Generate random mnemonic phrase' },
        { name: 'Check Seed', text: 'Verify generated seed value and address' },
      ],
    },
  },
  boxShadow: {
    ko: {
      name: 'Box Shadow 생성 방법',
      description: 'CSS box-shadow 속성을 시각적으로 생성하는 방법을 알아보세요',
      steps: [
        { name: '그림자 설정', text: 'X, Y 오프셋, 블러, 스프레드를 조정하세요' },
        { name: '색상 선택', text: '그림자 색상과 투명도를 설정하세요' },
        { name: 'CSS 복사', text: '생성된 CSS 코드를 복사하여 사용하세요' },
      ],
    },
    en: {
      name: 'How to Generate Box Shadow',
      description: 'Learn how to visually generate CSS box-shadow property',
      steps: [
        { name: 'Adjust Shadow', text: 'Adjust X, Y offset, blur, and spread' },
        { name: 'Select Color', text: 'Set shadow color and opacity' },
        { name: 'Copy CSS', text: 'Copy generated CSS code to use' },
      ],
    },
  },
  breakpointTester: {
    ko: {
      name: '반응형 브레이크포인트 테스트 방법',
      description: '다양한 화면 크기에서 레이아웃을 테스트하는 방법을 알아보세요',
      steps: [
        { name: 'URL 입력', text: '테스트할 웹사이트 URL을 입력하세요' },
        { name: '기기 선택', text: '모바일, 태블릿, 데스크탑 뷰를 선택하세요' },
        { name: '레이아웃 확인', text: '각 브레이크포인트에서 레이아웃을 확인하세요' },
      ],
    },
    en: {
      name: 'How to Test Responsive Breakpoints',
      description: 'Learn how to test layouts at various screen sizes',
      steps: [
        { name: 'Enter URL', text: 'Enter website URL to test' },
        { name: 'Select Device', text: 'Choose mobile, tablet, or desktop view' },
        { name: 'Check Layout', text: 'Verify layout at each breakpoint' },
      ],
    },
  },
  certChain: {
    ko: {
      name: 'SSL 인증서 체인 검사 방법',
      description: 'SSL/TLS 인증서 체인을 검사하고 검증하는 방법을 알아보세요',
      steps: [
        { name: '도메인 입력', text: '검사할 도메인 이름을 입력하세요' },
        { name: '인증서 확인', text: '인증서 체인과 만료일을 확인하세요' },
        { name: '문제 해결', text: '인증서 관련 문제와 경고를 확인하세요' },
      ],
    },
    en: {
      name: 'How to Inspect SSL Certificate Chain',
      description: 'Learn how to inspect and validate SSL/TLS certificate chains',
      steps: [
        { name: 'Enter Domain', text: 'Enter domain name to inspect' },
        { name: 'Check Certificate', text: 'View certificate chain and expiration dates' },
        { name: 'Resolve Issues', text: 'Check certificate-related issues and warnings' },
      ],
    },
  },
  changelogGenerator: {
    ko: {
      name: 'Changelog 생성 방법',
      description: 'Git 커밋 히스토리에서 변경 로그를 생성하는 방법을 알아보세요',
      steps: [
        { name: '커밋 선택', text: '변경 로그에 포함할 커밋을 선택하세요' },
        { name: '형식 설정', text: 'Markdown, Keep a Changelog 등 형식을 선택하세요' },
        { name: 'Changelog 생성', text: '생성된 변경 로그를 복사하여 사용하세요' },
      ],
    },
    en: {
      name: 'How to Generate Changelog',
      description: 'Learn how to generate change logs from Git commit history',
      steps: [
        { name: 'Select Commits', text: 'Select commits to include in changelog' },
        { name: 'Set Format', text: 'Choose format like Markdown or Keep a Changelog' },
        { name: 'Generate Changelog', text: 'Copy generated changelog to use' },
      ],
    },
  },
  ipv4Converter: {
    ko: {
      name: 'IPv4 변환 방법',
      description: 'IPv4 주소를 이진수, 10진수, 16진수로 변환하는 방법을 알아보세요',
      steps: [
        { name: 'IP 주소 입력', text: '변환할 IPv4 주소를 입력하세요' },
        { name: '변환 확인', text: '자동으로 변환된 2진수, 10진수, 16진수 값을 확인하세요' },
        { name: '결과 복사', text: '필요한 형식의 IP 주소를 복사하세요' },
      ],
    },
    en: {
      name: 'How to Convert IPv4',
      description: 'Learn how to convert IPv4 address to binary, decimal, and hexadecimal',
      steps: [
        { name: 'Enter IP Address', text: 'Enter the IPv4 address to convert' },
        { name: 'View Conversions', text: 'View automatically converted binary, decimal, and hex values' },
        { name: 'Copy Result', text: 'Copy the IP address in your preferred format' },
      ],
    },
  },
  jsonDiff: {
    ko: {
      name: 'JSON 비교 방법',
      description: '두 JSON 데이터의 차이점을 비교하는 방법을 알아보세요',
      steps: [
        { name: 'JSON 입력', text: '비교할 원본(Left)과 수정(Right) JSON을 입력하세요' },
        { name: '비교 실행', text: 'Compare 버튼을 클릭하세요' },
        { name: '차이점 분석', text: '추가, 삭제, 변경된 부분을 시각적으로 확인하세요' },
      ],
    },
    en: {
      name: 'How to Compare JSON',
      description: 'Learn how to compare differences between two JSON objects',
      steps: [
        { name: 'Enter JSON', text: 'Enter the original (Left) and modified (Right) JSON' },
        { name: 'Run Comparison', text: 'Click the Compare button' },
        { name: 'Analyze Differences', text: 'Visually identify additions, deletions, and changes' },
      ],
    },
  },
  codeMinifier: {
    ko: {
      name: '코드 압축 방법',
      description: 'JavaScript, CSS, HTML 코드를 압축(Minify)하는 방법을 알아보세요',
      steps: [
        { name: '코드 입력', text: '압축할 코드를 입력창에 붙여넣으세요' },
        { name: '언어 선택', text: 'JavaScript, CSS, HTML 중 언어를 선택하세요' },
        { name: '압축 실행', text: 'Minify 버튼을 클릭하여 코드를 압축하고 복사하세요' },
      ],
    },
    en: {
      name: 'How to Minify Code',
      description: 'Learn how to minify JavaScript, CSS, and HTML code',
      steps: [
        { name: 'Enter Code', text: 'Paste the code you want to minify' },
        { name: 'Select Language', text: 'Choose JavaScript, CSS, or HTML' },
        { name: 'Run Minify', text: 'Click Minify button to compress and copy the code' },
      ],
    },
  },
  asciiTable: {
    ko: {
      name: 'ASCII 테이블 사용 방법',
      description: 'ASCII 문자 코드를 검색하고 변환하는 방법을 알아보세요',
      steps: [
        { name: '문자 검색', text: '검색창을 사용하여 10진수, 16진수 또는 문자를 검색하세요' },
        { name: '필터 사용', text: '제어 문자 또는 출력 가능 문자로 필터링하여 확인하세요' },
        { name: '변환기 사용', text: '텍스트를 입력하여 ASCII 코드로 변환하세요' },
      ],
    },
    en: {
      name: 'How to Use ASCII Table',
      description: 'Learn how to look up and convert ASCII character codes',
      steps: [
        { name: 'Search Characters', text: 'Use the search bar to find decimals, hex codes, or characters' },
        { name: 'Use Filters', text: 'Filter by control characters or printable characters' },
        { name: 'Use Converter', text: 'Enter text to convert to ASCII codes' },
      ],
    },
  },
  hexViewer: {
    ko: {
      name: 'Hex Viewer 사용 방법',
      description: '바이너리 파일을 16진수로 분석하는 방법을 알아보세요',
      steps: [
        { name: '파일 업로드', text: '분석할 바이너리 파일을 업로드하세요' },
        { name: 'Hex 뷰 확인', text: '오프셋, Hex 값, ASCII 표현을 확인하세요' },
        { name: '검색', text: '특정 16진수 패턴이나 문자열을 검색하세요' },
      ],
    },
    en: {
      name: 'How to Use Hex Viewer',
      description: 'Learn how to analyze binary files in hexadecimal',
      steps: [
        { name: 'Upload File', text: 'Upload the binary file to analyze' },
        { name: 'View Hex Dump', text: 'Inspect offsets, hex values, and ASCII representation' },
        { name: 'Search', text: 'Search for specific hex patterns or strings' },
      ],
    },
  },
}
