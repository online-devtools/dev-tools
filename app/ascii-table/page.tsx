import AsciiTableTool from '@/components/AsciiTableTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ASCII Table - Character Code Reference',
  description: 'Complete ASCII table with decimal, hexadecimal, octal, and binary values. Convert between text and ASCII codes.',
  keywords: ['ASCII', 'character codes', 'hex', 'decimal', 'binary', 'octal', 'encoding', 'reference table'],
  openGraph: {
    title: 'ASCII Table - Developer Tools',
    description: 'Complete ASCII character code reference',
  },
}

export default function AsciiTablePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <AsciiTableTool />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          ASCII Reference Guide
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              What is ASCII?
            </h3>
            <p className="leading-relaxed">
              ASCII (American Standard Code for Information Interchange) is a character encoding standard
              using 7 bits to represent 128 different characters. It includes control characters (0-31),
              printable characters (32-126), and a delete character (127).
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Character Categories
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="font-semibold text-red-600 mb-2">Control Characters (0-31)</p>
                <p className="text-sm">Non-printable characters for controlling devices and formatting.</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="font-semibold text-green-600 mb-2">Printable Characters (32-126)</p>
                <p className="text-sm">Letters, digits, punctuation, and symbols that can be displayed.</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="font-semibold text-blue-600 mb-2">Extended ASCII (128-255)</p>
                <p className="text-sm">Additional characters defined by various code pages.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Common Control Characters
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Dec</th>
                    <th className="px-4 py-2 text-left">Escape</th>
                    <th className="px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr><td className="px-4 py-2 font-mono">NUL</td><td className="px-4 py-2">0</td><td className="px-4 py-2 font-mono">\0</td><td className="px-4 py-2">Null character</td></tr>
                  <tr><td className="px-4 py-2 font-mono">TAB</td><td className="px-4 py-2">9</td><td className="px-4 py-2 font-mono">\t</td><td className="px-4 py-2">Horizontal tab</td></tr>
                  <tr><td className="px-4 py-2 font-mono">LF</td><td className="px-4 py-2">10</td><td className="px-4 py-2 font-mono">\n</td><td className="px-4 py-2">Line feed (Unix newline)</td></tr>
                  <tr><td className="px-4 py-2 font-mono">CR</td><td className="px-4 py-2">13</td><td className="px-4 py-2 font-mono">\r</td><td className="px-4 py-2">Carriage return</td></tr>
                  <tr><td className="px-4 py-2 font-mono">ESC</td><td className="px-4 py-2">27</td><td className="px-4 py-2 font-mono">\e</td><td className="px-4 py-2">Escape (ANSI sequences)</td></tr>
                  <tr><td className="px-4 py-2 font-mono">SPACE</td><td className="px-4 py-2">32</td><td className="px-4 py-2 font-mono">&nbsp;</td><td className="px-4 py-2">Space character</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Case Conversion Tip
            </h3>
            <p className="leading-relaxed mb-4">
              To convert between uppercase and lowercase letters, toggle bit 5 (add or subtract 32):
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm">
              <p>&apos;A&apos; (65) + 32 = &apos;a&apos; (97)</p>
              <p>&apos;a&apos; (97) - 32 = &apos;A&apos; (65)</p>
              <p>&apos;A&apos; XOR 0x20 = &apos;a&apos;</p>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Related Tools
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/text-binary" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Text to Binary</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Convert text to binary representation</p>
              </a>
              <a href="/hex-viewer" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">Hex Viewer</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">View binary files in hexadecimal</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
