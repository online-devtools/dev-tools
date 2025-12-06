'use client'

import { useState, useEffect } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function ASCIIArtTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [font, setFont] = useState('Standard')
  const [error, setError] = useState('')
  const [figlet, setFiglet] = useState<any>(null)

  useEffect(() => {
    // Dynamically import figlet on client side
    import('figlet').then((module) => {
      setFiglet(module.default)
    }).catch((err) => {
      setError('ASCII Art 라이브러리 로드에 실패했습니다')
    })
  }, [])

  const fonts = [
    'Standard',
    'Banner',
    'Big',
    'Block',
    'Bubble',
    'Digital',
    'Doom',
    'Ghost',
    'Graffiti',
    'Slant',
    'Small',
    'Star Wars',
    '3-D',
    'Colossal',
    'Crawford',
    'Epic',
    'Isometric1',
    'Letters',
    'Mini',
    'Script',
    'Shadow',
    'Speed',
  ]

  const generateArt = () => {
    setError('')
    setOutput('')

    if (!figlet) {
      setError('ASCII Art 라이브러리가 아직 로드되지 않았습니다')
      return
    }

    if (!input.trim()) {
      setError('텍스트를 입력해주세요')
      return
    }

    try {
      figlet.text(
        input,
        {
          font: font,
          horizontalLayout: 'default',
          verticalLayout: 'default',
        },
        (err: Error | null, result: string | undefined) => {
          if (err) {
            setError(err.message || 'ASCII Art 생성 중 오류가 발생했습니다')
          } else {
            setOutput(result || '')
          }
        }
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ASCII Art 생성 중 오류가 발생했습니다')
    }
  }

  return (
    <ToolCard
      title="ASCII Art Generator"
      description="텍스트를 멋진 ASCII 아트로 변환합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            텍스트 입력
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hello World"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            최대 50자까지 입력 가능합니다
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            폰트 선택
          </label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {fonts.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generateArt}
          disabled={!figlet}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          🎨 ASCII Art 생성
        </button>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          readOnly
          label="ASCII Art 결과"
          rows={15}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 사용 팁</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• 짧은 텍스트일수록 더 깔끔한 결과를 얻을 수 있습니다</li>
            <li>• 다양한 폰트를 시도해보세요</li>
            <li>• 결과를 복사하여 소스 코드 주석이나 README에 활용하세요</li>
            <li>• 고정폭 폰트(monospace)에서 가장 잘 보입니다</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
