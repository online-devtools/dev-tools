import { describe, expect, it } from 'vitest'
import { extractPdfMetadata } from '@/utils/pdfMetadata'

// PDF metadata extraction should find common Info dictionary fields.
describe('pdfMetadata utils', () => {
  it('extracts title, author, and dates from PDF text', () => {
    const input = `
      %PDF-1.4
      1 0 obj
      << /Title (My Doc) /Author (Ada) /Producer (PDF Producer)
         /Creator (Generator) /CreationDate (D:20240101000000Z) /ModDate (D:20240102000000Z) >>
      endobj
    `

    const meta = extractPdfMetadata(input)

    expect(meta.title).toBe('My Doc')
    expect(meta.author).toBe('Ada')
    expect(meta.producer).toBe('PDF Producer')
    expect(meta.creator).toBe('Generator')
    expect(meta.creationDate).toBe('D:20240101000000Z')
    expect(meta.modDate).toBe('D:20240102000000Z')
  })
})
