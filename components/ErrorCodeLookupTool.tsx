'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ErrorCode {
    code: string
    name: string
    description: string
    solution?: string
    category: 'http' | 'postgresql' | 'mysql'
}

const ERROR_DATABASE: ErrorCode[] = [
    // HTTP Status Codes
    { code: '200', name: 'OK', description: 'The request succeeded.', category: 'http' },
    { code: '201', name: 'Created', description: 'The request succeeded and a new resource was created.', category: 'http' },
    { code: '204', name: 'No Content', description: 'The request succeeded but returns no content.', category: 'http' },
    { code: '301', name: 'Moved Permanently', description: 'The URL has been permanently moved.', category: 'http' },
    { code: '302', name: 'Found', description: 'The URL has been temporarily moved.', category: 'http' },
    { code: '304', name: 'Not Modified', description: 'Resource not modified since last request.', category: 'http' },
    { code: '400', name: 'Bad Request', description: 'The server cannot process the request due to client error.', solution: 'Check request syntax, headers, and body format.', category: 'http' },
    { code: '401', name: 'Unauthorized', description: 'Authentication is required and has failed or not been provided.', solution: 'Provide valid authentication credentials.', category: 'http' },
    { code: '403', name: 'Forbidden', description: 'The server understood the request but refuses to authorize it.', solution: 'Check user permissions and access rights.', category: 'http' },
    { code: '404', name: 'Not Found', description: 'The requested resource could not be found.', solution: 'Verify the URL is correct and the resource exists.', category: 'http' },
    { code: '405', name: 'Method Not Allowed', description: 'The request method is not supported for this resource.', solution: 'Use a different HTTP method (GET, POST, PUT, DELETE).', category: 'http' },
    { code: '408', name: 'Request Timeout', description: 'The server timed out waiting for the request.', solution: 'Retry the request or increase timeout settings.', category: 'http' },
    { code: '409', name: 'Conflict', description: 'The request conflicts with the current state of the resource.', solution: 'Resolve the conflict and retry.', category: 'http' },
    { code: '413', name: 'Payload Too Large', description: 'The request entity is larger than the server will process.', solution: 'Reduce the size of the request body.', category: 'http' },
    { code: '415', name: 'Unsupported Media Type', description: 'The media format is not supported.', solution: 'Use a supported Content-Type header.', category: 'http' },
    { code: '422', name: 'Unprocessable Entity', description: 'The request was well-formed but had semantic errors.', solution: 'Check the request body for validation errors.', category: 'http' },
    { code: '429', name: 'Too Many Requests', description: 'The user has sent too many requests in a given time.', solution: 'Implement rate limiting and add delays between requests.', category: 'http' },
    { code: '500', name: 'Internal Server Error', description: 'The server encountered an unexpected condition.', solution: 'Check server logs for the root cause.', category: 'http' },
    { code: '501', name: 'Not Implemented', description: 'The server does not support the functionality required.', solution: 'Use a different endpoint or implement the feature.', category: 'http' },
    { code: '502', name: 'Bad Gateway', description: 'The server received an invalid response from an upstream server.', solution: 'Check the upstream server status and connectivity.', category: 'http' },
    { code: '503', name: 'Service Unavailable', description: 'The server is not ready to handle the request.', solution: 'Wait and retry, or check server health.', category: 'http' },
    { code: '504', name: 'Gateway Timeout', description: 'The gateway did not receive a response from the upstream server.', solution: 'Check upstream server performance and network.', category: 'http' },

    // PostgreSQL Error Codes
    { code: '23505', name: 'unique_violation', description: 'Duplicate key value violates unique constraint.', solution: 'Ensure the value is unique or use ON CONFLICT clause.', category: 'postgresql' },
    { code: '23503', name: 'foreign_key_violation', description: 'Foreign key constraint violation.', solution: 'Ensure referenced row exists before inserting.', category: 'postgresql' },
    { code: '23502', name: 'not_null_violation', description: 'NOT NULL constraint violation.', solution: 'Provide a value for the NOT NULL column.', category: 'postgresql' },
    { code: '23514', name: 'check_violation', description: 'CHECK constraint violation.', solution: 'Ensure the value satisfies the CHECK constraint.', category: 'postgresql' },
    { code: '42601', name: 'syntax_error', description: 'SQL syntax error.', solution: 'Check SQL syntax near the error position.', category: 'postgresql' },
    { code: '42P01', name: 'undefined_table', description: 'Table does not exist.', solution: 'Verify table name and run migrations if needed.', category: 'postgresql' },
    { code: '42703', name: 'undefined_column', description: 'Column does not exist.', solution: 'Check column name spelling and case sensitivity.', category: 'postgresql' },
    { code: '42P04', name: 'duplicate_database', description: 'Database already exists.', solution: 'Use a different name or drop existing database.', category: 'postgresql' },
    { code: '42P07', name: 'duplicate_table', description: 'Table already exists.', solution: 'Use IF NOT EXISTS or drop existing table.', category: 'postgresql' },
    { code: '53100', name: 'disk_full', description: 'Disk space is exhausted.', solution: 'Free up disk space or increase storage.', category: 'postgresql' },
    { code: '53200', name: 'out_of_memory', description: 'Server ran out of memory.', solution: 'Increase memory or optimize queries.', category: 'postgresql' },
    { code: '57014', name: 'query_canceled', description: 'Query was cancelled by statement_timeout.', solution: 'Optimize query or increase timeout.', category: 'postgresql' },
    { code: '28P01', name: 'invalid_password', description: 'Invalid password for user.', solution: 'Check credentials for the database user.', category: 'postgresql' },
    { code: '3D000', name: 'invalid_catalog_name', description: 'Database does not exist.', solution: 'Create the database or check the name.', category: 'postgresql' },
    { code: '08006', name: 'connection_failure', description: 'Connection to the server was lost.', solution: 'Check network and server status.', category: 'postgresql' },
    { code: '40001', name: 'serialization_failure', description: 'Transaction could not serialize access.', solution: 'Retry the transaction.', category: 'postgresql' },
    { code: '40P01', name: 'deadlock_detected', description: 'Deadlock detected between transactions.', solution: 'Restructure transactions to avoid deadlock.', category: 'postgresql' },

    // MySQL Error Codes
    { code: '1045', name: 'ER_ACCESS_DENIED_ERROR', description: 'Access denied for user.', solution: 'Check username, password, and host permissions.', category: 'mysql' },
    { code: '1049', name: 'ER_BAD_DB_ERROR', description: 'Unknown database.', solution: 'Create the database or check spelling.', category: 'mysql' },
    { code: '1054', name: 'ER_BAD_FIELD_ERROR', description: 'Unknown column in field list.', solution: 'Check column name and table structure.', category: 'mysql' },
    { code: '1062', name: 'ER_DUP_ENTRY', description: 'Duplicate entry for key.', solution: 'Use INSERT IGNORE or ON DUPLICATE KEY UPDATE.', category: 'mysql' },
    { code: '1064', name: 'ER_PARSE_ERROR', description: 'SQL syntax error.', solution: 'Check SQL syntax near the error position.', category: 'mysql' },
    { code: '1146', name: 'ER_NO_SUCH_TABLE', description: 'Table does not exist.', solution: 'Create the table or check table name.', category: 'mysql' },
    { code: '1215', name: 'ER_CANNOT_ADD_FOREIGN', description: 'Cannot add foreign key constraint.', solution: 'Check parent table structure and data types.', category: 'mysql' },
    { code: '1217', name: 'ER_ROW_IS_REFERENCED', description: 'Cannot delete or update a parent row.', solution: 'Delete child rows first or use ON DELETE CASCADE.', category: 'mysql' },
    { code: '1451', name: 'ER_ROW_IS_REFERENCED_2', description: 'Foreign key constraint fails on delete/update.', solution: 'Handle child records before modifying parent.', category: 'mysql' },
    { code: '1452', name: 'ER_NO_REFERENCED_ROW_2', description: 'Foreign key constraint fails on insert/update.', solution: 'Ensure parent row exists first.', category: 'mysql' },
    { code: '2002', name: 'CR_CONNECTION_ERROR', description: 'Cannot connect to local MySQL server.', solution: 'Check if MySQL is running and socket is correct.', category: 'mysql' },
    { code: '2003', name: 'CR_CONN_HOST_ERROR', description: 'Cannot connect to MySQL server on host.', solution: 'Check server address, port, and firewall.', category: 'mysql' },
    { code: '2006', name: 'CR_SERVER_GONE_ERROR', description: 'MySQL server has gone away.', solution: 'Check wait_timeout and max_allowed_packet.', category: 'mysql' },
    { code: '1205', name: 'ER_LOCK_WAIT_TIMEOUT', description: 'Lock wait timeout exceeded.', solution: 'Optimize queries or increase innodb_lock_wait_timeout.', category: 'mysql' },
    { code: '1213', name: 'ER_LOCK_DEADLOCK', description: 'Deadlock found when trying to get lock.', solution: 'Retry transaction or restructure queries.', category: 'mysql' },
]

