// PDF metadata extractor for basic Info dictionary fields.
// This implementation uses regex heuristics and is not a full PDF parser.

export type PdfMetadata = {
  title?: string
  author?: string
  creator?: string
  producer?: string
  creationDate?: string
  modDate?: string
}

const extractField = (input: string, field: string): string | undefined => {
  // Match "/Field (value)" patterns commonly found in PDF Info dictionaries.
  const regex = new RegExp(`/${field}\\s*\\(([^)]*)\\)`, 'i')
  const match = input.match(regex)
  return match ? match[1] : undefined
}

export const extractPdfMetadata = (input: string): PdfMetadata => {
  // PDF files can be binary, so the caller should provide a decoded text view.
  return {
    title: extractField(input, 'Title'),
    author: extractField(input, 'Author'),
    creator: extractField(input, 'Creator'),
    producer: extractField(input, 'Producer'),
    creationDate: extractField(input, 'CreationDate'),
    modDate: extractField(input, 'ModDate'),
  }
}
