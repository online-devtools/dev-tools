'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'

interface Param {
  key: string
  value: string
  type: 'string' | 'number' | 'null'
}

export default function MyBatisConverter() {
  const [mybatisQuery, setMybatisQuery] = useState('')
  const [params, setParams] = useState<Param[]>([])
  const [convertedQuery, setConvertedQuery] = useState('')
  const [error, setError] = useState('')

  // MyBatis 쿼리에서 파라미터 추출
  const extractParams = (query: string) => {
    const paramPattern = /#\{([^}]+)\}/g
    const matches = query.matchAll(paramPattern)
    const paramSet = new Set<string>()

    for (const match of matches) {
      paramSet.add(match[1])
    }

    const newParams: Param[] = Array.from(paramSet).map(key => ({
      key,
      value: '',
      type: 'string' as const
    }))

    setParams(newParams)
  }

  // MyBatis 쿼리 입력 핸들러
  const handleQueryChange = (query: string) => {
    setMybatisQuery(query)
    extractParams(query)
    setError('')
    setConvertedQuery('')
  }

  // 파라미터 값 변경 핸들러
  const handleParamChange = (index: number, field: keyof Param, value: string) => {
    const newParams = [...params]
    if (field === 'type') {
      newParams[index][field] = value as 'string' | 'number' | 'null'
    } else {
      newParams[index][field] = value
    }
    setParams(newParams)
  }

  // SQL 변환
  const convertToSQL = () => {
    try {
      setError('')

      if (!mybatisQuery.trim()) {
        setError('MyBatis 쿼리를 입력해주세요.')
        return
      }

      let sql = mybatisQuery

      // 각 파라미터를 실제 값으로 치환
      params.forEach(param => {
        const pattern = new RegExp(`#\\{${param.key}\\}`, 'g')
        let replacement = ''

        switch (param.type) {
          case 'string':
            replacement = `'${param.value.replace(/'/g, "''")}'` // SQL Injection 방지
            break
          case 'number':
            replacement = param.value || '0'
            break
          case 'null':
            replacement = 'NULL'
            break
        }

        sql = sql.replace(pattern, replacement)
      })

      // ${} 형태의 파라미터 처리 (주의: SQL Injection 위험)
      const dollarParams = sql.matchAll(/\$\{([^}]+)\}/g)
      const missingDollarParams = []

      for (const match of dollarParams) {
        const paramName = match[1]
        const param = params.find(p => p.key === paramName)
        if (param) {
          sql = sql.replace(match[0], param.value)
        } else {
          missingDollarParams.push(paramName)
        }
      }

      if (missingDollarParams.length > 0) {
        setError(`\${} 파라미터 값이 필요합니다: ${missingDollarParams.join(', ')}`)
      }

      setConvertedQuery(sql)
    } catch (e) {
      console.error('Conversion error:', e)
      setError(`변환 실패: ${e instanceof Error ? e.message : '오류가 발생했습니다.'}`)
    }
  }

  // 샘플 쿼리 로드
  const loadSample = () => {
    const sample = `SELECT
    u.user_id,
    u.user_name,
    u.email,
    u.created_at
FROM users u
WHERE u.user_id = #{userId}
    AND u.status = #{status}
    AND u.created_at >= #{startDate}
ORDER BY u.created_at DESC
LIMIT #{limit}`

    handleQueryChange(sample)
  }

  // 클리어
  const handleClear = () => {
    setMybatisQuery('')
    setParams([])
    setConvertedQuery('')
    setError('')
  }

  // 복사
  const handleCopy = async () => {
    if (convertedQuery) {
      await navigator.clipboard.writeText(convertedQuery)
    }
  }

  return (
    <ToolCard
      title="🔄 MyBatis to SQL Converter"
      description="MyBatis 쿼리를 SQL 콘솔에서 바로 실행 가능한 형태로 변환합니다"
    >
      <div className="space-y-6">
        {/* MyBatis 쿼리 입력 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              MyBatis 쿼리 입력
            </label>
            <button
              onClick={loadSample}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              샘플 쿼리 로드
            </button>
          </div>
          <textarea
            value={mybatisQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="MyBatis 쿼리를 입력하세요... (예: SELECT * FROM users WHERE id = #{userId})"
            rows={10}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 #{'{'}파라미터{'}'} 또는 ${'{'}파라미터{'}'} 형태의 MyBatis 파라미터를 자동으로 감지합니다.
          </p>
        </div>

        {/* 파라미터 입력 섹션 */}
        {params.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              파라미터 값 입력 ({params.length}개 감지됨)
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600">
              {params.map((param, index) => (
                <div key={param.key} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      #{'{' + param.key + '}'}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <select
                      value={param.type}
                      onChange={(e) => handleParamChange(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="null">NULL</option>
                    </select>
                  </div>
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                      placeholder={
                        param.type === 'string' ? "값 입력 (예: John)" :
                        param.type === 'number' ? "숫자 입력 (예: 123)" :
                        "NULL"
                      }
                      disabled={param.type === 'null'}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 버튼들 */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={convertToSQL}
            disabled={!mybatisQuery.trim()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 SQL로 변환
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* 변환된 SQL 출력 */}
        {convertedQuery && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                변환된 SQL 쿼리
              </label>
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="relative">
              <textarea
                value={convertedQuery}
                readOnly
                rows={12}
                className="w-full px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-600 rounded-lg font-mono text-sm text-gray-800 dark:text-gray-200 resize-none"
              />
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              ✅ SQL 콘솔에 바로 복사하여 실행할 수 있습니다!
            </p>
          </div>
        )}

        {/* 사용 방법 안내 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
          <p className="font-semibold mb-2">💡 사용 방법:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>MyBatis XML 또는 어노테이션의 쿼리를 복사하여 붙여넣기</li>
            <li>자동으로 감지된 파라미터(#{'{'}...{'}'})의 타입과 값을 입력</li>
            <li>"SQL로 변환" 버튼 클릭</li>
            <li>변환된 SQL을 복사하여 SQL 콘솔에서 바로 실행</li>
          </ol>
          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
            <p className="font-semibold mb-1">지원 기능:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>#{'{'}파라미터{'}'} → PreparedStatement 방식 (안전)</li>
              <li>${'{'}파라미터{'}'} → Statement 방식 (주의 필요)</li>
              <li>String, Number, NULL 타입 지원</li>
              <li>SQL Injection 방지 (작은따옴표 이스케이프)</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
