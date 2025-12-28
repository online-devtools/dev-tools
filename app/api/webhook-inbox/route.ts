const inbox: WebhookEntry[] = []

type WebhookEntry = {
  id: string
  method: string
  url: string
  headers: Record<string, string>
  body: string
  receivedAt: string
}

const MAX_ENTRIES = 20

const normalizeHeaders = (headers: Headers): Record<string, string> => {
  const result: Record<string, string> = {}
  headers.forEach((value, key) => {
    result[key] = value
  })
  return result
}

export async function POST(request: Request) {
  const body = await request.text()
  const entry: WebhookEntry = {
    id: crypto.randomUUID(),
    method: request.method,
    url: request.url,
    headers: normalizeHeaders(request.headers),
    body,
    receivedAt: new Date().toISOString(),
  }

  inbox.unshift(entry)
  if (inbox.length > MAX_ENTRIES) {
    inbox.length = MAX_ENTRIES
  }

  return Response.json({ ok: true, id: entry.id })
}

export async function GET() {
  return Response.json({ items: inbox })
}

export async function DELETE() {
  inbox.length = 0
  return Response.json({ ok: true })
}
