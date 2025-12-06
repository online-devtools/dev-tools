'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function PortGeneratorTool() {
  const [output, setOutput] = useState('')
  const [count, setCount] = useState('1')
  const [min, setMin] = useState('1024')
  const [max, setMax] = useState('65535')

  const generatePorts = () => {
    try {
      const num = parseInt(count)
      const minPort = parseInt(min)
      const maxPort = parseInt(max)

      if (isNaN(num) || num < 1 || num > 1000) {
        setOutput('개수는 1에서 1000 사이여야 합니다.')
        return
      }

      if (isNaN(minPort) || isNaN(maxPort) || minPort < 0 || maxPort > 65535 || minPort >= maxPort) {
        setOutput('올바른 포트 범위를 입력해주세요 (0-65535).')
        return
      }

      const ports: number[] = []
      for (let i = 0; i < num; i++) {
        const port = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort
        ports.push(port)
      }

      setOutput(ports.join('\n'))
    } catch (error) {
      setOutput('포트 생성 중 오류가 발생했습니다.')
    }
  }

  return (
    <ToolCard
      title="Random Port Generator"
      description="랜덤 네트워크 포트 번호를 생성합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            생성 개수
          </label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="1"
            max="1000"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              최소 포트
            </label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
              max="65535"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              최대 포트
            </label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
              max="65535"
            />
          </div>
        </div>

        <button
          onClick={generatePorts}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          생성
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label="생성된 포트"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">포트 범위</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• 0-1023: Well-known ports (시스템 포트)</li>
            <li>• 1024-49151: Registered ports (등록된 포트)</li>
            <li>• 49152-65535: Dynamic/Private ports (동적 포트)</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
