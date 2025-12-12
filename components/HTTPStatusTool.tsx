'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

const STATUS_CODES = {
  '1xx': [
    { code: 100, name: 'Continue', descKey: 'httpStatus.desc.100' },
    { code: 101, name: 'Switching Protocols', descKey: 'httpStatus.desc.101' },
    { code: 102, name: 'Processing', descKey: 'httpStatus.desc.102' },
  ],
  '2xx': [
    { code: 200, name: 'OK', descKey: 'httpStatus.desc.200' },
    { code: 201, name: 'Created', descKey: 'httpStatus.desc.201' },
    { code: 202, name: 'Accepted', descKey: 'httpStatus.desc.202' },
    { code: 204, name: 'No Content', descKey: 'httpStatus.desc.204' },
  ],
  '3xx': [
    { code: 301, name: 'Moved Permanently', descKey: 'httpStatus.desc.301' },
    { code: 302, name: 'Found', descKey: 'httpStatus.desc.302' },
    { code: 304, name: 'Not Modified', descKey: 'httpStatus.desc.304' },
  ],
  '4xx': [
    { code: 400, name: 'Bad Request', descKey: 'httpStatus.desc.400' },
    { code: 401, name: 'Unauthorized', descKey: 'httpStatus.desc.401' },
    { code: 403, name: 'Forbidden', descKey: 'httpStatus.desc.403' },
    { code: 404, name: 'Not Found', descKey: 'httpStatus.desc.404' },
    { code: 405, name: 'Method Not Allowed', descKey: 'httpStatus.desc.405' },
    { code: 408, name: 'Request Timeout', descKey: 'httpStatus.desc.408' },
    { code: 409, name: 'Conflict', descKey: 'httpStatus.desc.409' },
    { code: 429, name: 'Too Many Requests', descKey: 'httpStatus.desc.429' },
  ],
  '5xx': [
    { code: 500, name: 'Internal Server Error', descKey: 'httpStatus.desc.500' },
    { code: 501, name: 'Not Implemented', descKey: 'httpStatus.desc.501' },
    { code: 502, name: 'Bad Gateway', descKey: 'httpStatus.desc.502' },
    { code: 503, name: 'Service Unavailable', descKey: 'httpStatus.desc.503' },
    { code: 504, name: 'Gateway Timeout', descKey: 'httpStatus.desc.504' },
  ],
}

export default function HTTPStatusTool() {
  const { t } = useLanguage()
  const [search, setSearch] = useState('')

  return (
    <ToolCard
      title={`🌐 ${t('httpStatusTool.title')}`}
      description={t('httpStatusTool.description')}
    >
      <div className="space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder={t('httpStatusTool.search.placeholder')}
        />

        <div className="space-y-6">
          {Object.entries(STATUS_CODES).map(([category, codes]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                {category} - {t(`httpStatusTool.category.${category}`)}
              </h3>
              <div className="space-y-2">
                {codes
                  .filter(status =>
                    search === '' ||
                    status.code.toString().includes(search) ||
                    status.name.toLowerCase().includes(search.toLowerCase()) ||
                    t(status.descKey).toLowerCase().includes(search.toLowerCase())
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
                          {t(status.descKey)}
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
