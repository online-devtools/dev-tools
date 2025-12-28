'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface LintIssue {
    type: 'error' | 'warning' | 'info'
    message: string
    line?: number
    rule: string
}

interface ResourceBlock {
    type: string
    name: string
    attributes: string[]
    line: number
}

interface ParseResult {
    resources: ResourceBlock[]
    variables: string[]
    outputs: string[]
    issues: LintIssue[]
}

function parseTerraform(text: string): ParseResult {
    const lines = text.split('\n')
    const resources: ResourceBlock[] = []
    const variables: string[] = []
    const outputs: string[] = []
    const issues: LintIssue[] = []

    let currentBlock: { type: string; name: string; startLine: number; content: string[] } | null = null
    let braceCount = 0

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const lineNum = i + 1

        // Check for hardcoded secrets
        const secretPatterns = [
            /password\s*=\s*"[^"]+"/i,
            /secret\s*=\s*"[^"]+"/i,
            /api_key\s*=\s*"[^"]+"/i,
            /access_key\s*=\s*"[^"]+"/i,
            /secret_key\s*=\s*"[^"]+"/i,
            /private_key\s*=\s*"[^"]+"/i,
        ]

        for (const pattern of secretPatterns) {
            if (pattern.test(line) && !line.includes('var.') && !line.includes('data.')) {
                issues.push({
                    type: 'warning',
                    message: 'Potential hardcoded secret detected. Use variables or secrets manager.',
                    line: lineNum,
                    rule: 'no-hardcoded-secrets'
                })
            }
        }

        // Check for wildcard permissions
        if (/"actions"\s*=\s*\[\s*"\*"\s*\]/.test(line) || /Action.*=.*\*/.test(line)) {
            issues.push({
                type: 'warning',
                message: 'Wildcard (*) action detected. Consider using least privilege.',
                line: lineNum,
                rule: 'no-wildcard-actions'
            })
        }

        // Check for public access
        if (/publicly_accessible\s*=\s*true/i.test(line) || /public\s*=\s*true/i.test(line)) {
            issues.push({
                type: 'warning',
                message: 'Resource is publicly accessible. Verify this is intentional.',
                line: lineNum,
                rule: 'no-public-access'
            })
        }

        // Check for missing encryption
        if (/encrypted\s*=\s*false/i.test(line) || /enable_encryption\s*=\s*false/i.test(line)) {
            issues.push({
                type: 'warning',
                message: 'Encryption is disabled. Consider enabling encryption.',
                line: lineNum,
                rule: 'require-encryption'
            })
        }

        // Parse blocks
        const resourceMatch = line.match(/^resource\s+"([^"]+)"\s+"([^"]+)"\s*\{/)
        const variableMatch = line.match(/^variable\s+"([^"]+)"\s*\{/)
        const outputMatch = line.match(/^output\s+"([^"]+)"\s*\{/)
        const dataMatch = line.match(/^data\s+"([^"]+)"\s+"([^"]+)"\s*\{/)
        const moduleMatch = line.match(/^module\s+"([^"]+)"\s*\{/)

        if (resourceMatch) {
            currentBlock = { type: resourceMatch[1], name: resourceMatch[2], startLine: lineNum, content: [] }
            braceCount = 1
        } else if (dataMatch) {
            currentBlock = { type: `data.${dataMatch[1]}`, name: dataMatch[2], startLine: lineNum, content: [] }
            braceCount = 1
        } else if (moduleMatch) {
            currentBlock = { type: 'module', name: moduleMatch[1], startLine: lineNum, content: [] }
            braceCount = 1
        } else if (variableMatch) {
            variables.push(variableMatch[1])
            braceCount = 1
        } else if (outputMatch) {
            outputs.push(outputMatch[1])
            braceCount = 1
        } else if (currentBlock) {
            currentBlock.content.push(line)
            braceCount += (line.match(/\{/g) || []).length
            braceCount -= (line.match(/\}/g) || []).length

            if (braceCount <= 0) {
                resources.push({
                    type: currentBlock.type,
                    name: currentBlock.name,
                    attributes: currentBlock.content
                        .map(l => l.trim())
                        .filter(l => l.includes('='))
                        .map(l => l.split('=')[0].trim()),
                    line: currentBlock.startLine
                })
                currentBlock = null
            }
        } else {
            braceCount += (line.match(/\{/g) || []).length
            braceCount -= (line.match(/\}/g) || []).length
        }
    }

    // Check for common issues
    const awsResources = resources.filter(r => r.type.startsWith('aws_'))
    for (const resource of awsResources) {
        if (resource.type === 'aws_s3_bucket' && !resource.attributes.includes('versioning')) {
            issues.push({
                type: 'info',
                message: `S3 bucket '${resource.name}' should consider enabling versioning.`,
                line: resource.line,
                rule: 's3-versioning'
            })
        }

        if (resource.type === 'aws_security_group') {
            const hasEgressAll = resource.attributes.some(a => a.includes('egress'))
            if (!hasEgressAll) {
                issues.push({
                    type: 'info',
                    message: `Security group '${resource.name}' has no explicit egress rules.`,
                    line: resource.line,
                    rule: 'sg-egress'
                })
            }
        }
    }

    return { resources, variables, outputs, issues }
}

