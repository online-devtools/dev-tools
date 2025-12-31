'use client'

import { useState, useCallback, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

/**
 * Systemd Unit Generator 컴포넌트
 *
 * Systemd는 Linux 시스템의 서비스 관리자입니다.
 * 이 도구는 .service 유닛 파일을 쉽게 생성할 수 있도록 도와줍니다.
 *
 * 주요 섹션:
 * - [Unit]: 서비스 설명, 의존성
 * - [Service]: 실행 명령, 재시작 정책, 사용자
 * - [Install]: 부팅 시 활성화 설정
 */

// 서비스 타입 옵션
const SERVICE_TYPES = [
  { value: 'simple', label: 'simple', desc: '기본값, 즉시 시작' },
  { value: 'forking', label: 'forking', desc: '데몬처럼 fork하는 프로세스' },
  { value: 'oneshot', label: 'oneshot', desc: '한 번 실행 후 종료' },
  { value: 'notify', label: 'notify', desc: 'sd_notify()로 준비 완료 알림' },
  { value: 'exec', label: 'exec', desc: 'exec 성공 후 시작 완료로 간주' },
] as const

// 재시작 정책 옵션
const RESTART_OPTIONS = [
  { value: 'no', label: 'no', desc: '재시작 안 함' },
  { value: 'always', label: 'always', desc: '항상 재시작' },
  { value: 'on-failure', label: 'on-failure', desc: '실패 시에만 재시작' },
  { value: 'on-abnormal', label: 'on-abnormal', desc: '비정상 종료 시 재시작' },
  { value: 'on-abort', label: 'on-abort', desc: 'abort 시 재시작' },
] as const

// 설치 타겟 옵션
const INSTALL_TARGETS = [
  { value: 'multi-user.target', label: 'multi-user.target', desc: '다중 사용자 모드 (일반적)' },
  { value: 'graphical.target', label: 'graphical.target', desc: 'GUI 환경' },
  { value: 'default.target', label: 'default.target', desc: '기본 타겟' },
] as const

interface ServiceConfig {
  // [Unit] 섹션
  description: string
  documentation: string
  after: string
  wants: string
  requires: string

  // [Service] 섹션
  type: string
  user: string
  group: string
  workingDir: string
  execStart: string
  execStartPre: string
  execStartPost: string
  execStop: string
  execReload: string
  restart: string
  restartSec: string
  timeoutStartSec: string
  timeoutStopSec: string
  environment: string
  environmentFile: string

  // [Install] 섹션
  wantedBy: string
}

const defaultConfig: ServiceConfig = {
  description: '',
  documentation: '',
  after: 'network.target',
  wants: '',
  requires: '',
  type: 'simple',
  user: '',
  group: '',
  workingDir: '',
  execStart: '',
  execStartPre: '',
  execStartPost: '',
  execStop: '',
  execReload: '',
  restart: 'on-failure',
  restartSec: '5',
  timeoutStartSec: '',
  timeoutStopSec: '',
  environment: '',
  environmentFile: '',
  wantedBy: 'multi-user.target',
}

export default function SystemdGeneratorTool() {
  const { t } = useLanguage()

  // 서비스 설정 상태
  const [config, setConfig] = useState<ServiceConfig>(defaultConfig)
  // 서비스 이름
  const [serviceName, setServiceName] = useState('')

  /**
   * 설정 값 업데이트 핸들러
   */
  const updateConfig = useCallback((key: keyof ServiceConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }, [])

  /**
   * Systemd unit 파일 생성
   * 입력된 설정값을 바탕으로 .service 파일 내용 생성
   */
  const generatedUnit = useMemo(() => {
    const lines: string[] = []

    // [Unit] 섹션
    lines.push('[Unit]')
    if (config.description) lines.push(`Description=${config.description}`)
    if (config.documentation) lines.push(`Documentation=${config.documentation}`)
    if (config.after) lines.push(`After=${config.after}`)
    if (config.wants) lines.push(`Wants=${config.wants}`)
    if (config.requires) lines.push(`Requires=${config.requires}`)
    lines.push('')

    // [Service] 섹션
    lines.push('[Service]')
    lines.push(`Type=${config.type}`)
    if (config.user) lines.push(`User=${config.user}`)
    if (config.group) lines.push(`Group=${config.group}`)
    if (config.workingDir) lines.push(`WorkingDirectory=${config.workingDir}`)
    if (config.execStartPre) lines.push(`ExecStartPre=${config.execStartPre}`)
    if (config.execStart) lines.push(`ExecStart=${config.execStart}`)
    if (config.execStartPost) lines.push(`ExecStartPost=${config.execStartPost}`)
    if (config.execStop) lines.push(`ExecStop=${config.execStop}`)
    if (config.execReload) lines.push(`ExecReload=${config.execReload}`)
    lines.push(`Restart=${config.restart}`)
    if (config.restartSec) lines.push(`RestartSec=${config.restartSec}`)
    if (config.timeoutStartSec) lines.push(`TimeoutStartSec=${config.timeoutStartSec}`)
    if (config.timeoutStopSec) lines.push(`TimeoutStopSec=${config.timeoutStopSec}`)
    if (config.environment) {
      // 환경변수는 여러 개일 수 있으므로 줄별로 분리
      config.environment.split('\n').filter(Boolean).forEach(env => {
        lines.push(`Environment="${env.trim()}"`)
      })
    }
    if (config.environmentFile) lines.push(`EnvironmentFile=${config.environmentFile}`)
    lines.push('')

    // [Install] 섹션
    lines.push('[Install]')
    if (config.wantedBy) lines.push(`WantedBy=${config.wantedBy}`)

    return lines.join('\n')
  }, [config])

  /**
   * 샘플 설정 로드 (Node.js 앱 예시)
   */
  const loadNodeSample = useCallback(() => {
    setServiceName('myapp')
    setConfig({
      description: 'My Node.js Application',
      documentation: 'https://example.com/docs',
      after: 'network.target',
      wants: '',
      requires: '',
      type: 'simple',
      user: 'nodejs',
      group: 'nodejs',
      workingDir: '/opt/myapp',
      execStart: '/usr/bin/node /opt/myapp/index.js',
      execStartPre: '',
      execStartPost: '',
      execStop: '',
      execReload: '/bin/kill -HUP $MAINPID',
      restart: 'always',
      restartSec: '10',
      timeoutStartSec: '',
      timeoutStopSec: '',
      environment: 'NODE_ENV=production\nPORT=3000',
      environmentFile: '',
      wantedBy: 'multi-user.target',
    })
  }, [])

  /**
   * 샘플 설정 로드 (Docker 컨테이너 예시)
   */
  const loadDockerSample = useCallback(() => {
    setServiceName('docker-myapp')
    setConfig({
      description: 'Docker Container for MyApp',
      documentation: '',
      after: 'docker.service',
      wants: '',
      requires: 'docker.service',
      type: 'simple',
      user: '',
      group: '',
      workingDir: '',
      execStart: '/usr/bin/docker run --rm --name myapp -p 8080:8080 myapp:latest',
      execStartPre: '/usr/bin/docker pull myapp:latest',
      execStartPost: '',
      execStop: '/usr/bin/docker stop myapp',
      execReload: '',
      restart: 'always',
      restartSec: '10',
      timeoutStartSec: '300',
      timeoutStopSec: '30',
      environment: '',
      environmentFile: '/etc/myapp/env',
      wantedBy: 'multi-user.target',
    })
  }, [])

  /**
   * 초기화
   */
  const handleClear = useCallback(() => {
    setConfig(defaultConfig)
    setServiceName('')
  }, [])

  /**
   * 파일 다운로드
   */
  const downloadUnit = useCallback(() => {
    const filename = serviceName ? `${serviceName}.service` : 'myservice.service'
    const blob = new Blob([generatedUnit], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [generatedUnit, serviceName])

  /**
   * 입력 필드 렌더링 헬퍼
   */
  const renderInput = (
    key: keyof ServiceConfig,
    label: string,
    placeholder: string,
    type: 'text' | 'textarea' | 'select' = 'text',
    options?: readonly { value: string; label: string; desc: string }[]
  ) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {type === 'select' && options ? (
        <select
          value={config[key]}
          onChange={(e) => updateConfig(key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label} - {opt.desc}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={config[key]}
          onChange={(e) => updateConfig(key, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-mono"
        />
      ) : (
        <input
          type="text"
          value={config[key]}
          onChange={(e) => updateConfig(key, e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-mono"
        />
      )}
    </div>
  )

  return (
    <ToolCard
      title={`⚙️ ${t('systemd.title')}`}
      description={t('systemd.description')}
    >
      <div className="space-y-6">
        {/* 샘플 버튼 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadNodeSample}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
          >
            {t('systemd.sample.nodejs')}
          </button>
          <button
            onClick={loadDockerSample}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
          >
            {t('systemd.sample.docker')}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors text-sm"
          >
            {t('systemd.actions.clear')}
          </button>
        </div>

        {/* 서비스 이름 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('systemd.serviceName')}
          </label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="myapp"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-mono"
          />
          <p className="text-xs text-gray-500">{t('systemd.serviceName.hint')}</p>
        </div>

        {/* [Unit] 섹션 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">[Unit]</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {renderInput('description', 'Description', t('systemd.placeholder.description'))}
            {renderInput('documentation', 'Documentation', 'https://example.com/docs')}
            {renderInput('after', 'After', 'network.target syslog.target')}
            {renderInput('wants', 'Wants', '')}
            {renderInput('requires', 'Requires', '')}
          </div>
        </div>

        {/* [Service] 섹션 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">[Service]</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {renderInput('type', 'Type', '', 'select', SERVICE_TYPES)}
            {renderInput('user', 'User', 'www-data')}
            {renderInput('group', 'Group', 'www-data')}
            {renderInput('workingDir', 'WorkingDirectory', '/opt/myapp')}
            {renderInput('execStart', 'ExecStart *', '/usr/bin/node app.js')}
            {renderInput('execStartPre', 'ExecStartPre', '')}
            {renderInput('execStop', 'ExecStop', '')}
            {renderInput('execReload', 'ExecReload', '/bin/kill -HUP $MAINPID')}
            {renderInput('restart', 'Restart', '', 'select', RESTART_OPTIONS)}
            {renderInput('restartSec', 'RestartSec', '5')}
            {renderInput('timeoutStartSec', 'TimeoutStartSec', '')}
            {renderInput('timeoutStopSec', 'TimeoutStopSec', '')}
          </div>
          <div className="space-y-4">
            {renderInput('environment', 'Environment', 'NODE_ENV=production\nPORT=3000', 'textarea')}
            {renderInput('environmentFile', 'EnvironmentFile', '/etc/myapp/env')}
          </div>
        </div>

        {/* [Install] 섹션 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">[Install]</h3>
          {renderInput('wantedBy', 'WantedBy', '', 'select', INSTALL_TARGETS)}
        </div>

        {/* 생성된 유닛 파일 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('systemd.output.label')}
            </label>
            <button
              onClick={downloadUnit}
              className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
            >
              {t('systemd.actions.download')}
            </button>
          </div>
          <TextAreaWithCopy
            value={generatedUnit}
            readOnly
            rows={20}
          />
        </div>

        {/* 사용법 안내 */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            {t('systemd.usage.title')}
          </h3>
          <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
            <li>{t('systemd.usage.step1')}</li>
            <li>{t('systemd.usage.step2')}</li>
            <li>{t('systemd.usage.step3')}</li>
            <li>{t('systemd.usage.step4')}</li>
          </ol>
        </div>
      </div>
    </ToolCard>
  )
}
