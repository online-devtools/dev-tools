'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

const NATO_ALPHABET: { [key: string]: string } = {
  'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta',
  'E': 'Echo', 'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel',
  'I': 'India', 'J': 'Juliett', 'K': 'Kilo', 'L': 'Lima',
  'M': 'Mike', 'N': 'November', 'O': 'Oscar', 'P': 'Papa',
  'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango',
  'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray',
  'Y': 'Yankee', 'Z': 'Zulu',
  '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three',
  '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven',
  '8': 'Eight', '9': 'Nine'
}

export default function NATOAlphabetTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const convert = (value: string) => {
    const result = value
      .toUpperCase()
      .split('')
      .map(char => NATO_ALPHABET[char] || char)
      .join(' ')
    setOutput(result)
  }

  return (
    <ToolCard
      title="Text to NATO Alphabet"
      description="텍스트를 NATO 음성 문자로 변환합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={(value) => {
            setInput(value)
            convert(value)
          }}
          label="입력 텍스트"
          placeholder="ABC123"
        />

        <TextAreaWithCopy
          value={output}
          readOnly
          label="NATO 음성 문자"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">예시</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• ABC → Alpha Bravo Charlie</li>
            <li>• SOS → Sierra Oscar Sierra</li>
            <li>• A1B2 → Alpha One Bravo Two</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
