'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'

const STATUS_CODES = {
  '1xx': [
    { code: 100, name: 'Continue', desc: '계속 진행' },
    { code: 101, name: 'Switching Protocols', desc: '프로토콜 전환' },
    { code: 102, name: 'Processing', desc: '처리 중' },
  ],
  '2xx': [
    { code: 200, name: 'OK', desc: '요청 성공' },
    { code: 201, name: 'Created', desc: '리소스 생성됨' },
    { code: 202, name: 'Accepted', desc: '요청 수락됨' },
    { code: 204, name: 'No Content', desc: '내용 없음' },
  ],
  '3xx': [
    { code: 301, name: 'Moved Permanently', desc: '영구 이동' },
    { code: 302, name: 'Found', desc: '임시 이동' },
    { code: 304, name: 'Not Modified', desc: '수정되지 않음' },
  ],
  '4xx': [
    { code: 400, name: 'Bad Request', desc: '잘못된 요청' },
    { code: 401, name: 'Unauthorized', desc: '인증 필요' },
    { code: 403, name: 'Forbidden', desc: '접근 금지' },
    { code: 404, name: 'Not Found', desc: '찾을 수 없음' },
    { code: 405, name: 'Method Not Allowed', desc: '허용되지 않은 메소드' },
    { code: 408, name: 'Request Timeout', desc: '요청 시간 초과' },
    { code: 409, name: 'Conflict', desc: '충돌' },
    { code: 429, name: 'Too Many Requests', desc: '너무 많은 요청' },
  ],
  '5xx': [
    { code: 500, name: 'Internal Server Error', desc: '서버 내부 오류' },
    { code: 501, name: 'Not Implemented', desc: '구현되지 않음' },
    { code: 502, name: 'Bad Gateway', desc: '잘못된 게이트웨이' },
    { code: 503, name: 'Service Unavailable', desc: '서비스 이용 불가' },
    { code: 504, name: 'Gateway Timeout', desc: '게이트웨이 시간 초과' },
  ],
}

export default function HTTPStatusTool() {
  const [search, setSearch] = useState('')

  return (
    <ToolCard
      title="HTTP Status Codes"
      description="HTTP 상태 코드 목록과 설명"
    >
      <div className="space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="검색... (예: 404, Not Found)"
        />

        <div className="space-y-6">
          {Object.entries(STATUS_CODES).map(([category, codes]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                {category} - {
                  category === '1xx' ? '정보' :
                  category === '2xx' ? '성공' :
                  category === '3xx' ? '리다이렉션' :
                  category === '4xx' ? '클라이언트 오류' :
                  '서버 오류'
                }
              </h3>
              <div className="space-y-2">
                {codes
                  .filter(status =>
                    search === '' ||
                    status.code.toString().includes(search) ||
                    status.name.toLowerCase().includes(search.toLowerCase()) ||
                    status.desc.toLowerCase().includes(search.toLowerCase())
                  )
                  .map(status => (
                    <div
                      key={status.code}
                      className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-lg text-gray-900 dark:text-white mr-3">
                            {status.code}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {status.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {status.desc}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolCard>
  )
}
