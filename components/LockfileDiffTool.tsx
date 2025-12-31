'use client'

import { useState, useCallback, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

/**
 * Lockfile Diff Analyzer 컴포넌트
 *
 * package-lock.json, yarn.lock 등 락파일의 변경사항을 분석합니다.
 * 의존성 업데이트, 추가, 삭제된 패키지를 시각적으로 표시합니다.
 *
 * 기능:
 * - 추가된 패키지 표시 (녹색)
 * - 삭제된 패키지 표시 (빨간색)
 * - 버전 변경된 패키지 표시 (노란색)
 * - 주요 변경사항 (major) 하이라이트
 * - 통계 요약
 */

// 패키지 정보 타입
interface PackageInfo {
  name: string
  version: string
  resolved?: string
  integrity?: string
}

// 변경 타입
type ChangeType = 'added' | 'removed' | 'updated'

// 변경 정보
interface PackageChange {
  name: string
  type: ChangeType
  oldVersion?: string
  newVersion?: string
  isMajor?: boolean
  isMinor?: boolean
  isPatch?: boolean
}

// SemVer 버전 파싱
interface SemVer {
  major: number
  minor: number
  patch: number
  prerelease?: string
}

export default function LockfileDiffTool() {
  const { t } = useLanguage()

  // 이전 락파일 내용
  const [oldLockfile, setOldLockfile] = useState('')
  // 새 락파일 내용
  const [newLockfile, setNewLockfile] = useState('')
  // 분석 결과
  const [changes, setChanges] = useState<PackageChange[]>([])
  // 에러 메시지
  const [error, setError] = useState<string | null>(null)
  // 분석 완료 여부
  const [isAnalyzed, setIsAnalyzed] = useState(false)

  /**
   * SemVer 문자열 파싱
   */
  const parseSemVer = useCallback((version: string): SemVer | null => {
    // 버전 문자열에서 숫자만 추출 (예: "^1.2.3" → "1.2.3")
    const cleaned = version.replace(/^[~^>=<]+/, '')
    const match = cleaned.match(/^(\d+)\.(\d+)\.(\d+)(.*)$/)

    if (!match) return null

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      prerelease: match[4] || undefined,
    }
  }, [])

  /**
   * 버전 변경 유형 분석 (major/minor/patch)
   */
  const compareVersions = useCallback((oldVer: string, newVer: string): {
    isMajor: boolean
    isMinor: boolean
    isPatch: boolean
  } => {
    const oldSem = parseSemVer(oldVer)
    const newSem = parseSemVer(newVer)

    if (!oldSem || !newSem) {
      return { isMajor: false, isMinor: false, isPatch: false }
    }

    return {
      isMajor: newSem.major !== oldSem.major,
      isMinor: !!(newSem.major === oldSem.major && newSem.minor !== oldSem.minor),
      isPatch: !!(newSem.major === oldSem.major && newSem.minor === oldSem.minor && newSem.patch !== oldSem.patch),
    }
  }, [parseSemVer])

  /**
   * package-lock.json (npm v2/v3) 파싱
   */
  const parseNpmLockfile = useCallback((content: string): Record<string, PackageInfo> => {
    const json = JSON.parse(content)
    const packages: Record<string, PackageInfo> = {}

    // npm v3 형식 (packages 필드)
    if (json.packages) {
      for (const [path, pkg] of Object.entries(json.packages)) {
        if (!path || path === '') continue // 루트 패키지 제외
        const pkgData = pkg as { version?: string; resolved?: string; integrity?: string }

        // node_modules/패키지명 형식에서 패키지명 추출
        const name = path.replace(/^node_modules\//, '').replace(/^.*node_modules\//, '')

        if (name && pkgData.version) {
          packages[name] = {
            name,
            version: pkgData.version,
            resolved: pkgData.resolved,
            integrity: pkgData.integrity,
          }
        }
      }
    }
    // npm v1/v2 형식 (dependencies 필드)
    else if (json.dependencies) {
      const extractDeps = (deps: Record<string, { version: string; resolved?: string; integrity?: string; dependencies?: Record<string, unknown> }>, prefix = '') => {
        for (const [name, pkg] of Object.entries(deps)) {
          const fullName = prefix ? `${prefix}/${name}` : name
          packages[fullName] = {
            name: fullName,
            version: pkg.version,
            resolved: pkg.resolved,
            integrity: pkg.integrity,
          }
          // 중첩 의존성 처리
          if (pkg.dependencies) {
            extractDeps(pkg.dependencies as Record<string, { version: string; resolved?: string; integrity?: string; dependencies?: Record<string, unknown> }>, fullName)
          }
        }
      }
      extractDeps(json.dependencies)
    }

    return packages
  }, [])

  /**
   * yarn.lock 파싱 (간단한 파서)
   */
  const parseYarnLockfile = useCallback((content: string): Record<string, PackageInfo> => {
    const packages: Record<string, PackageInfo> = {}
    const lines = content.split('\n')

    let currentPackage: string | null = null
    let currentVersion: string | null = null

    for (const line of lines) {
      // 새 패키지 시작 (예: "lodash@^4.17.0:")
      if (line.match(/^"?[\w@/.-]+@/)) {
        const match = line.match(/^"?([\w@/.-]+)@/)
        if (match) {
          currentPackage = match[1]
        }
      }
      // 버전 라인 (예: "  version "4.17.21"")
      else if (line.match(/^\s+version\s+"(.+)"/) && currentPackage) {
        const match = line.match(/^\s+version\s+"(.+)"/)
        if (match) {
          currentVersion = match[1]
          packages[currentPackage] = {
            name: currentPackage,
            version: currentVersion,
          }
        }
      }
    }

    return packages
  }, [])

  /**
   * 락파일 타입 감지 및 파싱
   */
  const parseLockfile = useCallback((content: string): Record<string, PackageInfo> => {
    const trimmed = content.trim()

    // JSON 형식인지 확인 (package-lock.json)
    if (trimmed.startsWith('{')) {
      return parseNpmLockfile(content)
    }
    // yarn.lock 형식
    else if (trimmed.includes('yarn lockfile')) {
      return parseYarnLockfile(content)
    }
    // 그 외의 경우 npm으로 시도
    else {
      try {
        return parseNpmLockfile(content)
      } catch {
        return parseYarnLockfile(content)
      }
    }
  }, [parseNpmLockfile, parseYarnLockfile])

  /**
   * 두 락파일 비교 분석
   */
  const handleAnalyze = useCallback(() => {
    setError(null)
    setChanges([])
    setIsAnalyzed(false)

    if (!oldLockfile.trim() || !newLockfile.trim()) {
      setError(t('lockfileDiff.error.emptyInput'))
      return
    }

    try {
      const oldPackages = parseLockfile(oldLockfile)
      const newPackages = parseLockfile(newLockfile)

      const result: PackageChange[] = []

      // 삭제된 패키지 찾기
      for (const [name, pkg] of Object.entries(oldPackages)) {
        if (!newPackages[name]) {
          result.push({
            name,
            type: 'removed',
            oldVersion: pkg.version,
          })
        }
      }

      // 추가되거나 업데이트된 패키지 찾기
      for (const [name, pkg] of Object.entries(newPackages)) {
        if (!oldPackages[name]) {
          result.push({
            name,
            type: 'added',
            newVersion: pkg.version,
          })
        } else if (oldPackages[name].version !== pkg.version) {
          const versionChange = compareVersions(oldPackages[name].version, pkg.version)
          result.push({
            name,
            type: 'updated',
            oldVersion: oldPackages[name].version,
            newVersion: pkg.version,
            ...versionChange,
          })
        }
      }

      // 정렬: major 변경 먼저, 그 다음 추가/삭제/업데이트 순, 이름 순
      result.sort((a, b) => {
        // major 변경 우선
        if (a.isMajor && !b.isMajor) return -1
        if (!a.isMajor && b.isMajor) return 1
        // 타입별 정렬
        const typeOrder = { added: 0, removed: 1, updated: 2 }
        if (typeOrder[a.type] !== typeOrder[b.type]) {
          return typeOrder[a.type] - typeOrder[b.type]
        }
        // 이름순
        return a.name.localeCompare(b.name)
      })

      setChanges(result)
      setIsAnalyzed(true)
    } catch {
      setError(t('lockfileDiff.error.parseFailed'))
    }
  }, [oldLockfile, newLockfile, parseLockfile, compareVersions, t])

  /**
   * 초기화
   */
  const handleClear = useCallback(() => {
    setOldLockfile('')
    setNewLockfile('')
    setChanges([])
    setError(null)
    setIsAnalyzed(false)
  }, [])

  /**
   * 샘플 데이터 로드
   */
  const loadSample = useCallback(() => {
    const sampleOld = JSON.stringify({
      name: "example-project",
      lockfileVersion: 3,
      packages: {
        "node_modules/lodash": { version: "4.17.20" },
        "node_modules/axios": { version: "0.21.1" },
        "node_modules/moment": { version: "2.29.1" },
        "node_modules/react": { version: "17.0.2" },
        "node_modules/webpack": { version: "5.60.0" },
      }
    }, null, 2)

    const sampleNew = JSON.stringify({
      name: "example-project",
      lockfileVersion: 3,
      packages: {
        "node_modules/lodash": { version: "4.17.21" },
        "node_modules/axios": { version: "1.0.0" },
        "node_modules/react": { version: "18.0.0" },
        "node_modules/webpack": { version: "5.75.0" },
        "node_modules/typescript": { version: "5.0.0" },
      }
    }, null, 2)

    setOldLockfile(sampleOld)
    setNewLockfile(sampleNew)
    setChanges([])
    setIsAnalyzed(false)
    setError(null)
  }, [])

  // 통계 계산
  const stats = useMemo(() => {
    return {
      added: changes.filter(c => c.type === 'added').length,
      removed: changes.filter(c => c.type === 'removed').length,
      updated: changes.filter(c => c.type === 'updated').length,
      major: changes.filter(c => c.isMajor).length,
      minor: changes.filter(c => c.isMinor).length,
      patch: changes.filter(c => c.isPatch).length,
    }
  }, [changes])

  return (
    <ToolCard
      title={`📦 ${t('lockfileDiff.title')}`}
      description={t('lockfileDiff.description')}
    >
      <div className="space-y-6">
        {/* 버튼 그룹 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            {t('lockfileDiff.actions.loadSample')}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors text-sm"
          >
            {t('lockfileDiff.actions.clear')}
          </button>
        </div>

        {/* 입력 영역 */}
        <div className="grid md:grid-cols-2 gap-4">
          <TextAreaWithCopy
            value={oldLockfile}
            onChange={setOldLockfile}
            placeholder={t('lockfileDiff.old.placeholder')}
            label={t('lockfileDiff.old.label')}
            rows={12}
          />
          <TextAreaWithCopy
            value={newLockfile}
            onChange={setNewLockfile}
            placeholder={t('lockfileDiff.new.placeholder')}
            label={t('lockfileDiff.new.label')}
            rows={12}
          />
        </div>

        {/* 분석 버튼 */}
        <button
          onClick={handleAnalyze}
          className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
        >
          {t('lockfileDiff.actions.analyze')}
        </button>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* 분석 결과 */}
        {isAnalyzed && (
          <div className="space-y-4">
            {/* 통계 요약 */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.added}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('lockfileDiff.stats.added')}</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{stats.removed}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('lockfileDiff.stats.removed')}</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{stats.updated}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('lockfileDiff.stats.updated')}</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{stats.major}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Major</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.minor}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Minor</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">{stats.patch}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Patch</p>
              </div>
            </div>

            {/* 변경 목록 */}
            {changes.length === 0 ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-gray-600 dark:text-gray-400">
                {t('lockfileDiff.noChanges')}
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-2 text-left">{t('lockfileDiff.table.package')}</th>
                      <th className="px-4 py-2 text-left">{t('lockfileDiff.table.change')}</th>
                      <th className="px-4 py-2 text-left">{t('lockfileDiff.table.version')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {changes.map((change, idx) => (
                      <tr
                        key={idx}
                        className={`border-t border-gray-200 dark:border-gray-700 ${
                          change.type === 'added' ? 'bg-green-50 dark:bg-green-900/10' :
                          change.type === 'removed' ? 'bg-red-50 dark:bg-red-900/10' :
                          change.isMajor ? 'bg-purple-50 dark:bg-purple-900/10' :
                          'bg-yellow-50 dark:bg-yellow-900/10'
                        }`}
                      >
                        <td className="px-4 py-2 font-mono text-xs">{change.name}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            change.type === 'added' ? 'bg-green-200 text-green-800' :
                            change.type === 'removed' ? 'bg-red-200 text-red-800' :
                            change.isMajor ? 'bg-purple-200 text-purple-800' :
                            change.isMinor ? 'bg-blue-200 text-blue-800' :
                            'bg-yellow-200 text-yellow-800'
                          }`}>
                            {change.type === 'added' ? '+ Added' :
                             change.type === 'removed' ? '- Removed' :
                             change.isMajor ? '⚠ Major' :
                             change.isMinor ? '↑ Minor' :
                             '↑ Patch'}
                          </span>
                        </td>
                        <td className="px-4 py-2 font-mono text-xs">
                          {change.type === 'added' && (
                            <span className="text-green-600">{change.newVersion}</span>
                          )}
                          {change.type === 'removed' && (
                            <span className="text-red-600 line-through">{change.oldVersion}</span>
                          )}
                          {change.type === 'updated' && (
                            <>
                              <span className="text-gray-500">{change.oldVersion}</span>
                              <span className="mx-2">→</span>
                              <span className={change.isMajor ? 'text-purple-600 font-semibold' : 'text-green-600'}>
                                {change.newVersion}
                              </span>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 정보 섹션 */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            {t('lockfileDiff.info.title')}
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li>{t('lockfileDiff.info.item1')}</li>
            <li>{t('lockfileDiff.info.item2')}</li>
            <li>{t('lockfileDiff.info.item3')}</li>
            <li>{t('lockfileDiff.info.item4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
