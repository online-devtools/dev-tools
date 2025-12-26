// HAR 파일을 분석해 네트워크 요청 통계를 산출하는 유틸리티입니다.
// 브라우저에서만 실행되므로 서버나 외부 API 없이도 분석이 가능합니다.

// HAR 스펙의 핵심 필드만 정의한 타입입니다. 전체 스펙을 모두 표현하지 않아도 분석에는 충분합니다.
export type HarLog = {
  log?: {
    entries?: HarEntry[]
  }
}

// 각 네트워크 요청 항목을 부분적으로 표현합니다.
export type HarEntry = {
  startedDateTime?: string
  time?: number
  request?: {
    method?: string
    url?: string
    headersSize?: number
    bodySize?: number
  }
  response?: {
    status?: number
    statusText?: string
    headersSize?: number
    bodySize?: number
    content?: {
      size?: number
      mimeType?: string
    }
  }
}

// 정규화된 요청 요약 정보를 UI에 전달하기 위한 타입입니다.
export type HarEntrySummary = {
  id: string
  method: string
  url: string
  host: string
  status: number
  statusText: string
  timeMs: number
  sizeBytes: number
  mimeType: string
  startedDateTime: string
  statusGroup: HarStatusGroup
}

export type HarStatusGroup = '2xx' | '3xx' | '4xx' | '5xx' | 'other'

// HAR 분석 결과 요약 통계입니다.
export type HarSummary = {
  totalRequests: number
  totalTimeMs: number
  averageTimeMs: number
  totalBytes: number
  statusGroups: Record<HarStatusGroup, number>
  topSlow: HarEntrySummary[]
  topSize: HarEntrySummary[]
  hosts: Array<{ host: string; count: number; bytes: number }>
}

// 전체 분석 결과를 담는 타입입니다.
export type HarAnalysis = {
  entries: HarEntrySummary[]
  summary: HarSummary
}

// 숫자 타입이면서 음수가 아닌 값만 허용해 사이즈 계산 오류를 방지합니다.
const toNonNegativeNumber = (value: unknown): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0
  }

  return value < 0 ? 0 : value
}

// URL 파싱에 실패했을 때도 UI가 깨지지 않도록 기본 호스트 값을 반환합니다.
const extractHost = (url: string): string => {
  if (!url) {
    return 'unknown'
  }

  try {
    return new URL(url).hostname || 'unknown'
  } catch (error) {
    return 'unknown'
  }
}

// HAR 상태 코드를 그룹별로 분류합니다.
const getStatusGroup = (status: number): HarStatusGroup => {
  if (status >= 200 && status < 300) return '2xx'
  if (status >= 300 && status < 400) return '3xx'
  if (status >= 400 && status < 500) return '4xx'
  if (status >= 500 && status < 600) return '5xx'
  return 'other'
}

// 응답 본문 크기와 헤더 크기를 합산해 전송량을 계산합니다.
const getTransferSize = (entry: HarEntry): number => {
  const response = entry.response ?? {}
  const bodySize = toNonNegativeNumber(response.bodySize)
  const contentSize = toNonNegativeNumber(response.content?.size)
  const headersSize = toNonNegativeNumber(response.headersSize)

  // HAR 스펙에서 bodySize가 -1이면 알 수 없음을 의미하므로 content.size로 보완합니다.
  const payloadSize = bodySize > 0 ? bodySize : contentSize
  return payloadSize + headersSize
}

// HAR entry를 UI에서 바로 렌더링 가능한 요약 객체로 변환합니다.
const normalizeEntry = (entry: HarEntry, index: number): HarEntrySummary => {
  const method = entry.request?.method ?? 'GET'
  const url = entry.request?.url ?? ''
  const status = toNonNegativeNumber(entry.response?.status)
  const statusText = entry.response?.statusText ?? ''
  const timeMs = toNonNegativeNumber(entry.time)
  const sizeBytes = getTransferSize(entry)
  const mimeType = entry.response?.content?.mimeType ?? ''
  const startedDateTime = entry.startedDateTime ?? ''
  const host = extractHost(url)
  const statusGroup = getStatusGroup(status)

  return {
    id: `${host}-${index}`,
    method,
    url,
    host,
    status,
    statusText,
    timeMs,
    sizeBytes,
    mimeType,
    startedDateTime,
    statusGroup,
  }
}

