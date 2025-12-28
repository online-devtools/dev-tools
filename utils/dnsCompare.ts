export type DnsRecord = {
  name: string
  ttl?: number
  className: string
  type: string
  value: string
  raw: string
}

export type DnsCompareSummary = {
  onlyLeft: number
  onlyRight: number
  common: number
}

export type DnsCompareResult = {
  left: DnsRecord[]
  right: DnsRecord[]
  onlyLeft: DnsRecord[]
  onlyRight: DnsRecord[]
  common: DnsRecord[]
  summary: DnsCompareSummary
}

const isCommentLine = (line: string): boolean => {
  // Skip empty lines or comment-only rows from dig-style output.
  const trimmed = line.trim()
  return !trimmed || trimmed.startsWith(';') || trimmed.startsWith('#')
}

const normalizeName = (value: string): string => {
  // Lowercase and trim trailing dots so comparisons are consistent.
  return value.trim().replace(/\.$/, '').toLowerCase()
}

const buildKey = (record: DnsRecord): string => {
  // Use name/class/type/value as the stable identity for diffing.
  return `${record.name}|${record.className}|${record.type}|${record.value}`.toLowerCase()
}

const parseLine = (line: string): DnsRecord | null => {
  if (isCommentLine(line)) return null

  const tokens = line.trim().split(/\s+/)
  if (tokens.length < 4) return null

  const name = normalizeName(tokens[0])
  let index = 1
  let ttl: number | undefined

  // TTL is optional; if present it should be numeric.
  if (/^\d+$/.test(tokens[index] ?? '')) {
    ttl = Number(tokens[index])
    index += 1
  }

  const className = tokens[index]
  const type = tokens[index + 1]
  const value = tokens.slice(index + 2).join(' ')

  if (!className || !type || !value) {
    return null
  }

  return {
    name,
    ttl,
    className,
    type,
    value,
    raw: line,
  }
}

const parseRecords = (input: string): DnsRecord[] => {
  // Parse each line and dedupe by record identity.
  const records = new Map<string, DnsRecord>()
  input.split('\n').forEach((line) => {
    const record = parseLine(line)
    if (!record) return
    const key = buildKey(record)
    if (!records.has(key)) {
      records.set(key, record)
    }
  })
  return Array.from(records.values())
}

export const compareDnsRecords = (leftInput: string, rightInput: string): DnsCompareResult => {
  const left = parseRecords(leftInput)
  const right = parseRecords(rightInput)

  const rightMap = new Map<string, DnsRecord>()
  right.forEach((record) => rightMap.set(buildKey(record), record))

  const leftMap = new Map<string, DnsRecord>()
  left.forEach((record) => leftMap.set(buildKey(record), record))

  const common: DnsRecord[] = []
  const onlyLeft: DnsRecord[] = []
  const onlyRight: DnsRecord[] = []

  leftMap.forEach((record, key) => {
    if (rightMap.has(key)) {
      common.push(record)
    } else {
      onlyLeft.push(record)
    }
  })

  rightMap.forEach((record, key) => {
    if (!leftMap.has(key)) {
      onlyRight.push(record)
    }
  })

  return {
    left,
    right,
    onlyLeft,
    onlyRight,
    common,
    summary: {
      onlyLeft: onlyLeft.length,
      onlyRight: onlyRight.length,
      common: common.length,
    },
  }
}
