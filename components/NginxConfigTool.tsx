'use client'

import { useState, useEffect } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

interface NginxConfig {
  serverName: string
  port: string
  rootPath: string
  indexFiles: string
  enableSSL: boolean
  sslCertPath: string
  sslKeyPath: string
  enableGzip: boolean
  proxyPass: string
  enableProxy: boolean
  cacheStatic: boolean
  staticCacheDays: string
  enableLogs: boolean
  accessLog: string
  errorLog: string
  clientMaxBodySize: string
  enableCors: boolean
  corsOrigin: string
  customLocations: string
}

const defaultConfig: NginxConfig = {
  serverName: 'example.com',
  port: '80',
  rootPath: '/var/www/html',
  indexFiles: 'index.html index.htm',
  enableSSL: false,
  sslCertPath: '/etc/ssl/certs/example.crt',
  sslKeyPath: '/etc/ssl/private/example.key',
  enableGzip: true,
  proxyPass: 'http://localhost:3000',
  enableProxy: false,
  cacheStatic: true,
  staticCacheDays: '30',
  enableLogs: true,
  accessLog: '/var/log/nginx/access.log',
  errorLog: '/var/log/nginx/error.log',
  clientMaxBodySize: '10M',
  enableCors: false,
  corsOrigin: '*',
  customLocations: '',
}

function generateNginxConfig(config: NginxConfig): string {
  const lines: string[] = []

  lines.push('server {')
  lines.push(`    listen ${config.port}${config.enableSSL ? ' ssl http2' : ''};`)
  if (config.enableSSL) {
    lines.push(`    listen [::]:${config.port} ssl http2;`)
  } else {
    lines.push(`    listen [::]:${config.port};`)
  }
  lines.push(`    server_name ${config.serverName};`)
  lines.push('')

  if (config.enableSSL) {
    lines.push('    # SSL Configuration')
    lines.push(`    ssl_certificate ${config.sslCertPath};`)
    lines.push(`    ssl_certificate_key ${config.sslKeyPath};`)
    lines.push('    ssl_protocols TLSv1.2 TLSv1.3;')
    lines.push('    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;')
    lines.push('    ssl_prefer_server_ciphers off;')
    lines.push('    ssl_session_cache shared:SSL:10m;')
    lines.push('    ssl_session_timeout 1d;')
    lines.push('')
  }

  if (!config.enableProxy) {
    lines.push(`    root ${config.rootPath};`)
    lines.push(`    index ${config.indexFiles};`)
    lines.push('')
  }

  if (config.enableLogs) {
    lines.push('    # Logging')
    lines.push(`    access_log ${config.accessLog};`)
    lines.push(`    error_log ${config.errorLog};`)
    lines.push('')
  }

  lines.push(`    client_max_body_size ${config.clientMaxBodySize};`)
  lines.push('')

  if (config.enableGzip) {
    lines.push('    # Gzip Compression')
    lines.push('    gzip on;')
    lines.push('    gzip_vary on;')
    lines.push('    gzip_proxied any;')
    lines.push('    gzip_comp_level 6;')
    lines.push('    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;')
    lines.push('')
  }

  if (config.enableCors) {
    lines.push('    # CORS Headers')
    lines.push(`    add_header Access-Control-Allow-Origin "${config.corsOrigin}";`)
    lines.push('    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";')
    lines.push('    add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";')
    lines.push('')
  }

  lines.push('    # Security Headers')
  lines.push('    add_header X-Frame-Options "SAMEORIGIN" always;')
  lines.push('    add_header X-Content-Type-Options "nosniff" always;')
  lines.push('    add_header X-XSS-Protection "1; mode=block" always;')
  lines.push('')

  if (config.enableProxy) {
    lines.push('    location / {')
    lines.push(`        proxy_pass ${config.proxyPass};`)
    lines.push('        proxy_http_version 1.1;')
    lines.push('        proxy_set_header Upgrade $http_upgrade;')
    lines.push('        proxy_set_header Connection "upgrade";')
    lines.push('        proxy_set_header Host $host;')
    lines.push('        proxy_set_header X-Real-IP $remote_addr;')
    lines.push('        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;')
    lines.push('        proxy_set_header X-Forwarded-Proto $scheme;')
    lines.push('        proxy_cache_bypass $http_upgrade;')
    lines.push('    }')
  } else {
    lines.push('    location / {')
    lines.push('        try_files $uri $uri/ =404;')
    lines.push('    }')
  }
  lines.push('')

  if (config.cacheStatic && !config.enableProxy) {
    lines.push('    # Static File Caching')
    lines.push('    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|pdf|txt|woff|woff2|ttf|eot|svg)$ {')
    lines.push(`        expires ${config.staticCacheDays}d;`)
    lines.push('        add_header Cache-Control "public, immutable";')
    lines.push('    }')
    lines.push('')
  }

  if (config.customLocations.trim()) {
    lines.push('    # Custom Locations')
    config.customLocations.split('\n').forEach(line => {
      lines.push(`    ${line}`)
    })
    lines.push('')
  }

  lines.push('}')

  // Add HTTP to HTTPS redirect if SSL is enabled
  if (config.enableSSL && config.port === '443') {
    lines.push('')
    lines.push('# HTTP to HTTPS Redirect')
    lines.push('server {')
    lines.push('    listen 80;')
    lines.push('    listen [::]:80;')
    lines.push(`    server_name ${config.serverName};`)
    lines.push(`    return 301 https://$server_name$request_uri;`)
    lines.push('}')
  }

  return lines.join('\n')
}

