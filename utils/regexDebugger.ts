// Regex debugging helpers to list matches and capture groups deterministically.
// This utility is used by the Regex Debugger tool UI.

export type RegexDebuggerErrorCode = 'invalidPattern'

export class RegexDebuggerError extends Error {
  code: RegexDebuggerErrorCode

  constructor(code: RegexDebuggerErrorCode, message: string) {
    super(message)
    this.name = 'RegexDebuggerError'
    this.code = code
  }
}

export type RegexMatchInfo = {
  index: number
  match: string
  groups: string[]
  namedGroups: Record<string, string>
}

export const analyzeRegexMatches = (
  pattern: string,
  flags: string,
  input: string
): RegexMatchInfo[] => {
  let regex: RegExp

  try {
    // Construct a RegExp from the provided pattern and flags.
    regex = new RegExp(pattern, flags)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid regex pattern'
    throw new RegexDebuggerError('invalidPattern', message)
  }

  const matches: RegexMatchInfo[] = []
  const useGlobal = regex.global

  let match = regex.exec(input)
  while (match) {
    // match[0] is the full match; match.slice(1) are capture groups.
    matches.push({
      index: match.index,
      match: match[0],
      groups: match.slice(1),
      namedGroups: match.groups ? { ...match.groups } : {},
    })

    if (!useGlobal) {
      // Without the global flag, only the first match is returned.
      break
    }

    // Prevent infinite loops for zero-length matches.
    if (match.index === regex.lastIndex) {
      regex.lastIndex += 1
    }

    match = regex.exec(input)
  }

  return matches
}