export default function TerraformLinterTool() {
    const { t } = useLanguage()
    const [input, setInput] = useState('')
    const [result, setResult] = useState<ParseResult | null>(null)
    const [copied, setCopied] = useState(false)

    const handleLint = () => {
        setResult(parseTerraform(input))
    }

    const handleClear = () => {
        setInput('')
        setResult(null)
    }

    const sampleTerraform = `variable "environment" {
  description = "The environment name"
  type        = string
  default     = "dev"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

resource "aws_s3_bucket" "data" {
  bucket = "my-data-bucket-\${var.environment}"
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_db_instance" "main" {
  identifier           = "main-db"
  engine               = "postgres"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  password             = "hardcoded_password_123"
  publicly_accessible  = true
  encrypted            = false

  tags = {
    Name = "Main Database"
  }
}

resource "aws_iam_policy" "admin" {
  name = "admin-policy"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["*"]
        Resource = "*"
      }
    ]
  })
}

output "bucket_arn" {
  value = aws_s3_bucket.data.arn
}`

    const handleLoadSample = () => {
        setInput(sampleTerraform)
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(input)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getIssueBadgeColor = (type: LintIssue['type']) => {
        switch (type) {
            case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            case 'warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'info': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {t('terraformLinter.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('terraformLinter.description')}
                </p>

                {/* Input Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('terraformLinter.input.label')}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('terraformLinter.input.placeholder')}
                        className="w-full h-80 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={handleLint}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        {t('terraformLinter.actions.lint')}
                    </button>
                    <button
                        onClick={handleLoadSample}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                        {t('terraformLinter.actions.sample')}
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

                {/* Results */}
                {result && (
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                                    {result.resources.length}
                                </div>
                                <div className="text-sm text-purple-600 dark:text-purple-300">
                                    {t('terraformLinter.summary.resources')}
                                </div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                                    {result.variables.length}
                                </div>
                                <div className="text-sm text-green-600 dark:text-green-300">
                                    {t('terraformLinter.summary.variables')}
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                    {result.outputs.length}
                                </div>
                                <div className="text-sm text-blue-600 dark:text-blue-300">
                                    {t('terraformLinter.summary.outputs')}
                                </div>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                                    {result.issues.length}
                                </div>
                                <div className="text-sm text-yellow-600 dark:text-yellow-300">
                                    {t('terraformLinter.summary.issues')}
                                </div>
                            </div>
                        </div>

                        {/* Issues */}
                        {result.issues.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    {t('terraformLinter.issues.title')}
                                </h3>
                                <div className="space-y-2">
                                    {result.issues.map((issue, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-lg text-sm border-l-4 ${issue.type === 'error'
                                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                                                    : issue.type === 'warning'
                                                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                                                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getIssueBadgeColor(issue.type)}`}>
                                                    {issue.type.toUpperCase()}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {issue.line && `Line ${issue.line}`}
                                                </span>
                                                <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded text-gray-600 dark:text-gray-400">
                                                    {issue.rule}
                                                </code>
                                            </div>
                                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                {issue.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Resources */}
                        {result.resources.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    {t('terraformLinter.resources.title')}
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {result.resources.map((resource, i) => (
                                        <div
                                            key={i}
                                            className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50"
                                        >
                                            <h4 className="font-mono text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                                🏗️ {resource.type}.{resource.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Line {resource.line} • {resource.attributes.length} attributes
                                            </p>
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
                    {t('terraformLinter.info.title')}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                    <li>{t('terraformLinter.info.bullet1')}</li>
                    <li>{t('terraformLinter.info.bullet2')}</li>
                    <li>{t('terraformLinter.info.bullet3')}</li>
                </ul>
            </div>
        </div>
    )
}