const categoryLabels: Record<string, string> = {
    http: 'HTTP',
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
}

const categoryColors: Record<string, string> = {
    http: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    postgresql: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    mysql: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

export default function ErrorCodeLookupTool() {
    const { t } = useLanguage()
    const [query, setQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [copied, setCopied] = useState<string | null>(null)

    const filteredCodes = useMemo(() => {
        return ERROR_DATABASE.filter((error) => {
            const matchesCategory = selectedCategory === 'all' || error.category === selectedCategory
            const matchesQuery =
                query === '' ||
                error.code.toLowerCase().includes(query.toLowerCase()) ||
                error.name.toLowerCase().includes(query.toLowerCase()) ||
                error.description.toLowerCase().includes(query.toLowerCase())
            return matchesCategory && matchesQuery
        })
    }, [query, selectedCategory])

    const handleCopy = async (code: string) => {
        await navigator.clipboard.writeText(code)
        setCopied(code)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {t('errorCode.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('errorCode.description')}
                </p>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('errorCode.search.placeholder')}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'http', 'postgresql', 'mysql'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg transition ${selectedCategory === cat
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500'
                                    }`}
                            >
                                {cat === 'all' ? t('errorCode.filter.all') : categoryLabels[cat]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {t('errorCode.results.count', { count: filteredCodes.length })}
                </div>

                {/* Error Code List */}
                <div className="space-y-3">
                    {filteredCodes.map((error) => (
                        <div
                            key={`${error.category}-${error.code}`}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                        >
                            <div className="flex flex-wrap items-start gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[error.category]}`}>
                                    {categoryLabels[error.category]}
                                </span>
                                <button
                                    onClick={() => handleCopy(error.code)}
                                    className="font-mono text-lg font-bold text-gray-900 dark:text-white hover:text-blue-500 transition"
                                    title="Click to copy"
                                >
                                    {error.code}
                                    {copied === error.code && (
                                        <span className="ml-2 text-xs text-green-500">✓</span>
                                    )}
                                </button>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    {error.name}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                {error.description}
                            </p>
                            {error.solution && (
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    💡 {error.solution}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {filteredCodes.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        {t('errorCode.results.empty')}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    {t('errorCode.info.title')}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                    <li>{t('errorCode.info.bullet1')}</li>
                    <li>{t('errorCode.info.bullet2')}</li>
                    <li>{t('errorCode.info.bullet3')}</li>
                </ul>
            </div>
        </div>
    )
}
