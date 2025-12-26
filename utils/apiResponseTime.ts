// Helper utilities for the API response time chart tool.
// These helpers are pure functions so they can be tested in isolation.

export type ResponseSample = {
  // Sequential index for display ordering.
  index: number
  // Duration in milliseconds for the request.
  durationMs: number
  // HTTP status code when available.
  status?: number
  // Whether the request completed successfully.
  ok: boolean
  // Error message when a request fails.
  error?: string
}

export const parseHeaderLines = (input: string): Record<string, string> => {
  // Convert "Header: value" text lines into a headers object for fetch().
  const headers: Record<string, string> = {}

  input.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return

    // Use the first colon as the separator to support values with ":" later.
    const separatorIndex = trimmed.indexOf(':')
    if (separatorIndex <= 0) return

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()

    if (key) {
      headers[key] = value
    }
  })

  return headers
}

export const buildCsv = (samples: ResponseSample[]): string => {
  // Escape values with quotes to ensure a valid CSV format.
  const rows = samples.map((sample) => {
    const status = sample.status ?? ''
    const error = sample.error ? `"${sample.error.replace(/"/g, '""')}"` : ''
    return [sample.index, status, sample.ok, sample.durationMs.toFixed(2), error].join(',')
  })

  return ['index,status,ok,duration_ms,error', ...rows].join('\n')
}