// HAR 분석을 수행하고 요약 통계를 계산합니다.
export const analyzeHar = (harText: string): HarAnalysis => {
  let parsed: HarLog

  // JSON 파싱 중 발생하는 예외를 잡아 오류를 명확히 표시합니다.
  try {
    parsed = JSON.parse(harText) as HarLog
  } catch (error) {
    throw new Error('invalid_json')
  }

  const entries = parsed.log?.entries
  if (!Array.isArray(entries)) {
    throw new Error('invalid_har')
  }

  const normalized = entries.map((entry, index) => normalizeEntry(entry, index))

  // 전체 요청 수, 총 시간, 평균 시간 등 기본 통계를 계산합니다.
  const totalRequests = normalized.length
  const totalTimeMs = normalized.reduce((sum, item) => sum + item.timeMs, 0)
  const averageTimeMs = totalRequests > 0 ? totalTimeMs / totalRequests : 0
  const totalBytes = normalized.reduce((sum, item) => sum + item.sizeBytes, 0)

  // 상태 코드 그룹별 카운트를 초기화합니다.
  const statusGroups: Record<HarStatusGroup, number> = {
    '2xx': 0,
    '3xx': 0,
    '4xx': 0,
    '5xx': 0,
    'other': 0,
  }

  normalized.forEach((entry) => {
    statusGroups[entry.statusGroup] += 1
  })

  // 가장 느린 요청과 가장 큰 요청을 상위 5개씩 제공합니다.
  const topSlow = [...normalized].sort((a, b) => b.timeMs - a.timeMs).slice(0, 5)
  const topSize = [...normalized].sort((a, b) => b.sizeBytes - a.sizeBytes).slice(0, 5)

  // 호스트별 요청 수와 전송량을 집계합니다.
  const hostMap = new Map<string, { count: number; bytes: number }>()
  normalized.forEach((entry) => {
    const current = hostMap.get(entry.host) ?? { count: 0, bytes: 0 }
    hostMap.set(entry.host, {
      count: current.count + 1,
      bytes: current.bytes + entry.sizeBytes,
    })
  })

  const hosts = Array.from(hostMap.entries())
    .map(([host, stats]) => ({
      host,
      count: stats.count,
      bytes: stats.bytes,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    entries: normalized,
    summary: {
      totalRequests,
      totalTimeMs,
      averageTimeMs,
      totalBytes,
      statusGroups,
      topSlow,
      topSize,
      hosts,
    },
  }
}

// 바이트 단위를 사람이 읽기 좋은 문자열로 변환합니다.
export const formatBytes = (bytes: number): string => {
  const safeBytes = toNonNegativeNumber(bytes)
  if (safeBytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const exponent = Math.min(Math.floor(Math.log(safeBytes) / Math.log(1024)), units.length - 1)
  const value = safeBytes / Math.pow(1024, exponent)
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[exponent]}`
}

// 밀리초를 사람이 읽기 좋은 문자열로 변환합니다.
export const formatDuration = (ms: number): string => {
  const safeMs = toNonNegativeNumber(ms)
  if (safeMs < 1000) return `${safeMs.toFixed(0)} ms`
  const seconds = safeMs / 1000
  if (seconds < 60) return `${seconds.toFixed(2)} s`
  const minutes = seconds / 60
  return `${minutes.toFixed(2)} min`
}

// 개발 환경에서 분석 로직이 정상 동작하는지 간단히 검증합니다.
export const runHarAnalyzerSelfTest = (): void => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return
  }

  const sample: HarLog = {
    log: {
      entries: [
        {
          startedDateTime: '2024-01-01T00:00:00.000Z',
          time: 120,
          request: { method: 'GET', url: 'https://example.com/a' },
          response: { status: 200, bodySize: 1200, headersSize: 200, content: { size: 1200 } },
        },
        {
          startedDateTime: '2024-01-01T00:00:01.000Z',
          time: 480,
          request: { method: 'POST', url: 'https://example.com/b' },
          response: { status: 404, bodySize: 500, headersSize: 100, content: { size: 500 } },
        },
      ],
    },
  }

  try {
    const analysis = analyzeHar(JSON.stringify(sample))
    if (analysis.summary.totalRequests !== 2) {
      throw new Error('totalRequests mismatch')
    }
    if (analysis.summary.statusGroups['2xx'] !== 1 || analysis.summary.statusGroups['4xx'] !== 1) {
      throw new Error('status group mismatch')
    }
  } catch (error) {
    console.warn('[HAR Analyzer] self-test failed:', error)
  }
}
