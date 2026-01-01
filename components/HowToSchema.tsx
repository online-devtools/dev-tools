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
}
