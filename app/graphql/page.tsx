import GraphQLTool from '@/components/GraphQLTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GraphQL Query Formatter & Validator',
  description: 'Format, validate, and minify GraphQL queries. Free online GraphQL formatter, validator, and compression tool for developers.',
  keywords: ['GraphQL', 'GraphQL formatter', 'GraphQL validator', 'GraphQL query', 'GraphQL minify', 'GraphQL 포맷터', 'GraphQL 검증', 'GraphQL 압축'],
  openGraph: {
    title: 'GraphQL Query Formatter & Validator - Developer Tools',
    description: 'Format, validate, and minify GraphQL queries with this free online tool',
  },
}

export default function GraphQLPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <GraphQLTool />

      {/* Educational Content Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          What is GraphQL?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Why is it needed?
            </h3>
            <p className="leading-relaxed">
              GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.
              It provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need,
              and makes it easier to evolve APIs over time. Unlike REST APIs that require multiple endpoints, GraphQL allows you to fetch all needed data
              in a single request, reducing over-fetching and under-fetching of data.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              When to use this tool?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Format GraphQL Queries:</strong> Make your queries readable and properly indented for better understanding</li>
              <li><strong>Validate Syntax:</strong> Check if your GraphQL query has correct syntax before sending to the server</li>
              <li><strong>Minify for Production:</strong> Reduce query size by removing unnecessary whitespace for network optimization</li>
              <li><strong>Debug Complex Queries:</strong> Format nested queries and mutations to identify structural issues</li>
              <li><strong>Learn GraphQL:</strong> Study well-formatted examples to understand GraphQL syntax better</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Real-world Examples
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">Example 1: Query Formatting</p>
                <p className="text-xs mb-2">Before - Minified/Unreadable:</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto mb-2">
                  {`query{user(id:1){id name email posts{id title}}}`}
                </code>
                <p className="text-xs">↓ After Formatting</p>
                <pre className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded overflow-x-auto mt-2">
{`query {
  user(id: 1) {
    id
    name
    email
    posts {
      id
      title
    }
  }
}`}
                </pre>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">Example 2: Mutation with Variables</p>
                <pre className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded overflow-x-auto">
{`mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    content
    createdAt
    author {
      id
      name
    }
  }
}`}
                </pre>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">Example 3: Fragment Usage</p>
                <pre className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded overflow-x-auto">
{`fragment UserInfo on User {
  id
  name
  email
}

query GetUsers {
  users {
    ...UserInfo
    posts {
      id
      title
    }
  }
}`}
                </pre>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Common Mistakes to Avoid
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Missing Operation Type:</strong> Queries should start with <code className="bg-gray-200 dark:bg-gray-800 px-1">query</code>, <code className="bg-gray-200 dark:bg-gray-800 px-1">mutation</code>, or <code className="bg-gray-200 dark:bg-gray-800 px-1">subscription</code></li>
                <li><strong>Incorrect Brackets:</strong> GraphQL uses curly braces <code className="bg-gray-200 dark:bg-gray-800 px-1">{`{ }`}</code> for selection sets and parentheses <code className="bg-gray-200 dark:bg-gray-800 px-1">( )</code> for arguments</li>
                <li><strong>Quotes in Strings:</strong> GraphQL requires double quotes <code className="bg-gray-200 dark:bg-gray-800 px-1">"text"</code>, not single quotes</li>
                <li><strong>Variable Syntax:</strong> Variables must be prefixed with <code className="bg-gray-200 dark:bg-gray-800 px-1">$</code> and declared in operation definition</li>
                <li><strong>Trailing Commas:</strong> Unlike JSON, GraphQL does not require commas between fields</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              GraphQL vs REST API
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Feature</th>
                    <th className="px-4 py-2 text-left border-b">GraphQL</th>
                    <th className="px-4 py-2 text-left border-b">REST</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">Endpoints</td>
                    <td className="px-4 py-2 border-b">Single endpoint</td>
                    <td className="px-4 py-2 border-b">Multiple endpoints</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">Data Fetching</td>
                    <td className="px-4 py-2 border-b">Request exactly what you need</td>
                    <td className="px-4 py-2 border-b">Fixed data structure</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">Versioning</td>
                    <td className="px-4 py-2 border-b">No versioning needed</td>
                    <td className="px-4 py-2 border-b">v1, v2, etc.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Over-fetching</td>
                    <td className="px-4 py-2">No over-fetching</td>
                    <td className="px-4 py-2">Common issue</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Related Tools
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/json" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">📋 JSON Formatter</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Format and validate JSON data</p>
              </a>
              <a href="/jwt" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">🎫 JWT Decoder</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Decode and verify JWT tokens</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
