'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'

interface Permission {
  owner: { read: boolean; write: boolean; execute: boolean }
  group: { read: boolean; write: boolean; execute: boolean }
  others: { read: boolean; write: boolean; execute: boolean }
}

export default function ChmodTool() {
  const [permissions, setPermissions] = useState<Permission>({
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    others: { read: true, write: false, execute: false }
  })

  const calculateOctal = (): string => {
    const calcValue = (p: { read: boolean; write: boolean; execute: boolean }) => {
      return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0)
    }

    return `${calcValue(permissions.owner)}${calcValue(permissions.group)}${calcValue(permissions.others)}`
  }

  const getSymbolic = (): string => {
    const getSymbol = (p: { read: boolean; write: boolean; execute: boolean }) => {
      return `${p.read ? 'r' : '-'}${p.write ? 'w' : '-'}${p.execute ? 'x' : '-'}`
    }

    return `${getSymbol(permissions.owner)}${getSymbol(permissions.group)}${getSymbol(permissions.others)}`
  }

  const updatePermission = (
    type: 'owner' | 'group' | 'others',
    permission: 'read' | 'write' | 'execute',
    value: boolean
  ) => {
    setPermissions(prev => ({
      ...prev,
      [type]: { ...prev[type], [permission]: value }
    }))
  }

  const PermissionCheckbox = ({
    label,
    type,
    permission
  }: {
    label: string
    type: 'owner' | 'group' | 'others'
    permission: 'read' | 'write' | 'execute'
  }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={permissions[type][permission]}
        onChange={(e) => updatePermission(type, permission, e.target.checked)}
        className="w-4 h-4 text-blue-600 rounded"
      />
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  )

  return (
    <ToolCard
      title="🔐 Unix Permission Calculator"
      description="chmod 권한 계산기"
    >
      <div className="space-y-6">
        {/* Permission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Owner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Owner (소유자)
            </h3>
            <div className="space-y-2">
              <PermissionCheckbox label="Read (읽기)" type="owner" permission="read" />
              <PermissionCheckbox label="Write (쓰기)" type="owner" permission="write" />
              <PermissionCheckbox label="Execute (실행)" type="owner" permission="execute" />
            </div>
          </div>

          {/* Group */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Group (그룹)
            </h3>
            <div className="space-y-2">
              <PermissionCheckbox label="Read (읽기)" type="group" permission="read" />
              <PermissionCheckbox label="Write (쓰기)" type="group" permission="write" />
              <PermissionCheckbox label="Execute (실행)" type="group" permission="execute" />
            </div>
          </div>

          {/* Others */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Others (기타)
            </h3>
            <div className="space-y-2">
              <PermissionCheckbox label="Read (읽기)" type="others" permission="read" />
              <PermissionCheckbox label="Write (쓰기)" type="others" permission="write" />
              <PermissionCheckbox label="Execute (실행)" type="others" permission="execute" />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Octal (8진수)
                </label>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-300 dark:border-gray-600">
                  <code className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                    {calculateOctal()}
                  </code>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  chmod {calculateOctal()} filename
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symbolic (기호)
                </label>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-300 dark:border-gray-600">
                  <code className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">
                    {getSymbolic()}
                  </code>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  ls -l 출력 형식
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Common Permissions Reference */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            📖 자주 사용하는 권한
          </h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <code className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">755</code>
              <span className="text-gray-700 dark:text-gray-300">rwxr-xr-x (실행 파일)</span>
            </div>
            <div className="flex items-center space-x-2">
              <code className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">644</code>
              <span className="text-gray-700 dark:text-gray-300">rw-r--r-- (일반 파일)</span>
            </div>
            <div className="flex items-center space-x-2">
              <code className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">777</code>
              <span className="text-gray-700 dark:text-gray-300">rwxrwxrwx (모든 권한)</span>
            </div>
            <div className="flex items-center space-x-2">
              <code className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">700</code>
              <span className="text-gray-700 dark:text-gray-300">rwx------ (소유자만)</span>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
