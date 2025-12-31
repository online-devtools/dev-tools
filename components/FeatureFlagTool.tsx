'use client'

import { useState, useCallback, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

/**
 * Feature Flag Config Builder 컴포넌트
 *
 * Feature Flag(기능 플래그)는 코드 배포 없이 기능을 켜고 끄는 기술입니다.
 * 이 도구는 다양한 형식의 Feature Flag 설정 파일을 생성합니다.
 *
 * 지원 형식:
 * - JSON (일반적인 설정 파일)
 * - LaunchDarkly 형식
 * - Unleash 형식
 * - 환경변수 형식
 */

// Feature Flag 타입 정의
type FlagType = 'boolean' | 'string' | 'number' | 'json'
type RolloutType = 'all' | 'percentage' | 'userIds' | 'groups'

interface FeatureFlag {
  id: string
  key: string
  name: string
  description: string
  type: FlagType
  enabled: boolean
  defaultValue: string
  rolloutType: RolloutType
  rolloutPercentage: number
  targetUserIds: string
  targetGroups: string
  environments: {
    development: boolean
    staging: boolean
    production: boolean
  }
}

// 출력 형식 옵션
type OutputFormat = 'json' | 'launchdarkly' | 'unleash' | 'env'

const defaultFlag: FeatureFlag = {
  id: '',
  key: '',
  name: '',
  description: '',
  type: 'boolean',
  enabled: true,
  defaultValue: 'true',
  rolloutType: 'all',
  rolloutPercentage: 100,
  targetUserIds: '',
  targetGroups: '',
  environments: {
    development: true,
    staging: true,
    production: false,
  },
}

export default function FeatureFlagTool() {
  const { t } = useLanguage()

  // Feature Flag 목록
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  // 현재 편집 중인 플래그
  const [currentFlag, setCurrentFlag] = useState<FeatureFlag>({
    ...defaultFlag,
    id: crypto.randomUUID(),
  })
  // 출력 형식
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('json')
  // 에러 메시지
  const [error, setError] = useState<string | null>(null)

  /**
   * 현재 편집 중인 플래그 필드 업데이트
   */
  const updateCurrentFlag = useCallback((key: keyof FeatureFlag, value: unknown) => {
    setCurrentFlag(prev => ({ ...prev, [key]: value }))
  }, [])

  /**
   * 환경별 설정 업데이트
   */
  const updateEnvironment = useCallback((env: 'development' | 'staging' | 'production', value: boolean) => {
    setCurrentFlag(prev => ({
      ...prev,
      environments: { ...prev.environments, [env]: value }
    }))
  }, [])

  /**
   * 플래그 추가
   */
  const addFlag = useCallback(() => {
    setError(null)

    if (!currentFlag.key.trim()) {
      setError(t('featureFlag.error.keyRequired'))
      return
    }

    // 키 중복 확인
    if (flags.some(f => f.key === currentFlag.key)) {
      setError(t('featureFlag.error.keyDuplicate'))
      return
    }

    // 키 형식 검증 (영문, 숫자, 언더스코어, 하이픈만 허용)
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(currentFlag.key)) {
      setError(t('featureFlag.error.keyFormat'))
      return
    }

    setFlags(prev => [...prev, currentFlag])
    setCurrentFlag({
      ...defaultFlag,
      id: crypto.randomUUID(),
    })
  }, [currentFlag, flags, t])

  /**
   * 플래그 삭제
   */
  const removeFlag = useCallback((id: string) => {
    setFlags(prev => prev.filter(f => f.id !== id))
  }, [])

  /**
   * 플래그 편집 모드로 전환
   */
  const editFlag = useCallback((flag: FeatureFlag) => {
    setCurrentFlag(flag)
    setFlags(prev => prev.filter(f => f.id !== flag.id))
  }, [])

  /**
   * 모두 초기화
   */
  const clearAll = useCallback(() => {
    setFlags([])
    setCurrentFlag({
      ...defaultFlag,
      id: crypto.randomUUID(),
    })
    setError(null)
  }, [])

  /**
   * 샘플 플래그 로드
   */
  const loadSamples = useCallback(() => {
    const samples: FeatureFlag[] = [
      {
        id: crypto.randomUUID(),
        key: 'new_checkout_flow',
        name: 'New Checkout Flow',
        description: 'Enable the redesigned checkout experience',
        type: 'boolean',
        enabled: true,
        defaultValue: 'false',
        rolloutType: 'percentage',
        rolloutPercentage: 25,
        targetUserIds: '',
        targetGroups: 'beta_testers',
        environments: { development: true, staging: true, production: true },
      },
      {
        id: crypto.randomUUID(),
        key: 'max_upload_size_mb',
        name: 'Max Upload Size',
        description: 'Maximum file upload size in megabytes',
        type: 'number',
        enabled: true,
        defaultValue: '10',
        rolloutType: 'all',
        rolloutPercentage: 100,
        targetUserIds: '',
        targetGroups: '',
        environments: { development: true, staging: true, production: true },
      },
      {
        id: crypto.randomUUID(),
        key: 'maintenance_mode',
        name: 'Maintenance Mode',
        description: 'Enable maintenance mode for the application',
        type: 'boolean',
        enabled: false,
        defaultValue: 'false',
        rolloutType: 'all',
        rolloutPercentage: 100,
        targetUserIds: '',
        targetGroups: '',
        environments: { development: false, staging: false, production: false },
      },
    ]
    setFlags(samples)
  }, [])

  /**
   * 설정 파일 생성
   */
  const generatedConfig = useMemo(() => {
    if (flags.length === 0) return ''

    switch (outputFormat) {
      case 'json': {
        // 일반 JSON 형식
        const config = flags.reduce((acc, flag) => {
          acc[flag.key] = {
            name: flag.name,
            description: flag.description,
            type: flag.type,
            enabled: flag.enabled,
            defaultValue: flag.type === 'boolean' ? flag.defaultValue === 'true' :
                          flag.type === 'number' ? Number(flag.defaultValue) :
                          flag.defaultValue,
            rollout: {
              type: flag.rolloutType,
              percentage: flag.rolloutPercentage,
              targetUserIds: flag.targetUserIds ? flag.targetUserIds.split(',').map(s => s.trim()) : [],
              targetGroups: flag.targetGroups ? flag.targetGroups.split(',').map(s => s.trim()) : [],
            },
            environments: flag.environments,
          }
          return acc
        }, {} as Record<string, unknown>)
        return JSON.stringify(config, null, 2)
      }

      case 'launchdarkly': {
        // LaunchDarkly 형식
        const ldConfig = {
          flags: flags.map(flag => ({
            key: flag.key,
            name: flag.name,
            description: flag.description,
            kind: flag.type === 'boolean' ? 'boolean' : 'multivariate',
            variations: flag.type === 'boolean'
              ? [{ value: true }, { value: false }]
              : [{ value: flag.defaultValue }],
            on: flag.enabled,
            fallthrough: { variation: 0 },
            offVariation: flag.type === 'boolean' ? 1 : 0,
            targets: flag.targetUserIds ? [{
              values: flag.targetUserIds.split(',').map(s => s.trim()),
              variation: 0,
            }] : [],
            rules: flag.rolloutType === 'percentage' && flag.rolloutPercentage < 100 ? [{
              variation: 0,
              rollout: {
                variations: [
                  { variation: 0, weight: flag.rolloutPercentage * 1000 },
                  { variation: 1, weight: (100 - flag.rolloutPercentage) * 1000 },
                ],
              },
            }] : [],
          })),
        }
        return JSON.stringify(ldConfig, null, 2)
      }

      case 'unleash': {
        // Unleash 형식
        const unleashConfig = {
          version: 1,
          features: flags.map(flag => ({
            name: flag.key,
            description: flag.description,
            enabled: flag.enabled,
            strategies: [{
              name: flag.rolloutType === 'percentage' ? 'gradualRollout' :
                    flag.rolloutType === 'userIds' ? 'userWithId' :
                    'default',
              parameters: flag.rolloutType === 'percentage'
                ? { percentage: String(flag.rolloutPercentage) }
                : flag.rolloutType === 'userIds'
                ? { userIds: flag.targetUserIds }
                : {},
            }],
            variants: [],
          })),
        }
        return JSON.stringify(unleashConfig, null, 2)
      }

      case 'env': {
        // 환경변수 형식
        const envLines = flags.map(flag => {
          const prefix = 'FEATURE_FLAG'
          const key = `${prefix}_${flag.key.toUpperCase()}`
          const value = flag.enabled ? flag.defaultValue : 'false'
          return `${key}=${value}`
        })
        return envLines.join('\n')
      }

      default:
        return ''
    }
  }, [flags, outputFormat])

  return (
    <ToolCard
      title={`🚩 ${t('featureFlag.title')}`}
      description={t('featureFlag.description')}
    >
      <div className="space-y-6">
        {/* 샘플/초기화 버튼 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadSamples}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
          >
            {t('featureFlag.actions.loadSamples')}
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors text-sm"
          >
            {t('featureFlag.actions.clearAll')}
          </button>
        </div>

        {/* 플래그 입력 폼 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {t('featureFlag.form.title')}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Key */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Key *
              </label>
              <input
                type="text"
                value={currentFlag.key}
                onChange={(e) => updateCurrentFlag('key', e.target.value)}
                placeholder="new_feature"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-mono"
              />
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={currentFlag.name}
                onChange={(e) => updateCurrentFlag('name', e.target.value)}
                placeholder="New Feature"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
              />
            </div>

            {/* Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                value={currentFlag.type}
                onChange={(e) => updateCurrentFlag('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
              >
                <option value="boolean">Boolean</option>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="json">JSON</option>
              </select>
            </div>

            {/* Default Value */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Value
              </label>
              {currentFlag.type === 'boolean' ? (
                <select
                  value={currentFlag.defaultValue}
                  onChange={(e) => updateCurrentFlag('defaultValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={currentFlag.defaultValue}
                  onChange={(e) => updateCurrentFlag('defaultValue', e.target.value)}
                  placeholder={currentFlag.type === 'number' ? '0' : 'value'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-mono"
                />
              )}
            </div>

            {/* Rollout Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rollout Type
              </label>
              <select
                value={currentFlag.rolloutType}
                onChange={(e) => updateCurrentFlag('rolloutType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
              >
                <option value="all">{t('featureFlag.rollout.all')}</option>
                <option value="percentage">{t('featureFlag.rollout.percentage')}</option>
                <option value="userIds">{t('featureFlag.rollout.userIds')}</option>
                <option value="groups">{t('featureFlag.rollout.groups')}</option>
              </select>
            </div>

            {/* Rollout Percentage */}
            {currentFlag.rolloutType === 'percentage' && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Percentage
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={currentFlag.rolloutPercentage}
                  onChange={(e) => updateCurrentFlag('rolloutPercentage', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <input
              type="text"
              value={currentFlag.description}
              onChange={(e) => updateCurrentFlag('description', e.target.value)}
              placeholder="What this feature does..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
            />
          </div>

          {/* Environments */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Environments
            </label>
            <div className="flex flex-wrap gap-4">
              {(['development', 'staging', 'production'] as const).map(env => (
                <label key={env} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentFlag.environments[env]}
                    onChange={(e) => updateEnvironment(env, e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{env}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Enabled */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={currentFlag.enabled}
              onChange={(e) => updateCurrentFlag('enabled', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('featureFlag.form.enabled')}
            </span>
          </label>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* 추가 버튼 */}
          <button
            onClick={addFlag}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            {t('featureFlag.actions.addFlag')}
          </button>
        </div>

        {/* 플래그 목록 */}
        {flags.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {t('featureFlag.list.title')} ({flags.length})
            </h3>
            <div className="space-y-2">
              {flags.map(flag => (
                <div
                  key={flag.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${flag.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <p className="font-mono text-sm text-gray-800 dark:text-gray-200">{flag.key}</p>
                      <p className="text-xs text-gray-500">{flag.name || flag.description}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                      {flag.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editFlag(flag)}
                      className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                    >
                      {t('featureFlag.actions.edit')}
                    </button>
                    <button
                      onClick={() => removeFlag(flag.id)}
                      className="px-2 py-1 text-xs text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    >
                      {t('featureFlag.actions.remove')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 출력 형식 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('featureFlag.output.format')}
          </label>
          <div className="flex flex-wrap gap-2">
            {(['json', 'launchdarkly', 'unleash', 'env'] as const).map(format => (
              <button
                key={format}
                onClick={() => setOutputFormat(format)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  outputFormat === format
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 생성된 설정 */}
        <TextAreaWithCopy
          value={generatedConfig}
          readOnly
          placeholder={t('featureFlag.output.placeholder')}
          label={t('featureFlag.output.label')}
          rows={15}
        />
      </div>
    </ToolCard>
  )
}
