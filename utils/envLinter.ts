// .env 파일을 로컬에서 점검하는 린터 유틸리티입니다.
// 서버나 외부 API 없이 브라우저에서만 실행되도록 설계했습니다.

export type EnvLintSeverity = 'error' | 'warning' | 'info'

export type EnvLintIssueType =
  | 'invalidLine'
  | 'invalidKey'
  | 'duplicateKey'
  | 'missingValue'
  | 'trailingWhitespace'
  | 'requiredMissing'

export type EnvLintIssue = {
  id: string
  type: EnvLintIssueType
  severity: EnvLintSeverity
  line?: number
  key?: string
  rawLine?: string
}

export type EnvLintEntry = {
  key: string
  value: string
  rawValue: string
  line: number
  rawLine: string
}

export type EnvLintSummary = {
  totalLines: number
  parsedEntries: number
  duplicateKeys: number
  missingValues: number
  invalidLines: number
  invalidKeys: number
  trailingWhitespace: number
  requiredMissing: number
  bySeverity: Record<EnvLintSeverity, number>
}

export type EnvLintResult = {
  entries: EnvLintEntry[]
  issues: EnvLintIssue[]
  summary: EnvLintSummary
  requiredMissingKeys: string[]
  normalizedEnv: string
}

export type EnvLinterErrorCode = 'empty'

export class EnvLinterError extends Error {
  code: EnvLinterErrorCode

  constructor(code: EnvLinterErrorCode, message: string) {
    super(message)
    this.name = 'EnvLinterError'
    this.code = code
  }
}

// 허용 가능한 환경 변수 키 패턴을 정의합니다.
const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

// 값에서 공백을 정리하고, 따옴표로 감싼 경우에는 따옴표를 제거합니다.
const normalizeValue = (rawValue: string): string => {
  const trimmed = rawValue.trim()
  if (trimmed.length >= 2) {
    const firstChar = trimmed[0]
    const lastChar = trimmed[trimmed.length - 1]
    if ((firstChar === '"' && lastChar === '"') || (firstChar === "'" && lastChar === "'")) {
      return trimmed.slice(1, -1)
    }
  }
  return trimmed
}

