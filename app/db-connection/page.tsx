import DbConnectionTool from '@/components/DbConnectionTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Database Connection String Builder & Parser',
  description: 'Build and parse database connection strings for PostgreSQL, MySQL, MongoDB, Redis, SQLite, and SQL Server.',
  keywords: ['database', 'connection string', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'SQL Server', 'parser', 'builder'],
  openGraph: {
    title: 'DB Connection String Tool - Developer Tools',
    description: 'Build and parse database connection strings',
  },
}

export default function DbConnectionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <DbConnectionTool />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Connection String Reference
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Connection String Formats
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-purple-600 mb-2">PostgreSQL</p>
                <code className="text-sm break-all">postgresql://user:password@host:5432/database?sslmode=require</code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-blue-600 mb-2">MySQL</p>
                <code className="text-sm break-all">mysql://user:password@host:3306/database?charset=utf8mb4</code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-green-600 mb-2">MongoDB</p>
                <code className="text-sm break-all">mongodb://user:password@host:27017/database?authSource=admin</code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-red-600 mb-2">Redis</p>
                <code className="text-sm break-all">redis://:password@host:6379/0</code>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Common Options
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Database</th>
                    <th className="px-4 py-2 text-left">Option</th>
                    <th className="px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-2">PostgreSQL</td>
                    <td className="px-4 py-2 font-mono">sslmode</td>
                    <td className="px-4 py-2">disable, require, verify-full</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">MySQL</td>
                    <td className="px-4 py-2 font-mono">charset</td>
                    <td className="px-4 py-2">utf8, utf8mb4</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">MongoDB</td>
                    <td className="px-4 py-2 font-mono">authSource</td>
                    <td className="px-4 py-2">Authentication database</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">MongoDB</td>
                    <td className="px-4 py-2 font-mono">retryWrites</td>
                    <td className="px-4 py-2">Enable retry on write errors</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Security Best Practices
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Never commit connection strings to version control</li>
              <li>Use environment variables for sensitive credentials</li>
              <li>Enable SSL/TLS for production connections</li>
              <li>Use connection pooling for better performance</li>
              <li>Rotate credentials periodically</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
