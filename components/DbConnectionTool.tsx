'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type DbType = 'postgresql' | 'mysql' | 'mongodb' | 'redis' | 'sqlite' | 'mssql'

interface ConnectionConfig {
  dbType: DbType
  host: string
  port: string
  database: string
  username: string
  password: string
  options: Record<string, string>
}

const defaultPorts: Record<DbType, string> = {
  postgresql: '5432',
  mysql: '3306',
  mongodb: '27017',
  redis: '6379',
  sqlite: '',
  mssql: '1433',
}

const dbLabels: Record<DbType, string> = {
  postgresql: 'PostgreSQL',
  mysql: 'MySQL / MariaDB',
  mongodb: 'MongoDB',
  redis: 'Redis',
  sqlite: 'SQLite',
  mssql: 'SQL Server',
}

function buildConnectionString(config: ConnectionConfig): string {
  const { dbType, host, port, database, username, password, options } = config

  const encodeComponent = (str: string) => encodeURIComponent(str)

  switch (dbType) {
    case 'postgresql': {
      let url = 'postgresql://'
      if (username) {
        url += encodeComponent(username)
        if (password) url += ':' + encodeComponent(password)
        url += '@'
      }
      url += host
      if (port) url += ':' + port
      if (database) url += '/' + encodeComponent(database)
      const optStr = Object.entries(options)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${encodeComponent(v)}`)
        .join('&')
      if (optStr) url += '?' + optStr
      return url
    }

    case 'mysql': {
      let url = 'mysql://'
      if (username) {
        url += encodeComponent(username)
        if (password) url += ':' + encodeComponent(password)
        url += '@'
      }
      url += host
      if (port) url += ':' + port
      if (database) url += '/' + encodeComponent(database)
      const optStr = Object.entries(options)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${encodeComponent(v)}`)
        .join('&')
      if (optStr) url += '?' + optStr
      return url
    }

    case 'mongodb': {
      let url = 'mongodb://'
      if (username) {
        url += encodeComponent(username)
        if (password) url += ':' + encodeComponent(password)
        url += '@'
      }
      url += host
      if (port) url += ':' + port
      if (database) url += '/' + encodeComponent(database)
      const optStr = Object.entries(options)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${encodeComponent(v)}`)
        .join('&')
      if (optStr) url += '?' + optStr
      return url
    }

    case 'redis': {
      let url = 'redis://'
      if (username) {
        url += encodeComponent(username)
        if (password) url += ':' + encodeComponent(password)
        url += '@'
      } else if (password) {
        url += ':' + encodeComponent(password) + '@'
      }
      url += host
      if (port) url += ':' + port
      if (database) url += '/' + database
      return url
    }

    case 'sqlite': {
      return database || ':memory:'
    }

    case 'mssql': {
      let url = 'mssql://'
      if (username) {
        url += encodeComponent(username)
        if (password) url += ':' + encodeComponent(password)
        url += '@'
      }
      url += host
      if (port) url += ':' + port
      if (database) url += '/' + encodeComponent(database)
      const optStr = Object.entries(options)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${encodeComponent(v)}`)
        .join('&')
      if (optStr) url += '?' + optStr
      return url
    }
  }
}