// 사용자 입력에서 필수 키 목록을 파싱합니다.
export const parseRequiredKeys = (input: string): string[] => {
  if (!input.trim()) {
    return []
  }

  return input
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

// 민감한 값을 화면에 표시할 때 마스킹 처리합니다.
export const maskEnvValue = (value: string, visibleChars = 3): string => {
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

// 엔트리 목록을 기반으로 정규화된 .env 문자열을 생성합니다.
export const buildNormalizedEnv = (entries: EnvLintEntry[], requiredKeys: string[]): string => {
  const normalizedMap = new Map<string, string>()

  // 같은 키가 여러 번 등장하면 가장 마지막 값을 우선합니다.
  entries.forEach((entry) => {
    normalizedMap.set(entry.key, entry.value)
  })

  // 필수 키 중 누락된 값은 빈 값으로 추가해 빠르게 보완할 수 있게 합니다.
  requiredKeys.forEach((key) => {
    if (!normalizedMap.has(key)) {
      normalizedMap.set(key, '')
    }
  })

  const sortedKeys = Array.from(normalizedMap.keys()).sort((a, b) => a.localeCompare(b))
  return sortedKeys.map((key) => `${key}=${normalizedMap.get(key) ?? ''}`).join('\n')
}

// .env 내용을 분석해 이슈와 요약 정보를 반환합니다.
export const lintEnv = (input: string, requiredKeys: string[] = []): EnvLintResult => {
  if (!input.trim()) {
    throw new EnvLinterError('empty', 'Input is empty')
  }

  const lines = input.split(/\r?\n/)
  const entries: EnvLintEntry[] = []
  const issues: EnvLintIssue[] = []
  const seenKeys = new Map<string, EnvLintEntry>()
  const duplicateKeys = new Set<string>()

  const pushIssue = (issue: EnvLintIssue) => {
    issues.push(issue)
  }

  lines.forEach((line, index) => {
    const lineNumber = index + 1
    const trimmed = line.trim()

    // 줄 끝 공백은 유지보수 실수로 이어질 수 있으므로 경고로 표시합니다.
    if (/[ \t]+$/.test(line) && trimmed.length > 0) {
      pushIssue({
        id: `trailing-${lineNumber}`,
        type: 'trailingWhitespace',
        severity: 'info',
        line: lineNumber,
        rawLine: line,
      })
    }

    // 빈 줄과 주석은 설정으로 처리하지 않습니다.
    if (!trimmed || trimmed.startsWith('#')) {
      return
    }

    // "export KEY=VALUE" 형태도 지원하기 위해 export 키워드를 제거합니다.
    const withoutExport = trimmed.replace(/^export\s+/, '')
    const separatorIndex = withoutExport.indexOf('=')

    if (separatorIndex <= 0) {
      pushIssue({
        id: `invalid-line-${lineNumber}`,
        type: 'invalidLine',
        severity: 'error',
        line: lineNumber,
        rawLine: line,
      })
      return
    }

    const rawKey = withoutExport.slice(0, separatorIndex).trim()
    const rawValue = withoutExport.slice(separatorIndex + 1)

    if (!rawKey) {
      pushIssue({
        id: `invalid-key-${lineNumber}`,
        type: 'invalidKey',
        severity: 'error',
        line: lineNumber,
        rawLine: line,
      })
      return
    }

    if (!KEY_PATTERN.test(rawKey)) {
      pushIssue({
        id: `invalid-key-${rawKey}-${lineNumber}`,
        type: 'invalidKey',
        severity: 'warning',
        line: lineNumber,
        key: rawKey,
        rawLine: line,
      })
    }

    if (rawValue.trim().length === 0) {
      pushIssue({
        id: `missing-value-${rawKey}-${lineNumber}`,
        type: 'missingValue',
        severity: 'warning',
        line: lineNumber,
        key: rawKey,
        rawLine: line,
      })
    }

    const entry: EnvLintEntry = {
      key: rawKey,
      value: normalizeValue(rawValue),
      rawValue,
      line: lineNumber,
      rawLine: line,
    }

    const seenEntry = seenKeys.get(rawKey)
    if (seenEntry) {
      duplicateKeys.add(rawKey)
      pushIssue({
        id: `duplicate-${rawKey}-${lineNumber}`,
        type: 'duplicateKey',
        severity: 'warning',
        line: lineNumber,
        key: rawKey,
        rawLine: line,
      })
    } else {
      seenKeys.set(rawKey, entry)
    }

    entries.push(entry)
  })

  const requiredMissingKeys = requiredKeys.filter((key) => !seenKeys.has(key))
  requiredMissingKeys.forEach((key) => {
    pushIssue({
      id: `required-missing-${key}`,
      type: 'requiredMissing',
      severity: 'error',
      key,
    })
  })

  const bySeverity: Record<EnvLintSeverity, number> = {
    error: 0,
    warning: 0,
    info: 0,
  }

  issues.forEach((issue) => {
    bySeverity[issue.severity] += 1
  })

  const summary: EnvLintSummary = {
    totalLines: lines.length,
    parsedEntries: entries.length,
    duplicateKeys: duplicateKeys.size,
    missingValues: issues.filter((issue) => issue.type === 'missingValue').length,
    invalidLines: issues.filter((issue) => issue.type === 'invalidLine').length,
    invalidKeys: issues.filter((issue) => issue.type === 'invalidKey').length,
    trailingWhitespace: issues.filter((issue) => issue.type === 'trailingWhitespace').length,
    requiredMissing: requiredMissingKeys.length,
    bySeverity,
  }

  return {
    entries,
    issues,
    summary,
    requiredMissingKeys,
    normalizedEnv: buildNormalizedEnv(entries, requiredKeys),
  }
}

// 개발 환경에서 린터가 예상대로 동작하는지 간단히 확인합니다.
export const runEnvLinterSelfTest = (): void => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return
  }

  const sample = [
    'API_KEY=abc123',
    'API_KEY=dup',
    'INVALID LINE',
    'EMPTY_VALUE=',
    'export VALID_KEY=ok',
  ].join('\n')

  try {
    const result = lintEnv(sample, ['API_KEY', 'MISSING_KEY'])
    if (result.summary.duplicateKeys !== 1) {
      throw new Error('duplicate keys mismatch')
    }
    if (result.summary.invalidLines !== 1) {
      throw new Error('invalid line mismatch')
    }
    if (result.requiredMissingKeys.length !== 1) {
      throw new Error('required missing mismatch')
    }
  } catch (error) {
    console.warn('[Env Linter] self-test failed:', error)
  }
}
