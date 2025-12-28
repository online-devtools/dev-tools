'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import * as yaml from 'js-yaml'

interface ServiceInfo {
    name: string
    image?: string
    ports?: string[]
    volumes?: string[]
    dependsOn?: string[]
    environment?: Record<string, string> | string[]
    networks?: string[]
}

interface ValidationIssue {
    type: 'error' | 'warning'
    message: string
    path?: string
}

interface ParseResult {
    valid: boolean
    services: ServiceInfo[]
    issues: ValidationIssue[]
    version?: string
}

function validateDockerCompose(text: string): ParseResult {
    const issues: ValidationIssue[] = []
    const services: ServiceInfo[] = []

    if (!text.trim()) {
        return { valid: false, services: [], issues: [{ type: 'error', message: 'Empty input' }] }
    }

    let parsed: Record<string, unknown>
    try {
        parsed = yaml.load(text) as Record<string, unknown>
    } catch (e) {
        return {
            valid: false,
            services: [],
            issues: [{ type: 'error', message: `YAML parse error: ${(e as Error).message}` }]
        }
    }

    if (!parsed || typeof parsed !== 'object') {
        return {
            valid: false,
            services: [],
            issues: [{ type: 'error', message: 'Invalid YAML structure' }]
        }
    }

    const version = parsed.version as string | undefined
    if (version) {
        if (version === '2' || version === '2.0' || version === '2.1') {
            issues.push({
                type: 'warning',
                message: `Version ${version} is deprecated. Consider upgrading to version 3.x or removing the version field.`,
                path: 'version'
            })
        }
    }

    const servicesObj = parsed.services as Record<string, Record<string, unknown>> | undefined
    if (!servicesObj) {
        issues.push({
            type: 'error',
            message: 'No services defined',
            path: 'services'
        })
        return { valid: issues.filter(i => i.type === 'error').length === 0, services, issues, version }
    }

    for (const [name, config] of Object.entries(servicesObj)) {
        if (!config || typeof config !== 'object') {
            issues.push({ type: 'error', message: `Invalid service configuration`, path: `services.${name}` })
            continue
        }

        const service: ServiceInfo = { name }

        // Image or build
        if (config.image) {
            service.image = String(config.image)
        } else if (!config.build) {
            issues.push({
                type: 'warning',
                message: `Service has no image or build context`,
                path: `services.${name}`
            })
        }

        // Ports
        if (config.ports) {
            service.ports = (config.ports as (string | number)[]).map(String)
            for (const port of service.ports) {
                const portMatch = port.match(/^(\d+):(\d+)/)
                if (portMatch) {
                    const hostPort = parseInt(portMatch[1], 10)
                    if (hostPort < 1024) {
                        issues.push({
                            type: 'warning',
                            message: `Privileged port ${hostPort} requires root access`,
                            path: `services.${name}.ports`
                        })
                    }
                }
            }
        }

        // Volumes
        if (config.volumes) {
            service.volumes = (config.volumes as string[]).map(String)
        }

        // Depends on
        if (config.depends_on) {
            if (Array.isArray(config.depends_on)) {
                service.dependsOn = config.depends_on as string[]
            } else if (typeof config.depends_on === 'object') {
                service.dependsOn = Object.keys(config.depends_on)
            }
        }

        // Environment
        if (config.environment) {
            service.environment = config.environment as Record<string, string> | string[]
        }

        // Networks
        if (config.networks) {
            service.networks = Array.isArray(config.networks)
                ? config.networks as string[]
                : Object.keys(config.networks)
        }

        // Deprecated options
        if (config.links) {
            issues.push({
                type: 'warning',
                message: `'links' is deprecated. Use user-defined networks instead.`,
                path: `services.${name}.links`
            })
        }

        if (config.container_name) {
            issues.push({
                type: 'warning',
                message: `'container_name' prevents scaling. Consider removing it.`,
                path: `services.${name}.container_name`
            })
        }

        services.push(service)
    }

    // Check depends_on references
    const serviceNames = new Set(services.map(s => s.name))
    for (const service of services) {
        for (const dep of service.dependsOn || []) {
            if (!serviceNames.has(dep)) {
                issues.push({
                    type: 'error',
                    message: `depends_on references undefined service '${dep}'`,
                    path: `services.${service.name}.depends_on`
                })
            }
        }
    }

    return {
        valid: issues.filter(i => i.type === 'error').length === 0,
        services,
        issues,
        version
    }
}

