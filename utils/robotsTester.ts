export type RobotsRuleType = 'allow' | 'disallow'

export type RobotsRule = {
  type: RobotsRuleType
  path: string
  line: number
}

export type RobotsGroup = {
  agents: string[]
  rules: RobotsRule[]
}

export type RobotsParseResult = {
  groups: RobotsGroup[]
  sitemaps: string[]
}

export type RobotsTestReason = 'allow' | 'disallow' | 'noMatch'

export type RobotsTestResult = {
  allowed: boolean
  reason: RobotsTestReason
  matchedRule: RobotsRule | null
  matchedGroup: RobotsGroup | null
}

export type RobotsTxtErrorCode = 'empty' | 'invalid'

export class RobotsTxtError extends Error {
  code: RobotsTxtErrorCode
  line?: number

  constructor(code: RobotsTxtErrorCode, message: string, line?: number) {
    super(message)
    this.name = 'RobotsTxtError'
    this.code = code
    this.line = line
  }
}

const normalizeValue = (value: string): string => value.trim()

const stripComments = (line: string): string => {
  const index = line.indexOf('#')
  return index >= 0 ? line.slice(0, index) : line
}

const parseDirective = (line: string): { key: string; value: string } | null => {
  const separatorIndex = line.indexOf(':')
  if (separatorIndex <= 0) {
    return null
  }
  const key = normalizeValue(line.slice(0, separatorIndex)).toLowerCase()
  const value = normalizeValue(line.slice(separatorIndex + 1))
  return { key, value }
}

const ensureGroup = (groups: RobotsGroup[], current: RobotsGroup | null): RobotsGroup => {
  if (current) {
    return current
  }
  const group: RobotsGroup = { agents: ['*'], rules: [] }
  groups.push(group)
  return group
}

export const parseRobotsTxt = (input: string): RobotsParseResult => {
  if (!input.trim()) {
    throw new RobotsTxtError('empty', 'Input is empty')
  }

  const groups: RobotsGroup[] = []
  const sitemaps: string[] = []
  let currentGroup: RobotsGroup | null = null
  let sawRule = false

  const lines = input.replace(/\r\n/g, '\n').split('\n')

  lines.forEach((rawLine, index) => {
    const cleaned = stripComments(rawLine).trim()
    if (!cleaned) {
      return
    }

    const directive = parseDirective(cleaned)
    if (!directive) {
      throw new RobotsTxtError('invalid', 'Invalid directive', index + 1)
    }

    const { key, value } = directive

    if (key === 'user-agent') {
      if (!currentGroup || sawRule) {
        currentGroup = { agents: [], rules: [] }
        groups.push(currentGroup)
        sawRule = false
      }
      currentGroup.agents.push(value.toLowerCase())
      return
    }

    if (key === 'sitemap') {
      if (value) {
        sitemaps.push(value)
      }
      return
    }

    if (key === 'allow' || key === 'disallow') {
      if (!value && key === 'disallow') {
        sawRule = true
        return
      }
      currentGroup = ensureGroup(groups, currentGroup)
      currentGroup.rules.push({
        type: key,
        path: value || '/',
        line: index + 1,
      })
      sawRule = true
    }
  })

  return { groups, sitemaps }
}

const normalizeUserAgent = (value: string): string => value.toLowerCase().trim()

const getTargetPath = (target: string): string => {
  const trimmed = target.trim()
  if (!trimmed) {
    return '/'
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    const parsed = new URL(trimmed)
    return `${parsed.pathname}${parsed.search}`
  }

  if (trimmed.startsWith('/')) {
    return trimmed
  }

  return `/${trimmed}`
}

const selectGroup = (groups: RobotsGroup[], userAgent: string): RobotsGroup | null => {
  const normalizedAgent = normalizeUserAgent(userAgent)
  let bestGroup: RobotsGroup | null = null
  let bestScore = 0

  groups.forEach((group) => {
    group.agents.forEach((agent) => {
      if (agent === '*') {
        if (bestScore === 0) {
          bestGroup = group
          bestScore = 1
        }
        return
      }

      if (normalizedAgent.includes(agent)) {
        const score = agent.length + 1
        if (score > bestScore) {
          bestScore = score
          bestGroup = group
        }
      }
    })
  })

  return bestGroup
}

const findMatchingRule = (rules: RobotsRule[], path: string): RobotsRule | null => {
  let bestRule: RobotsRule | null = null
  let bestLength = -1

  rules.forEach((rule) => {
    if (!path.startsWith(rule.path)) {
      return
    }
    if (rule.path.length > bestLength) {
      bestLength = rule.path.length
      bestRule = rule
      return
    }
    if (rule.path.length === bestLength && rule.type === 'allow') {
      bestRule = rule
    }
  })

  return bestRule
}

export const testRobotsTxt = (
  input: string,
  userAgent: string,
  target: string,
): RobotsTestResult => {
  const parsed = parseRobotsTxt(input)
  const group = selectGroup(parsed.groups, userAgent)

  if (!group) {
    return {
      allowed: true,
      reason: 'noMatch',
      matchedRule: null,
      matchedGroup: null,
    }
  }

  const path = getTargetPath(target)
  const rule = findMatchingRule(group.rules, path)

  if (!rule) {
    return {
      allowed: true,
      reason: 'noMatch',
      matchedRule: null,
      matchedGroup: group,
    }
  }

  const allowed = rule.type === 'allow'

  return {
    allowed,
    reason: allowed ? 'allow' : 'disallow',
    matchedRule: rule,
    matchedGroup: group,
  }
}
