// 텍스트에서 흔히 노출되는 시크릿 패턴을 탐지하는 유틸리티입니다.
// 모든 처리는 브라우저 로컬에서만 수행되어 민감 정보가 외부로 전송되지 않습니다.

export type SecretSeverity = 'high' | 'medium' | 'low'

// 패턴 메타데이터에 다국어 키를 포함해 UI에서 번역 문자열을 사용할 수 있게 합니다.
export type SecretPattern = {
  id: string
  labelKey: string
  descriptionKey: string
  severity: SecretSeverity
  regex: RegExp
}

// 스캔된 매칭 결과를 UI에서 그대로 사용할 수 있도록 필요한 정보를 담습니다.
export type SecretMatch = {
  id: string
  patternId: string
  severity: SecretSeverity
  value: string
  maskedValue: string
  line: number
  column: number
}

// 전체 스캔 결과를 요약하는 타입입니다.
export type SecretScanResult = {
  matches: SecretMatch[]
  totalMatches: number
  totalUnique: number
  bySeverity: Record<SecretSeverity, number>
}

// 실제 제품에서 자주 발견되는 시크릿 패턴을 정리합니다.
const DEFAULT_PATTERNS: SecretPattern[] = [
  {
    id: 'aws-access-key',
    labelKey: 'secretScanner.pattern.awsAccessKey',
    descriptionKey: 'secretScanner.pattern.awsAccessKey.desc',
    severity: 'high',
    regex: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g,
  },
  {
    id: 'github-token',
    labelKey: 'secretScanner.pattern.githubToken',
    descriptionKey: 'secretScanner.pattern.githubToken.desc',
    severity: 'high',
    regex: /\bgh[pous]_[A-Za-z0-9]{36,}\b/g,
  },
  {
    id: 'slack-token',
    labelKey: 'secretScanner.pattern.slackToken',
    descriptionKey: 'secretScanner.pattern.slackToken.desc',
    severity: 'high',
    regex: /\bxox[baprs]-[A-Za-z0-9-]{10,48}\b/g,
  },
  {
    id: 'google-api-key',
    labelKey: 'secretScanner.pattern.googleApiKey',
    descriptionKey: 'secretScanner.pattern.googleApiKey.desc',
    severity: 'high',
    regex: /\bAIza[0-9A-Za-z-_]{35}\b/g,
  },
  {
    id: 'stripe-secret',
    labelKey: 'secretScanner.pattern.stripeSecret',
    descriptionKey: 'secretScanner.pattern.stripeSecret.desc',
    severity: 'high',
    regex: /\bsk_(live|test)_[0-9a-zA-Z]{16,}\b/g,
  },
  {
    id: 'jwt-token',
    labelKey: 'secretScanner.pattern.jwt',
    descriptionKey: 'secretScanner.pattern.jwt.desc',
    severity: 'medium',
    regex: /\beyJ[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+?\b/g,
  },
  {
    id: 'private-key',
    labelKey: 'secretScanner.pattern.privateKey',
    descriptionKey: 'secretScanner.pattern.privateKey.desc',
    severity: 'high',
    regex: /-----BEGIN (RSA|EC|DSA|OPENSSH|PRIVATE) PRIVATE KEY-----/g,
  },
  {
    id: 'generic-secret',
    labelKey: 'secretScanner.pattern.genericSecret',
    descriptionKey: 'secretScanner.pattern.genericSecret.desc',
    severity: 'low',
    regex: /\b(secret|token|api[_-]?key|passwd|password)\b\s*[:=]\s*['"][^'"]{6,}['"]/gi,
  },
]

// 기본 패턴 목록을 외부에서 사용할 수 있도록 반환합니다.
export const getSecretPatterns = (): SecretPattern[] => {
  return DEFAULT_PATTERNS
}

// 텍스트 인덱스 위치를 라인/컬럼으로 변환하기 위한 라인 시작 인덱스 배열을 생성합니다.
const buildLineIndex = (text: string): number[] => {
  const lineStarts: number[] = [0]

  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '\n') {
      lineStarts.push(i + 1)
    }
  }

  return lineStarts
}

// 이진 탐색으로 현재 인덱스가 속한 라인을 계산합니다.
const findLineColumn = (lineStarts: number[], index: number): { line: number; column: number } => {
  let left = 0
  let right = lineStarts.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const start = lineStarts[mid]
    const nextStart = mid + 1 < lineStarts.length ? lineStarts[mid + 1] : Number.MAX_SAFE_INTEGER

    if (index >= start && index < nextStart) {
      return { line: mid + 1, column: index - start + 1 }
    }

    if (index < start) {
      right = mid - 1
    } else {
      left = mid + 1
    }
  }

  return { line: 1, column: index + 1 }
}

// 민감 정보 노출을 줄이기 위해 중간 부분을 마스킹합니다.
export const maskSecret = (value: string, visibleChars: number = 4): string => {
  if (!value) {
    return ''
  }

  if (value.length <= visibleChars * 2) {
    return '*'.repeat(value.length)
  }

  const start = value.slice(0, visibleChars)
  const end = value.slice(-visibleChars)
  return `${start}…${end}`
}

// 텍스트에서 모든 시크릿 패턴을 찾아 결과를 반환합니다.
export const scanSecrets = (text: string, patterns: SecretPattern[] = DEFAULT_PATTERNS): SecretScanResult => {
  const matches: SecretMatch[] = []
  const lineStarts = buildLineIndex(text)

  patterns.forEach((pattern) => {
    // 글로벌 정규식은 내부 상태를 가지므로 새 인스턴스로 복제해 안전하게 사용합니다.
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags)
    let match: RegExpExecArray | null

    while ((match = regex.exec(text)) !== null) {
      const value = match[0]
      const index = match.index ?? 0
      const { line, column } = findLineColumn(lineStarts, index)

      matches.push({
        id: `${pattern.id}-${index}`,
        patternId: pattern.id,
        severity: pattern.severity,
        value,
        maskedValue: maskSecret(value),
        line,
        column,
      })
    }
  })

  const uniqueValues = new Set(matches.map((item) => item.value))
  const bySeverity: Record<SecretSeverity, number> = {
    high: 0,
    medium: 0,
    low: 0,
  }

  matches.forEach((match) => {
    bySeverity[match.severity] += 1
  })

  return {
    matches,
    totalMatches: matches.length,
    totalUnique: uniqueValues.size,
    bySeverity,
  }
}

// 개발 환경에서 시크릿 스캐너가 동작하는지 최소 검증을 수행합니다.
export const runSecretScannerSelfTest = (): void => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return
  }

  const sample = [
    'const key = "AKIA1234567890ABCD12";',
    'token=ghp_1234567890abcdefghijklmnopqrstuvwxyzAB',
  ].join('\n')

  try {
    const result = scanSecrets(sample)
    if (result.totalMatches < 2) {
      throw new Error('secret scan count mismatch')
    }
  } catch (error) {
    console.warn('[Secret Scanner] self-test failed:', error)
  }
}
