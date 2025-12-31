'use client'

import { useState, useMemo } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

interface AsciiChar {
  dec: number
  hex: string
  oct: string
  bin: string
  char: string
  name: string
  category: 'control' | 'printable' | 'extended'
}

const controlCharNames: Record<number, string> = {
  0: 'NUL (Null)',
  1: 'SOH (Start of Heading)',
  2: 'STX (Start of Text)',
  3: 'ETX (End of Text)',
  4: 'EOT (End of Transmission)',
  5: 'ENQ (Enquiry)',
  6: 'ACK (Acknowledge)',
  7: 'BEL (Bell)',
  8: 'BS (Backspace)',
  9: 'HT (Horizontal Tab)',
  10: 'LF (Line Feed)',
  11: 'VT (Vertical Tab)',
  12: 'FF (Form Feed)',
  13: 'CR (Carriage Return)',
  14: 'SO (Shift Out)',
  15: 'SI (Shift In)',
  16: 'DLE (Data Link Escape)',
  17: 'DC1 (Device Control 1)',
  18: 'DC2 (Device Control 2)',
  19: 'DC3 (Device Control 3)',
  20: 'DC4 (Device Control 4)',
  21: 'NAK (Negative Acknowledge)',
  22: 'SYN (Synchronous Idle)',
  23: 'ETB (End of Trans. Block)',
  24: 'CAN (Cancel)',
  25: 'EM (End of Medium)',
  26: 'SUB (Substitute)',
  27: 'ESC (Escape)',
  28: 'FS (File Separator)',
  29: 'GS (Group Separator)',
  30: 'RS (Record Separator)',
  31: 'US (Unit Separator)',
  32: 'Space',
  127: 'DEL (Delete)',
}

function generateAsciiTable(): AsciiChar[] {
  const chars: AsciiChar[] = []

  for (let i = 0; i <= 127; i++) {
    let char = ''
    let name = ''
    let category: 'control' | 'printable' | 'extended' = 'printable'

    if (i < 32 || i === 127) {
      category = 'control'
      char = i < 32 ? `^${String.fromCharCode(64 + i)}` : '^?'
      name = controlCharNames[i] || ''
    } else if (i === 32) {
      char = '␣'
      name = controlCharNames[32]
    } else {
      char = String.fromCharCode(i)
      name = char
    }

    chars.push({
      dec: i,
      hex: i.toString(16).toUpperCase().padStart(2, '0'),
      oct: i.toString(8).padStart(3, '0'),
      bin: i.toString(2).padStart(8, '0'),
      char,
      name,
      category,
    })
  }

  return chars
}

