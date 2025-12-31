import BsonTool from '@/components/BsonTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BSON/MongoDB Extended JSON Converter',
  description: 'Convert between JSON and MongoDB Extended JSON format. Parse and generate ObjectIds, handle BSON data types.',
  keywords: ['BSON', 'MongoDB', 'Extended JSON', 'ObjectId', 'NoSQL', 'database', 'converter'],
  openGraph: {
    title: 'BSON Converter - Developer Tools',
    description: 'MongoDB BSON and Extended JSON conversion tool',
  },
}

export default function BsonPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <BsonTool />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          BSON & MongoDB Extended JSON Guide
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              What is BSON?
            </h3>
            <p className="leading-relaxed">
              BSON (Binary JSON) is a binary-encoded serialization of JSON-like documents.
              MongoDB uses BSON as its primary data storage and network transfer format.
              BSON supports additional data types not available in standard JSON.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Extended JSON Format
            </h3>
            <p className="leading-relaxed mb-4">
              MongoDB Extended JSON is a string format for representing BSON documents.
              It allows you to work with BSON types in a human-readable JSON format:
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2 font-mono text-sm">
              <div><span className="text-purple-600">ObjectId:</span> {`{"$oid": "507f1f77bcf86cd799439011"}`}</div>
              <div><span className="text-purple-600">Date:</span> {`{"$date": "2024-01-01T00:00:00Z"}`}</div>
              <div><span className="text-purple-600">Long:</span> {`{"$numberLong": "9223372036854775807"}`}</div>
              <div><span className="text-purple-600">Binary:</span> {`{"$binary": {"base64": "...", "subType": "00"}}`}</div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              ObjectId Structure
            </h3>
            <p className="leading-relaxed mb-4">
              A MongoDB ObjectId is a 12-byte identifier consisting of:
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="font-mono text-center text-lg mb-4">
                <span className="text-red-500">TTTTTTTT</span>
                <span className="text-green-500">MMMMMM</span>
                <span className="text-blue-500">PPPP</span>
                <span className="text-orange-500">CCCCCC</span>
              </div>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div><span className="text-red-500 font-semibold">T (8 chars):</span> Unix timestamp</div>
                <div><span className="text-green-500 font-semibold">M (6 chars):</span> Machine identifier</div>
                <div><span className="text-blue-500 font-semibold">P (4 chars):</span> Process ID</div>
                <div><span className="text-orange-500 font-semibold">C (6 chars):</span> Counter</div>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Related Tools
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/json" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">JSON Formatter</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Format and validate JSON</p>
              </a>
              <a href="/uuid" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">UUID Generator</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Generate UUIDs</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