function parseConnectionString(url: string): ConnectionConfig | null {
  try {
    // Detect DB type from protocol
    const protocolMatch = url.match(/^(\w+):\/\//)
    if (!protocolMatch) {
      // Could be SQLite path
      if (url.includes('.db') || url.includes('.sqlite') || url === ':memory:') {
        return {
          dbType: 'sqlite',
          host: '',
          port: '',
          database: url,
          username: '',
          password: '',
          options: {},
        }
      }
      return null
    }

    const protocol = protocolMatch[1].toLowerCase()
    let dbType: DbType

    switch (protocol) {
      case 'postgresql':
      case 'postgres':
        dbType = 'postgresql'
        break
      case 'mysql':
      case 'mariadb':
        dbType = 'mysql'
        break
      case 'mongodb':
      case 'mongodb+srv':
        dbType = 'mongodb'
        break
      case 'redis':
      case 'rediss':
        dbType = 'redis'
        break
      case 'mssql':
      case 'sqlserver':
        dbType = 'mssql'
        break
      default:
        return null
    }

    // Parse URL
    const urlWithoutProtocol = url.replace(/^\w+:\/\//, '')
    let remainder = urlWithoutProtocol

    let username = ''
    let password = ''
    let host = ''
    let port = ''
    let database = ''
    const options: Record<string, string> = {}

    // Extract auth
    const atIndex = remainder.indexOf('@')
    if (atIndex !== -1) {
      const auth = remainder.substring(0, atIndex)
      remainder = remainder.substring(atIndex + 1)
      const colonIndex = auth.indexOf(':')
      if (colonIndex !== -1) {
        username = decodeURIComponent(auth.substring(0, colonIndex))
        password = decodeURIComponent(auth.substring(colonIndex + 1))
      } else {
        username = decodeURIComponent(auth)
      }
    }

    // Extract options
    const questionIndex = remainder.indexOf('?')
    if (questionIndex !== -1) {
      const optStr = remainder.substring(questionIndex + 1)
      remainder = remainder.substring(0, questionIndex)
      optStr.split('&').forEach(pair => {
        const [k, v] = pair.split('=')
        if (k && v) {
          options[k] = decodeURIComponent(v)
        }
      })
    }

    // Extract database
    const slashIndex = remainder.indexOf('/')
    if (slashIndex !== -1) {
      database = decodeURIComponent(remainder.substring(slashIndex + 1))
      remainder = remainder.substring(0, slashIndex)
    }

    // Extract host:port
    const colonIndex = remainder.lastIndexOf(':')
    if (colonIndex !== -1 && !remainder.substring(colonIndex + 1).includes('[')) {
      host = remainder.substring(0, colonIndex)
      port = remainder.substring(colonIndex + 1)
    } else {
      host = remainder
    }

    return {
      dbType,
      host,
      port,
      database,
      username,
      password,
      options,
    }
  } catch {
    return null
  }
}

export default function DbConnectionTool() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'build' | 'parse'>('build')
  const [config, setConfig] = useState<ConnectionConfig>({
    dbType: 'postgresql',
    host: 'localhost',
    port: '5432',
    database: 'mydb',
    username: 'user',
    password: '',
    options: {},
  })
  const [parseInput, setParseInput] = useState('')
  const [parseResult, setParseResult] = useState('')
  const [error, setError] = useState('')

  const handleDbTypeChange = (dbType: DbType) => {
    setConfig(prev => ({
      ...prev,
      dbType,
      port: defaultPorts[dbType],
    }))
  }

  const handleOptionChange = (key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      options: { ...prev.options, [key]: value },
    }))
  }

  const connectionString = buildConnectionString(config)

  const handleParse = () => {
    setError('')
    const parsed = parseConnectionString(parseInput.trim())
    if (!parsed) {
      setError(t('dbconn.error.parse'))
      setParseResult('')
      return
    }
    setParseResult(JSON.stringify(parsed, null, 2))
  }

  const loadSample = (type: DbType) => {
    const samples: Record<DbType, string> = {
      postgresql: 'postgresql://user:password@localhost:5432/mydb?sslmode=require',
      mysql: 'mysql://root:secret@127.0.0.1:3306/app?charset=utf8mb4',
      mongodb: 'mongodb://admin:pass123@cluster0.example.mongodb.net:27017/myapp?retryWrites=true',
      redis: 'redis://:mypassword@redis.example.com:6379/0',
      sqlite: '/var/lib/app/data.db',
      mssql: 'mssql://sa:Password123@localhost:1433/master?encrypt=true',
    }
    setParseInput(samples[type])
  }

  return (
    <ToolCard
      title={t('dbconn.title')}
      description={t('dbconn.description')}
    >
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('build')}
            className={`px-4 py-2 rounded transition-colors ${
              mode === 'build'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('dbconn.mode.build')}
          </button>
          <button
            onClick={() => setMode('parse')}
            className={`px-4 py-2 rounded transition-colors ${
              mode === 'parse'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('dbconn.mode.parse')}
          </button>
        </div>

        {mode === 'build' ? (
          <>
            {/* DB Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dbconn.dbType')}
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {(Object.keys(dbLabels) as DbType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => handleDbTypeChange(type)}
                    className={`px-3 py-2 text-sm rounded transition-colors ${
                      config.dbType === type
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {dbLabels[type]}
                  </button>
                ))}
              </div>
            </div>

            {/* Connection Fields */}
            {config.dbType !== 'sqlite' ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('dbconn.host')}
                  </label>
                  <input
                    type="text"
                    value={config.host}
                    onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('dbconn.port')}
                  </label>
                  <input
                    type="text"
                    value={config.port}
                    onChange={(e) => setConfig(prev => ({ ...prev, port: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('dbconn.username')}
                  </label>
                  <input
                    type="text"
                    value={config.username}
                    onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('dbconn.password')}
                  </label>
                  <input
                    type="password"
                    value={config.password}
                    onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('dbconn.database')}
                  </label>
                  <input
                    type="text"
                    value={config.database}
                    onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('dbconn.filePath')}
                </label>
                <input
                  type="text"
                  value={config.database}
                  onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
                  placeholder="/path/to/database.db or :memory:"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            )}

            {/* Common Options */}
            {config.dbType !== 'sqlite' && config.dbType !== 'redis' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('dbconn.options')}
                </label>
                <div className="grid md:grid-cols-2 gap-2">
                  {config.dbType === 'postgresql' && (
                    <input
                      type="text"
                      placeholder="sslmode=require"
                      value={config.options['sslmode'] || ''}
                      onChange={(e) => handleOptionChange('sslmode', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  )}
                  {config.dbType === 'mysql' && (
                    <input
                      type="text"
                      placeholder="charset=utf8mb4"
                      value={config.options['charset'] || ''}
                      onChange={(e) => handleOptionChange('charset', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  )}
                  {config.dbType === 'mongodb' && (
                    <>
                      <input
                        type="text"
                        placeholder="retryWrites=true"
                        value={config.options['retryWrites'] || ''}
                        onChange={(e) => handleOptionChange('retryWrites', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="authSource=admin"
                        value={config.options['authSource'] || ''}
                        onChange={(e) => handleOptionChange('authSource', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Output */}
            <TextAreaWithCopy
              value={connectionString}
              readOnly
              label={t('dbconn.result')}
              rows={3}
            />
          </>
        ) : (
          <>
            {/* Parse Mode */}
            <div className="flex flex-wrap gap-2 mb-2">
              {(Object.keys(dbLabels) as DbType[]).map(type => (
                <button
                  key={type}
                  onClick={() => loadSample(type)}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {dbLabels[type]}
                </button>
              ))}
            </div>

            <TextAreaWithCopy
              value={parseInput}
              onChange={setParseInput}
              placeholder={t('dbconn.parse.placeholder')}
              label={t('dbconn.parse.input')}
              rows={3}
            />

            <button
              onClick={handleParse}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {t('dbconn.parse.button')}
            </button>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                {error}
              </div>
            )}

            {parseResult && (
              <TextAreaWithCopy
                value={parseResult}
                readOnly
                label={t('dbconn.parse.result')}
                rows={12}
              />
            )}
          </>
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            {t('dbconn.info.title')}
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• {t('dbconn.info.item1')}</li>
            <li>• {t('dbconn.info.item2')}</li>
            <li>• {t('dbconn.info.item3')}</li>
            <li>• {t('dbconn.info.item4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
