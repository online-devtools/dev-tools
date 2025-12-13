'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type Language = 'fetch' | 'axios' | 'python' | 'node' | 'php'

export default function CurlConverterTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [language, setLanguage] = useState<Language>('fetch')
  const [error, setError] = useState('')

  const parseCurl = (curlCommand: string) => {
    const result: {
      method: string
      url: string
      headers: Record<string, string>
      body?: string
    } = {
      method: 'GET',
      url: '',
      headers: {},
    }

    // Extract URL
    const urlMatch = curlCommand.match(/curl\s+(?:-X\s+\w+\s+)?['"]?([^'"\s]+)/)
    if (urlMatch) {
      result.url = urlMatch[1]
    }

    // Extract method
    const methodMatch = curlCommand.match(/-X\s+(\w+)/)
    if (methodMatch) {
      result.method = methodMatch[1]
    }

    // Extract headers
    const headerMatches = curlCommand.matchAll(/-H\s+['"]([^'"]+)['"]/g)
    for (const match of headerMatches) {
      const [key, value] = match[1].split(':').map(s => s.trim())
      if (key && value) {
        result.headers[key] = value
      }
    }

    // Extract data/body
    const dataMatch = curlCommand.match(/--data(?:-raw|-binary)?\s+['"]([^'"]+)['"]/)
    if (dataMatch) {
      result.body = dataMatch[1]
      if (!result.method || result.method === 'GET') {
        result.method = 'POST'
      }
    }

    return result
  }

  const generateFetch = (parsed: ReturnType<typeof parseCurl>) => {
    const options: string[] = []
    options.push(`  method: '${parsed.method}'`)

    if (Object.keys(parsed.headers).length > 0) {
      const headersStr = Object.entries(parsed.headers)
        .map(([key, value]) => `    '${key}': '${value}'`)
        .join(',\n')
      options.push(`  headers: {\n${headersStr}\n  }`)
    }

    if (parsed.body) {
      options.push(`  body: '${parsed.body}'`)
    }

    return `fetch('${parsed.url}', {\n${options.join(',\n')}\n})\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error('Error:', error));`
  }

  const generateAxios = (parsed: ReturnType<typeof parseCurl>) => {
    const config: string[] = []

    if (Object.keys(parsed.headers).length > 0) {
      const headersStr = Object.entries(parsed.headers)
        .map(([key, value]) => `    '${key}': '${value}'`)
        .join(',\n')
      config.push(`  headers: {\n${headersStr}\n  }`)
    }

    const method = parsed.method.toLowerCase()
    const hasBody = parsed.body && (method === 'post' || method === 'put' || method === 'patch')

    if (hasBody) {
      return `axios.${method}('${parsed.url}', ${parsed.body ? `'${parsed.body}'` : 'null'}${config.length > 0 ? `, {\n${config.join(',\n')}\n}` : ''})\n  .then(response => console.log(response.data))\n  .catch(error => console.error('Error:', error));`
    } else {
      return `axios.${method}('${parsed.url}'${config.length > 0 ? `, {\n${config.join(',\n')}\n}` : ''})\n  .then(response => console.log(response.data))\n  .catch(error => console.error('Error:', error));`
    }
  }

  const generatePython = (parsed: ReturnType<typeof parseCurl>) => {
    let code = 'import requests\n\n'
    code += `url = '${parsed.url}'\n`

    if (Object.keys(parsed.headers).length > 0) {
      const headersStr = Object.entries(parsed.headers)
        .map(([key, value]) => `    '${key}': '${value}'`)
        .join(',\n')
      code += `headers = {\n${headersStr}\n}\n`
    }

    if (parsed.body) {
      code += `data = '${parsed.body}'\n`
    }

    code += `\nresponse = requests.${parsed.method.toLowerCase()}(url`
    if (Object.keys(parsed.headers).length > 0) {
      code += ', headers=headers'
    }
    if (parsed.body) {
      code += ', data=data'
    }
    code += ')\n'
    code += 'print(response.json())'

    return code
  }

  const generateNode = (parsed: ReturnType<typeof parseCurl>) => {
    let code = "const https = require('https');\n\n"
    code += `const url = new URL('${parsed.url}');\n\n`
    code += 'const options = {\n'
    code += '  hostname: url.hostname,\n'
    code += '  path: url.pathname + url.search,\n'
    code += `  method: '${parsed.method}',\n`

    if (Object.keys(parsed.headers).length > 0) {
      const headersStr = Object.entries(parsed.headers)
        .map(([key, value]) => `    '${key}': '${value}'`)
        .join(',\n')
      code += `  headers: {\n${headersStr}\n  }\n`
    }

    code += '};\n\n'
    code += 'const req = https.request(options, (res) => {\n'
    code += '  let data = \'\';\n'
    code += '  res.on(\'data\', (chunk) => data += chunk);\n'
    code += '  res.on(\'end\', () => console.log(JSON.parse(data)));\n'
    code += '});\n\n'

    if (parsed.body) {
      code += `req.write('${parsed.body}');\n`
    }

    code += 'req.on(\'error\', (error) => console.error(error));\n'
    code += 'req.end();'

    return code
  }

  const generatePHP = (parsed: ReturnType<typeof parseCurl>) => {
    let code = '<?php\n\n'
    code += '$curl = curl_init();\n\n'
    code += 'curl_setopt_array($curl, [\n'
    code += `  CURLOPT_URL => '${parsed.url}',\n`
    code += '  CURLOPT_RETURNTRANSFER => true,\n'
    code += `  CURLOPT_CUSTOMREQUEST => '${parsed.method}',\n`

    if (Object.keys(parsed.headers).length > 0) {
      const headersArr = Object.entries(parsed.headers)
        .map(([key, value]) => `    '${key}: ${value}'`)
        .join(',\n')
      code += `  CURLOPT_HTTPHEADER => [\n${headersArr}\n  ],\n`
    }

    if (parsed.body) {
      code += `  CURLOPT_POSTFIELDS => '${parsed.body}',\n`
    }

    code += ']);\n\n'
    code += '$response = curl_exec($curl);\n'
    code += 'curl_close($curl);\n\n'
    code += 'echo $response;'

    return code
  }

  const handleConvert = () => {
    if (!input.trim()) {
      setError(t('curlConverter.error.emptyInput'))
      setOutput('')
      return
    }

    if (!input.trim().startsWith('curl')) {
      setError(t('curlConverter.error.invalidCurl'))
      setOutput('')
      return
    }

    setError('')

    try {
      const parsed = parseCurl(input)

      if (!parsed.url) {
        setError(t('curlConverter.error.noUrl'))
        return
      }

      let code = ''
      switch (language) {
        case 'fetch':
          code = generateFetch(parsed)
          break
        case 'axios':
          code = generateAxios(parsed)
          break
        case 'python':
          code = generatePython(parsed)
          break
        case 'node':
          code = generateNode(parsed)
          break
        case 'php':
          code = generatePHP(parsed)
          break
      }

      setOutput(code)
    } catch (err) {
      setError(t('curlConverter.error.convertFailed'))
    }
  }

  return (
    <ToolCard
      title={t('curlConverter.title')}
      description={t('curlConverter.description')}
    >
      <div className="space-y-6">
        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('curlConverter.targetLanguage')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {(['fetch', 'axios', 'python', 'node', 'php'] as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  language === lang
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {lang === 'fetch' ? 'Fetch API' :
                 lang === 'axios' ? 'Axios' :
                 lang === 'python' ? 'Python' :
                 lang === 'node' ? 'Node.js' : 'PHP'}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('curlConverter.input')}
          placeholder={t('curlConverter.inputPlaceholder')}
          rows={8}
        />

        {/* Convert Button */}
        <div className="flex gap-3">
          <button
            onClick={handleConvert}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {t('curlConverter.convert')}
          </button>
          <button
            onClick={() => {
              setInput('')
              setOutput('')
              setError('')
            }}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
          >
            {t('common.clear')}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Output */}
        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('curlConverter.output')}
          placeholder={t('curlConverter.outputPlaceholder')}
          rows={15}
        />

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            {t('curlConverter.infoTitle')}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>{t('curlConverter.info1')}</li>
            <li>{t('curlConverter.info2')}</li>
            <li>{t('curlConverter.info3')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
