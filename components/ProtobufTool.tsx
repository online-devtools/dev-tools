'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

// Wire types in Protocol Buffers
const WIRE_TYPES: Record<number, string> = {
  0: 'Varint',
  1: '64-bit',
  2: 'Length-delimited',
  3: 'Start group (deprecated)',
  4: 'End group (deprecated)',
  5: '32-bit',
}

interface DecodedField {
  fieldNumber: number
  wireType: number
  wireTypeName: string
  value: string | number | Uint8Array
  displayValue: string
  offset: number
  length: number
}

function decodeVarint(bytes: Uint8Array, offset: number): { value: bigint; bytesRead: number } {
  let result = BigInt(0)
  let shift = 0
  let bytesRead = 0

  while (offset + bytesRead < bytes.length) {
    const byte = bytes[offset + bytesRead]
    result |= BigInt(byte & 0x7f) << BigInt(shift)
    bytesRead++

    if ((byte & 0x80) === 0) {
      break
    }
    shift += 7

    if (bytesRead > 10) {
      throw new Error('Varint too long')
    }
  }

  return { value: result, bytesRead }
}

function decodeZigZag(value: bigint): bigint {
  return (value >> BigInt(1)) ^ -(value & BigInt(1))
}

function decodeProtobuf(bytes: Uint8Array): DecodedField[] {
  const fields: DecodedField[] = []
  let offset = 0

  while (offset < bytes.length) {
    const startOffset = offset

    // Read tag (field number + wire type)
    const { value: tag, bytesRead: tagBytes } = decodeVarint(bytes, offset)
    offset += tagBytes

    const wireType = Number(tag & BigInt(0x07))
    const fieldNumber = Number(tag >> BigInt(3))

    if (fieldNumber === 0) {
      throw new Error('Invalid field number 0')
    }

    let value: string | number | Uint8Array
    let displayValue: string
    let fieldLength = tagBytes

    switch (wireType) {
      case 0: { // Varint
        const { value: varintValue, bytesRead } = decodeVarint(bytes, offset)
        offset += bytesRead
        fieldLength += bytesRead
        value = Number(varintValue)
        const zigzag = decodeZigZag(varintValue)
        displayValue = `${varintValue} (signed: ${zigzag}, bool: ${varintValue !== BigInt(0)})`
        break
      }

      case 1: { // 64-bit
        if (offset + 8 > bytes.length) throw new Error('Unexpected end of data')
        const view = new DataView(bytes.buffer, bytes.byteOffset + offset, 8)
        const fixed64 = view.getBigUint64(0, true)
        const double = view.getFloat64(0, true)
        offset += 8
        fieldLength += 8
        value = Number(fixed64)
        displayValue = `${fixed64} (double: ${double.toFixed(6)})`
        break
      }

      case 2: { // Length-delimited
        const { value: length, bytesRead } = decodeVarint(bytes, offset)
        offset += bytesRead
        fieldLength += bytesRead

        const dataLength = Number(length)
        if (offset + dataLength > bytes.length) throw new Error('Unexpected end of data')

        const data = bytes.slice(offset, offset + dataLength)
        offset += dataLength
        fieldLength += dataLength
        value = data

        // Try to interpret as string
        try {
          const decoder = new TextDecoder('utf-8', { fatal: true })
          const str = decoder.decode(data)
          // Check if it's printable
          if (/^[\x20-\x7E\n\r\t]*$/.test(str)) {
            displayValue = `"${str.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}"`
          } else {
            displayValue = `bytes[${dataLength}]: ${Array.from(data.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ')}${dataLength > 16 ? '...' : ''}`
          }
        } catch {
          displayValue = `bytes[${dataLength}]: ${Array.from(data.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ')}${dataLength > 16 ? '...' : ''}`
        }
        break
      }

      case 5: { // 32-bit
        if (offset + 4 > bytes.length) throw new Error('Unexpected end of data')
        const view = new DataView(bytes.buffer, bytes.byteOffset + offset, 4)
        const fixed32 = view.getUint32(0, true)
        const float = view.getFloat32(0, true)
        offset += 4
        fieldLength += 4
        value = fixed32
        displayValue = `${fixed32} (float: ${float.toFixed(6)})`
        break
      }

      default:
        throw new Error(`Unknown wire type ${wireType}`)
    }

    fields.push({
      fieldNumber,
      wireType,
      wireTypeName: WIRE_TYPES[wireType] || 'Unknown',
      value,
      displayValue,
      offset: startOffset,
      length: fieldLength,
    })
  }

  return fields
}