export default function DockerComposeValidatorTool() {
    const { t } = useLanguage()
    const [input, setInput] = useState('')
    const [result, setResult] = useState<ParseResult | null>(null)
    const [copied, setCopied] = useState(false)

    const handleValidate = () => {
        setResult(validateDockerCompose(input))
    }

    const handleClear = () => {
        setInput('')
        setResult(null)
    }

    const sampleCompose = `version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - api
    networks:
      - frontend

  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
    networks:
      - frontend
      - backend

  db:
    image: postgres:15
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
    networks:
      - backend

networks:
  frontend:
  backend:

volumes:
  db_data:`

    const handleLoadSample = () => {
        setInput(sampleCompose)
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(input)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {t('dockerCompose.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('dockerCompose.description')}
                </p>

                {/* Input Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dockerCompose.input.label')}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('dockerCompose.input.placeholder')}
                        className="w-full h-80 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={handleValidate}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        {t('dockerCompose.actions.validate')}
                    </button>
                    <button
                        onClick={handleLoadSample}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                        {t('dockerCompose.actions.sample')}
                    </button>
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                        {copied ? t('common.copied') : t('common.copy')}
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                        {t('common.clear')}
                    </button>
                </div>

                {/* Validation Result */}
                {result && (
                    <div className="space-y-6">
                        {/* Status */}
                        <div className={`p-4 rounded-lg ${result.valid ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                            <span className="font-semibold">
                                {result.valid ? '✓ ' + t('dockerCompose.result.valid') : '✗ ' + t('dockerCompose.result.invalid')}
                            </span>
                            {result.version && (
                                <span className="ml-4 text-sm opacity-80">
                                    Version: {result.version}
                                </span>
                            )}
                        </div>

                        {/* Issues */}
                        {result.issues.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    {t('dockerCompose.issues.title')}
                                </h3>
                                <div className="space-y-2">
                                    {result.issues.map((issue, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-lg text-sm ${issue.type === 'error'
                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-l-4 border-red-500'
                                                    : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-l-4 border-yellow-500'
                                                }`}
                                        >
                                            <span className="font-medium">{issue.type === 'error' ? '❌' : '⚠️'}</span>{' '}
                                            {issue.path && <code className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">{issue.path}</code>}
                                            {' '}{issue.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Services Visualization */}
                        {result.services.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    {t('dockerCompose.services.title')} ({result.services.length})
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {result.services.map((service) => (
                                        <div
                                            key={service.name}
                                            className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50"
                                        >
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                🐳 {service.name}
                                            </h4>
                                            {service.image && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                    <span className="font-medium">{t('dockerCompose.services.image')}:</span>{' '}
                                                    <code className="font-mono text-xs">{service.image}</code>
                                                </p>
                                            )}
                                            {service.ports && service.ports.length > 0 && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                    <span className="font-medium">{t('dockerCompose.services.ports')}:</span>{' '}
                                                    {service.ports.join(', ')}
                                                </p>
                                            )}
                                            {service.dependsOn && service.dependsOn.length > 0 && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                    <span className="font-medium">{t('dockerCompose.services.dependsOn')}:</span>{' '}
                                                    {service.dependsOn.join(' → ')}
                                                </p>
                                            )}
                                            {service.networks && service.networks.length > 0 && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">{t('dockerCompose.services.networks')}:</span>{' '}
                                                    {service.networks.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    {t('dockerCompose.info.title')}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                    <li>{t('dockerCompose.info.bullet1')}</li>
                    <li>{t('dockerCompose.info.bullet2')}</li>
                    <li>{t('dockerCompose.info.bullet3')}</li>
                </ul>
            </div>
        </div>
    )
}
