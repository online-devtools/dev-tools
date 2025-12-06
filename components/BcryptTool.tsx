'use client'

import { useState } from 'react'
import bcrypt from 'bcryptjs'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function BcryptTool() {
  const [password, setPassword] = useState('')
  const [rounds, setRounds] = useState('10')
  const [hash, setHash] = useState('')
  const [comparePassword, setComparePassword] = useState('')
  const [compareHash, setCompareHash] = useState('')
  const [compareResult, setCompareResult] = useState('')

  const generateHash = async () => {
    try {
      if (!password) {
        setHash('비밀번호를 입력해주세요.')
        return
      }

      const saltRounds = parseInt(rounds)
      if (isNaN(saltRounds) || saltRounds < 4 || saltRounds > 16) {
        setHash('Rounds는 4에서 16 사이여야 합니다.')
        return
      }

      const hashed = await bcrypt.hash(password, saltRounds)
      setHash(hashed)
    } catch (error) {
      setHash('해시 생성 중 오류가 발생했습니다.')
    }
  }

  const comparePasswords = async () => {
    try {
      if (!comparePassword || !compareHash) {
        setCompareResult('비밀번호와 해시를 모두 입력해주세요.')
        return
      }

      const isMatch = await bcrypt.compare(comparePassword, compareHash)
      setCompareResult(isMatch ? '✅ 일치합니다!' : '❌ 일치하지 않습니다.')
    } catch (error) {
      setCompareResult('비교 중 오류가 발생했습니다. 올바른 bcrypt 해시인지 확인해주세요.')
    }
  }

  return (
    <ToolCard
      title="Bcrypt"
      description="Bcrypt를 사용하여 비밀번호를 안전하게 해싱하고 검증합니다"
    >
      <div className="space-y-6">
        {/* Hash Generation */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">해시 생성</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              비밀번호
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="해싱할 비밀번호 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Salt Rounds (4-16)
            </label>
            <input
              type="number"
              value={rounds}
              onChange={(e) => setRounds(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="4"
              max="16"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              값이 클수록 안전하지만 처리 시간이 늘어납니다
            </p>
          </div>

          <button
            onClick={generateHash}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            해시 생성
          </button>

          <TextAreaWithCopy
            value={hash}
            readOnly
            label="생성된 해시"
          />
        </div>

        {/* Hash Comparison */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">해시 검증</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              비밀번호
            </label>
            <input
              type="text"
              value={comparePassword}
              onChange={(e) => setComparePassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="검증할 비밀번호 입력"
            />
          </div>

          <TextAreaWithCopy
            value={compareHash}
            onChange={setCompareHash}
            label="Bcrypt 해시"
            placeholder="검증할 bcrypt 해시 입력"
          />

          <button
            onClick={comparePasswords}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            비교
          </button>

          {compareResult && (
            <div className={`p-3 rounded-lg text-center font-medium ${
              compareResult.includes('✅')
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {compareResult}
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  )
}
