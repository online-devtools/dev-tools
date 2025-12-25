import { describe, expect, it } from 'vitest'
import {
  JsonFlattenError,
  flattenJson,
  unflattenJson,
  toFlattenedJsonString,
  toNestedJsonString,
} from '@/utils/jsonFlatten'

// JSON flatten/unflatten behavior is critical for data pipelines and log processing workflows.
describe('jsonFlatten utils', () => {
  it('flattens nested objects and arrays into dotted paths', () => {
    // The input includes nested objects and arrays to verify bracket indexing is applied.
    const input = JSON.stringify({
      user: { name: 'Ada', tags: ['dev', 'ops'] },
      active: true,
    })

    // Expect each nested value to map to a dotted path with array indexes.
    expect(flattenJson(input)).toEqual({
      'user.name': 'Ada',
      'user.tags[0]': 'dev',
      'user.tags[1]': 'ops',
      active: true,
    })
  })

  it('round-trips flattened JSON back to the original structure', () => {
    // The round-trip ensures flatten/unflatten stay consistent for nested payloads.
    const original = {
      id: 7,
      profile: { roles: ['admin', 'editor'] },
    }
    // Flatten to a JSON string so the unflatten step mirrors UI usage.
    const flattened = toFlattenedJsonString(JSON.stringify(original))
    // Parse the nested JSON output to compare with the original object.
    const restored = JSON.parse(toNestedJsonString(flattened))

    // The round-trip output should equal the original object structure.
    expect(restored).toEqual(original)
  })

  it('throws a structured error for invalid JSON input', () => {
    // Provide malformed JSON so the parser raises a JsonFlattenError.
    try {
      // Trigger the parsing error with malformed JSON input.
      flattenJson('{bad json')
      throw new Error('Expected flattenJson to throw')
    } catch (error) {
      // The error should be typed and expose the specific code.
      expect(error).toBeInstanceOf(JsonFlattenError)
      const typed = error as JsonFlattenError
      expect(typed.code).toBe('invalidJson')
    }
  })

  it('throws a structured error when unflatten input is not an object', () => {
    // Unflatten expects a flat object; arrays/strings are not supported.
    try {
      // Provide a JSON array so unflatten sees a non-object input.
      unflattenJson('["not", "an", "object"]')
      throw new Error('Expected unflattenJson to throw')
    } catch (error) {
      // Confirm the error type and code for UI error mapping.
      expect(error).toBeInstanceOf(JsonFlattenError)
      const typed = error as JsonFlattenError
      expect(typed.code).toBe('notObject')
    }
  })
})
