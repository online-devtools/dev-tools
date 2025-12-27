export type LogRedactorOptions = {
  // Toggle redaction rules for known sensitive patterns.
  maskEmail: boolean
  maskIpv4: boolean
  maskIpv6: boolean
  maskJwt: boolean
  // Optional custom regex for project-specific secrets.
  customPattern?: string
  customFlags?: string
  customLabel?: string
}

export type LogRedactorCounts = {
  // Track how many matches were redacted per pattern.
  email: number
  ipv4: number
  ipv6: number
  jwt: number
  custom: number
}

export type LogRedactorResult = {
  // Final redacted text output.
  output: string
  // Summary counts so the UI can show what was changed.
  counts: LogRedactorCounts
}

export type LogRedactorErrorCode = 'invalidRegex'

export class LogRedactorError extends Error {
  code: LogRedactorErrorCode

  constructor(code: LogRedactorErrorCode, message: string) {
    super(message)
    this.name = 'LogRedactorError'
    this.code = code
  }
}

// Common token patterns used in logs or error traces.
const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
const IPV4_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
const IPV6_REGEX = /\b(?:[A-F0-9]{1,4}:){2,7}[A-F0-9]{1,4}\b/gi
const JWT_REGEX = /\b[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g

const ensureGlobal = (regex: RegExp): RegExp => {
  // Ensure regex matching is global so we can replace all occurrences.
  if (regex.global) {
    return regex
  }
  return new RegExp(regex.source, `${regex.flags}g`)
}

const applyRedaction = (
  text: string,
  regex: RegExp,
  replacement: string,
): { output: string; count: number } => {
  // Apply a replacement while counting how many matches were found.
  const globalRegex = ensureGlobal(regex)
  const matches = text.match(globalRegex)
  if (!matches) {
    return { output: text, count: 0 }
  }
  return { output: text.replace(globalRegex, replacement), count: matches.length }
}

const buildCustomRegex = (pattern: string, flags?: string): RegExp => {
  // Compile custom patterns with error handling so the UI can surface feedback.
  try {
    const rawFlags = flags ?? ''
    const finalFlags = rawFlags.includes('g') ? rawFlags : `${rawFlags}g`
    return new RegExp(pattern, finalFlags)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid regex pattern'
    throw new LogRedactorError('invalidRegex', message)
  }
}

export const redactText = (input: string, options: LogRedactorOptions): LogRedactorResult => {
  // Run through each enabled pattern in a stable order to avoid overlap issues.
  let output = input
  const counts: LogRedactorCounts = {
    email: 0,
    ipv4: 0,
    ipv6: 0,
    jwt: 0,
    custom: 0,
  }

  if (options.maskJwt) {
    // JWTs are redacted first because they can embed email-like strings.
    const result = applyRedaction(output, JWT_REGEX, '[REDACTED_JWT]')
    output = result.output
    counts.jwt += result.count
  }

  if (options.maskEmail) {
    // Emails are commonly present in logs; mask them with a clear label.
    const result = applyRedaction(output, EMAIL_REGEX, '[REDACTED_EMAIL]')
    output = result.output
    counts.email += result.count
  }

  if (options.maskIpv6) {
    // IPv6 redaction runs before IPv4 to avoid partial replacements.
    const result = applyRedaction(output, IPV6_REGEX, '[REDACTED_IP]')
    output = result.output
    counts.ipv6 += result.count
  }

  if (options.maskIpv4) {
    // IPv4 masking uses a broad pattern to avoid missing common log formats.
    const result = applyRedaction(output, IPV4_REGEX, '[REDACTED_IP]')
    output = result.output
    counts.ipv4 += result.count
  }

  if (options.customPattern) {
    // Custom patterns are last so project-specific secrets remain masked.
    const customRegex = buildCustomRegex(options.customPattern, options.customFlags)
    const label = options.customLabel?.trim() || '[REDACTED_CUSTOM]'
    const result = applyRedaction(output, customRegex, label)
    output = result.output
    counts.custom += result.count
  }

  return { output, counts }
}
