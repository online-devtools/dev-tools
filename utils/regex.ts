export interface RegexTestResult {
  matches: string[]
  hasMatches: boolean
}

export function runRegexTest(pattern: string, flags: string, testString: string): RegexTestResult {
  if (!pattern) {
    throw new Error('regex.error.required')
  }

  const regex = new RegExp(pattern, flags)
  const matches = testString.match(regex) ?? []
  return {
    matches,
    hasMatches: matches.length > 0,
  }
}