function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/[\s\n\r]/g, '').replace(/^0x/i, '')
  if (!/^[0-9a-fA-F]*$/.test(cleanHex)) {
    throw new Error('Invalid hex string')
  }
  if (cleanHex.length % 2 !== 0) {
    throw new Error('Hex string must have even length')
  }

  const bytes = new Uint8Array(cleanHex.length / 2)
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16)
  }
  return bytes
}

function base64ToBytes(base64: string): Uint8Array {
  const cleanBase64 = base64.replace(/[\s\n\r]/g, '')
  const binary = atob(cleanBase64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export default function ProtobufTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [inputFormat, setInputFormat] = useState<'hex' | 'base64'>('hex')
  const [fields, setFields] = useState<DecodedField[]>([])
  const [error, setError] = useState('')

  const handleDecode = () => {
    setError('')
    setFields([])

    if (!input.trim()) {
      setError(t('protobuf.error.empty'))
      return
    }

    try {
      const bytes = inputFormat === 'hex' ? hexToBytes(input) : base64ToBytes(input)
      const decoded = decodeProtobuf(bytes)
      setFields(decoded)
    } catch (e) {
      setError(t('protobuf.error.decode') + ': ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  const loadSample = () => {
    // Sample protobuf: { 1: "Hello", 2: 123, 3: true }
    // Field 1 (string): 0a 05 48 65 6c 6c 6f
    // Field 2 (varint): 10 7b
    // Field 3 (varint): 18 01
    setInput('0a 05 48 65 6c 6c 6f 10 7b 18 01')
    setInputFormat('hex')
    setError('')
    setFields([])
  }

  const handleClear = () => {
    setInput('')
    setFields([])
    setError('')
  }

  return (
    <ToolCard
      title={t('protobuf.title')}
      description={t('protobuf.description')}
    >
      <div className="space-y-6">
        {/* Input Format */}
        <div className="flex gap-2">
          <button
            onClick={() => setInputFormat('hex')}
            className={`px-4 py-2 rounded transition-colors ${
              inputFormat === 'hex'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Hex
          </button>
          <button
            onClick={() => setInputFormat('base64')}
            className={`px-4 py-2 rounded transition-colors ${
              inputFormat === 'base64'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Base64
          </button>
        </div>

        {/* Input */}
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          placeholder={
            inputFormat === 'hex'
              ? t('protobuf.input.placeholder.hex')
              : t('protobuf.input.placeholder.base64')
          }
          label={t('protobuf.input.label')}
          rows={5}
        />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDecode}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {t('protobuf.actions.decode')}
          </button>
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {t('protobuf.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            {t('protobuf.actions.clear')}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
            {error}
          </div>
        )}

        {/* Results */}
        {fields.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {t('protobuf.results.title')} ({fields.length} {t('protobuf.results.fields')})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left">{t('protobuf.table.field')}</th>
                    <th className="px-3 py-2 text-left">{t('protobuf.table.wireType')}</th>
                    <th className="px-3 py-2 text-left">{t('protobuf.table.value')}</th>
                    <th className="px-3 py-2 text-left">{t('protobuf.table.offset')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {fields.map((field, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-3 py-2 font-mono font-semibold text-blue-600">
                        {field.fieldNumber}
                      </td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-1">
                          <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs font-mono">
                            {field.wireType}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {field.wireTypeName}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-sm break-all max-w-md">
                        {field.displayValue}
                      </td>
                      <td className="px-3 py-2 text-gray-500 font-mono text-xs">
                        {field.offset} ({field.length}B)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wire Type Reference */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
            {t('protobuf.wireTypes.title')}
          </h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-300">
            <div><span className="font-mono">0</span> - Varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum</div>
            <div><span className="font-mono">1</span> - 64-bit: fixed64, sfixed64, double</div>
            <div><span className="font-mono">2</span> - Length-delimited: string, bytes, embedded messages, packed repeated</div>
            <div><span className="font-mono">5</span> - 32-bit: fixed32, sfixed32, float</div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            {t('protobuf.info.title')}
          </h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• {t('protobuf.info.item1')}</li>
            <li>• {t('protobuf.info.item2')}</li>
            <li>• {t('protobuf.info.item3')}</li>
            <li>• {t('protobuf.info.item4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