export default function NginxConfigTool() {
  const { t } = useLanguage()
  const [config, setConfig] = useState<NginxConfig>(defaultConfig)
  const [output, setOutput] = useState('')

  useEffect(() => {
    setOutput(generateNginxConfig(config))
  }, [config])

  const updateConfig = (key: keyof NginxConfig, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const loadPreset = (preset: 'static' | 'proxy' | 'ssl') => {
    switch (preset) {
      case 'static':
        setConfig({
          ...defaultConfig,
          serverName: 'static.example.com',
          rootPath: '/var/www/static',
          enableGzip: true,
          cacheStatic: true,
        })
        break
      case 'proxy':
        setConfig({
          ...defaultConfig,
          serverName: 'app.example.com',
          enableProxy: true,
          proxyPass: 'http://localhost:3000',
          enableGzip: true,
        })
        break
      case 'ssl':
        setConfig({
          ...defaultConfig,
          serverName: 'secure.example.com',
          port: '443',
          enableSSL: true,
          sslCertPath: '/etc/letsencrypt/live/secure.example.com/fullchain.pem',
          sslKeyPath: '/etc/letsencrypt/live/secure.example.com/privkey.pem',
        })
        break
    }
  }

  const handleClear = () => {
    setConfig(defaultConfig)
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.serverName.replace(/\./g, '_')}.conf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolCard
      title={t('nginx.title')}
      description={t('nginx.description')}
    >
      <div className="space-y-6">
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadPreset('static')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {t('nginx.preset.static')}
          </button>
          <button
            onClick={() => loadPreset('proxy')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            {t('nginx.preset.proxy')}
          </button>
          <button
            onClick={() => loadPreset('ssl')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            {t('nginx.preset.ssl')}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {t('nginx.actions.clear')}
          </button>
        </div>

        {/* Configuration Form */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">{t('nginx.section.basic')}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('nginx.serverName')}
              </label>
              <input
                type="text"
                value={config.serverName}
                onChange={(e) => updateConfig('serverName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('nginx.port')}
              </label>
              <input
                type="text"
                value={config.port}
                onChange={(e) => updateConfig('port', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('nginx.rootPath')}
              </label>
              <input
                type="text"
                value={config.rootPath}
                onChange={(e) => updateConfig('rootPath', e.target.value)}
                disabled={config.enableProxy}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('nginx.clientMaxBodySize')}
              </label>
              <input
                type="text"
                value={config.clientMaxBodySize}
                onChange={(e) => updateConfig('clientMaxBodySize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">{t('nginx.section.features')}</h3>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.enableSSL}
                onChange={(e) => updateConfig('enableSSL', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700 dark:text-gray-300">{t('nginx.enableSSL')}</span>
            </label>

            {config.enableSSL && (
              <div className="ml-6 space-y-2">
                <input
                  type="text"
                  placeholder={t('nginx.sslCertPath')}
                  value={config.sslCertPath}
                  onChange={(e) => updateConfig('sslCertPath', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
                <input
                  type="text"
                  placeholder={t('nginx.sslKeyPath')}
                  value={config.sslKeyPath}
                  onChange={(e) => updateConfig('sslKeyPath', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.enableProxy}
                onChange={(e) => updateConfig('enableProxy', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700 dark:text-gray-300">{t('nginx.enableProxy')}</span>
            </label>

            {config.enableProxy && (
              <div className="ml-6">
                <input
                  type="text"
                  placeholder={t('nginx.proxyPass')}
                  value={config.proxyPass}
                  onChange={(e) => updateConfig('proxyPass', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.enableGzip}
                onChange={(e) => updateConfig('enableGzip', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700 dark:text-gray-300">{t('nginx.enableGzip')}</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.cacheStatic}
                onChange={(e) => updateConfig('cacheStatic', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700 dark:text-gray-300">{t('nginx.cacheStatic')}</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.enableCors}
                onChange={(e) => updateConfig('enableCors', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700 dark:text-gray-300">{t('nginx.enableCors')}</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.enableLogs}
                onChange={(e) => updateConfig('enableLogs', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700 dark:text-gray-300">{t('nginx.enableLogs')}</span>
            </label>
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('nginx.output.label')}
            </label>
            <button
              onClick={handleDownload}
              className="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition-colors"
            >
              {t('nginx.actions.download')}
            </button>
          </div>
          <TextAreaWithCopy
            value={output}
            readOnly
            rows={20}
          />
        </div>
      </div>
    </ToolCard>
  )
}
