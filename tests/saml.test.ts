import { describe, expect, it } from 'vitest'
import { decodeAndParseSaml } from '@/utils/saml'

// SAML decoding and parsing should surface key identity fields for debugging.
describe('saml utils', () => {
  it('decodes base64 SAML and extracts issuer, nameId, and attributes', () => {
    // Base64-encoded sample SAML response with issuer, NameID, and role attribute.
    const input = 'PHNhbWxwOlJlc3BvbnNlIHhtbG5zOnNhbWxwPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6cHJvdG9jb2wiIHhtbG5zOnNhbWw9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iPjxzYW1sOklzc3Vlcj5odHRwczovL2lkcC5leGFtcGxlLmNvbTwvc2FtbDpJc3N1ZXI+PHNhbWw6QXNzZXJ0aW9uPjxzYW1sOlN1YmplY3Q+PHNhbWw6TmFtZUlEPnVzZXJAZXhhbXBsZS5jb208L3NhbWw6TmFtZUlEPjwvc2FtbDpTdWJqZWN0PjxzYW1sOkNvbmRpdGlvbnM+PHNhbWw6QXVkaWVuY2VSZXN0cmljdGlvbj48c2FtbDpBdWRpZW5jZT5odHRwczovL3NwLmV4YW1wbGUuY29tPC9zYW1sOkF1ZGllbmNlPjwvc2FtbDpBdWRpZW5jZVJlc3RyaWN0aW9uPjwvc2FtbDpDb25kaXRpb25zPjxzYW1sOkF0dHJpYnV0ZVN0YXRlbWVudD48c2FtbDpBdHRyaWJ1dGUgTmFtZT0icm9sZSI+PHNhbWw6QXR0cmlidXRlVmFsdWU+YWRtaW48L3NhbWw6QXR0cmlidXRlVmFsdWU+PC9zYW1sOkF0dHJpYnV0ZT48L3NhbWw6QXR0cmlidXRlU3RhdGVtZW50Pjwvc2FtbDpBc3NlcnRpb24+PC9zYW1scDpSZXNwb25zZT4='

    const result = decodeAndParseSaml(input)

    expect(result.issuer).toBe('https://idp.example.com')
    expect(result.nameId).toBe('user@example.com')
    expect(result.audience).toBe('https://sp.example.com')
    expect(result.attributes.role).toEqual(['admin'])
  })
})
