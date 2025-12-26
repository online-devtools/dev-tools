// 로그 텍스트를 파싱해 레벨/시간 정보를 요약하는 유틸리티입니다.
// 브라우저에서 실행되므로 서버 로그 업로드 없이도 분석할 수 있습니다.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'trace' | 'fatal' | 'unknown'

// UI에서 레벨 선택 토글을 만들 수 있도록 기본 순서를 제공합니다.
export const LOG_LEVELS: LogLevel[] = ['error', 'warn', 'info', 'debug', 'trace', 'fatal', 'unknown']

export type LogEntry = {
  id: string
  lineNumber: number
  raw: string
  level: LogLevel
  timestamp: string | null
  timestampMs: number | null
}

export type LogSummary = {
  totalLines: number
  parsedLines: number
  byLevel: Record<LogLevel, number>
  timeRange: { start: string | null; end: string | null }
}

export type LogAnalysis = {
  entries: LogEntry[]
  summary: LogSummary
}

export type LogFilterOptions = {
  searchTerm: string
  excludeTerm: string
  levels: LogLevel[]
  startTime: string
  endTime: string
}

// 로그 레벨 문자열을 표준 enum 값으로 변환합니다.
const normalizeLevel = (rawLevel: string): LogLevel => {
  const normalized = rawLevel.toLowerCase()
  if (normalized === 'warning') {
    return 'warn'
  }
  if (normalized === 'fatal') {
    return 'fatal'
  }
  if (normalized === 'error') {
    return 'error'
  }
  if (normalized === 'warn') {
    return 'warn'
  }
  if (normalized === 'info') {
    return 'info'
  }
  if (normalized === 'debug') {
    return 'debug'
  }
  if (normalized === 'trace') {
    return 'trace'
  }
  return 'unknown'
}

// 로그 레벨을 찾기 위한 정규식입니다.
const LEVEL_REGEX = /\b(fatal|error|warn|warning|info|debug|trace)\b/i

// 타임스탬프 후보를 찾기 위한 정규식입니다.
const TIMESTAMP_REGEX =
  /(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)/

// 한 줄에서 로그 레벨을 감지합니다.
const detectLevel = (line: string): LogLevel => {
  const match = line.match(LEVEL_REGEX)
  if (!match) {
    return 'unknown'
  }
  return normalizeLevel(match[1])
}

// 타임스탬프 문자열을 Date로 변환해 밀리초 값을 반환합니다.
const parseTimestamp = (line: string): { timestamp: string | null; timestampMs: number | null } => {
  const match = line.match(TIMESTAMP_REGEX)
  if (!match) {
    return { timestamp: null, timestampMs: null }
  }

  const rawTimestamp = match[1]
  const parsed = new Date(rawTimestamp)
  if (Number.isNaN(parsed.getTime())) {
    return { timestamp: rawTimestamp, timestampMs: null }
  }

  return { timestamp: rawTimestamp, timestampMs: parsed.getTime() }
}

// 전체 로그를 파싱해 엔트리 목록을 구성합니다.
export const parseLogText = (text: string): LogEntry[] => {
  const lines = text.split(/\r?\n/)

  return lines
    .map((line, index) => {
      const trimmed = line.trim()
      if (!trimmed) {
        return null
      }

      const level = detectLevel(line)
      const { timestamp, timestampMs } = parseTimestamp(line)

      return {
        id: `line-${index + 1}`,
        lineNumber: index + 1,
        raw: line,
        level,
        timestamp,
        timestampMs,
      }
    })
    .filter((entry): entry is LogEntry => entry !== null)
}

// 엔트리 목록을 기준으로 요약 정보를 계산합니다.
export const summarizeLogs = (entries: LogEntry[], totalLines: number): LogSummary => {
  const byLevel: Record<LogLevel, number> = {
    debug: 0,
    info: 0,
    warn: 0,
    error: 0,
    trace: 0,
    fatal: 0,
    unknown: 0,
  }

  entries.forEach((entry) => {
    byLevel[entry.level] += 1
  })

  const timestamps = entries
    .map((entry) => entry.timestampMs)
    .filter((value): value is number => typeof value === 'number')
    .sort((a, b) => a - b)

  const start = timestamps.length > 0 ? new Date(timestamps[0]).toISOString() : null
  const end = timestamps.length > 0 ? new Date(timestamps[timestamps.length - 1]).toISOString() : null

  return {
    totalLines,
    parsedLines: entries.length,
    byLevel,
    timeRange: { start, end },
  }
}

// 로그 전체를 분석해 요약 정보를 반환합니다.
export const analyzeLogs = (text: string): LogAnalysis => {
  const totalLines = text.split(/\r?\n/).length
  const entries = parseLogText(text)
  const summary = summarizeLogs(entries, totalLines)
  return { entries, summary }
}

// 입력 문자열을 Date로 변환해 필터 기준 밀리초 값을 얻습니다.
const parseFilterDate = (value: string): number | null => {
  if (!value) {
    return null
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }
  return parsed.getTime()
}

// 필터 조건에 맞는 로그만 추려 반환합니다.
export const filterLogEntries = (entries: LogEntry[], options: LogFilterOptions): LogEntry[] => {
  const searchLower = options.searchTerm.trim().toLowerCase()
  const excludeLower = options.excludeTerm.trim().toLowerCase()
  const allowedLevels = new Set(options.levels)
  const startMs = parseFilterDate(options.startTime)
  const endMs = parseFilterDate(options.endTime)

  return entries.filter((entry) => {
    if (allowedLevels.size > 0 && !allowedLevels.has(entry.level)) {
      return false
    }

    if (searchLower && !entry.raw.toLowerCase().includes(searchLower)) {
      return false
    }

    if (excludeLower && entry.raw.toLowerCase().includes(excludeLower)) {
      return false
    }

    if ((startMs !== null || endMs !== null) && entry.timestampMs === null) {
      return false
    }

    if (startMs !== null && entry.timestampMs !== null && entry.timestampMs < startMs) {
      return false
    }

    if (endMs !== null && entry.timestampMs !== null && entry.timestampMs > endMs) {
      return false
    }

    return true
  })
}

// 필터링된 로그를 멀티라인 텍스트로 변환합니다.
export const toLogText = (entries: LogEntry[]): string => {
  return entries.map((entry) => entry.raw).join('\n')
}

// 개발 환경에서 로그 파서가 제대로 동작하는지 확인합니다.
export const runLogInspectorSelfTest = (): void => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return
  }

  const sample = [
    '2024-01-01 10:00:00 INFO Server started',
    '2024-01-01 10:00:01 WARN Disk space low',
    '2024-01-01 10:00:02 ERROR Failed to connect',
  ].join('\n')

  try {
    const analysis = analyzeLogs(sample)
    if (analysis.summary.byLevel.info !== 1) {
      throw new Error('info count mismatch')
    }
    if (analysis.summary.byLevel.warn !== 1) {
      throw new Error('warn count mismatch')
    }
    if (analysis.summary.byLevel.error !== 1) {
      throw new Error('error count mismatch')
    }
  } catch (error) {
    console.warn('[Log Inspector] self-test failed:', error)
  }
}