export default function AsciiTableTool() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<'all' | 'control' | 'printable'>('all')
  const [search, setSearch] = useState('')
  const [convertInput, setConvertInput] = useState('')
  const [convertMode, setConvertMode] = useState<'text' | 'dec' | 'hex'>('text')

  const asciiTable = useMemo(() => generateAsciiTable(), [])

  const filteredTable = useMemo(() => {
    let result = asciiTable

    if (filter !== 'all') {
      result = result.filter(c => c.category === filter)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(c =>
        c.dec.toString().includes(searchLower) ||
        c.hex.toLowerCase().includes(searchLower) ||
        c.char.toLowerCase().includes(searchLower) ||
        c.name.toLowerCase().includes(searchLower)
      )
    }

    return result
  }, [asciiTable, filter, search])

  const convertResult = useMemo(() => {
    if (!convertInput.trim()) return ''

    try {
      switch (convertMode) {
        case 'text': {
          const chars = convertInput.split('')
          return chars.map(c => {
            const code = c.charCodeAt(0)
            return `${c}: Dec=${code}, Hex=0x${code.toString(16).toUpperCase()}, Oct=${code.toString(8)}, Bin=${code.toString(2)}`
          }).join('\n')
        }
        case 'dec': {
          const nums = convertInput.split(/[\s,]+/).filter(Boolean)
          return nums.map(n => {
            const code = parseInt(n, 10)
            if (isNaN(code) || code < 0 || code > 127) return `${n}: Invalid`
            const char = code < 32 || code === 127 ? controlCharNames[code] : String.fromCharCode(code)
            return `${n}: "${char}", Hex=0x${code.toString(16).toUpperCase()}`
          }).join('\n')
        }
        case 'hex': {
          const nums = convertInput.split(/[\s,]+/).filter(Boolean)
          return nums.map(n => {
            const hex = n.replace(/^0x/i, '')
            const code = parseInt(hex, 16)
            if (isNaN(code) || code < 0 || code > 127) return `${n}: Invalid`
            const char = code < 32 || code === 127 ? controlCharNames[code] : String.fromCharCode(code)
            return `0x${hex.toUpperCase()}: "${char}", Dec=${code}`
          }).join('\n')
        }
      }
    } catch {
      return 'Error'
    }
  }, [convertInput, convertMode])

  return (
    <ToolCard
      title={t('ascii.title')}
      description={t('ascii.description')}
    >
      <div className="space-y-6">
        {/* Converter */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">{t('ascii.converter.title')}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setConvertMode('text')}
              className={`px-3 py-1 text-sm rounded ${convertMode === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              {t('ascii.converter.text')}
            </button>
            <button
              onClick={() => setConvertMode('dec')}
              className={`px-3 py-1 text-sm rounded ${convertMode === 'dec' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              {t('ascii.converter.decimal')}
            </button>
            <button
              onClick={() => setConvertMode('hex')}
              className={`px-3 py-1 text-sm rounded ${convertMode === 'hex' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              {t('ascii.converter.hex')}
            </button>
          </div>
          <input
            type="text"
            value={convertInput}
            onChange={(e) => setConvertInput(e.target.value)}
            placeholder={
              convertMode === 'text' ? t('ascii.converter.placeholder.text') :
              convertMode === 'dec' ? t('ascii.converter.placeholder.dec') :
              t('ascii.converter.placeholder.hex')
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          />
          {convertResult && (
            <pre className="mt-3 p-3 bg-white dark:bg-gray-800 rounded text-sm font-mono overflow-x-auto whitespace-pre-wrap">
              {convertResult}
            </pre>
          )}
        </div>

        {/* Filter and Search */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              {t('ascii.filter.all')}
            </button>
            <button
              onClick={() => setFilter('control')}
              className={`px-3 py-1 text-sm rounded ${filter === 'control' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              {t('ascii.filter.control')}
            </button>
            <button
              onClick={() => setFilter('printable')}
              className={`px-3 py-1 text-sm rounded ${filter === 'printable' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              {t('ascii.filter.printable')}
            </button>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ascii.search.placeholder')}
            className="flex-1 min-w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* ASCII Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left">Dec</th>
                <th className="px-3 py-2 text-left">Hex</th>
                <th className="px-3 py-2 text-left">Oct</th>
                <th className="px-3 py-2 text-left">Bin</th>
                <th className="px-3 py-2 text-left">Char</th>
                <th className="px-3 py-2 text-left">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTable.map(row => (
                <tr
                  key={row.dec}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    row.category === 'control' ? 'bg-red-50 dark:bg-red-900/10' : ''
                  }`}
                >
                  <td className="px-3 py-2 font-mono">{row.dec}</td>
                  <td className="px-3 py-2 font-mono">0x{row.hex}</td>
                  <td className="px-3 py-2 font-mono">{row.oct}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.bin}</td>
                  <td className="px-3 py-2 font-mono text-lg">{row.char}</td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{row.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Reference */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">{t('ascii.quickref.special')}</h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1 font-mono">
              <div>Tab: 9 (0x09)</div>
              <div>Newline: 10 (0x0A)</div>
              <div>Carriage Return: 13 (0x0D)</div>
              <div>Space: 32 (0x20)</div>
              <div>Delete: 127 (0x7F)</div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">{t('ascii.quickref.ranges')}</h4>
            <div className="text-sm text-green-700 dark:text-green-300 space-y-1 font-mono">
              <div>0-9: 48-57 (0x30-0x39)</div>
              <div>A-Z: 65-90 (0x41-0x5A)</div>
              <div>a-z: 97-122 (0x61-0x7A)</div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
