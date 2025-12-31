import HexViewerTool from '@/components/HexViewerTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hex Viewer - 바이너리 파일 16진수 분석',
  description: '바이너리 파일을 16진수(Hex)로 표시하고 분석합니다. 파일 시그니처 감지, 바이트 검색 기능 제공.',
  keywords: ['Hex Viewer', '16진수', 'binary', '바이너리', 'hex editor', '파일 분석', 'file signature'],
  openGraph: {
    title: 'Hex Viewer - Developer Tools',
    description: '바이너리 파일 16진수 분석 도구',
  },
}

export default function HexViewerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <HexViewerTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Hex Viewer 가이드
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>파일 분석:</strong> 알 수 없는 파일의 형식 확인</li>
              <li><strong>디버깅:</strong> 바이너리 프로토콜이나 파일 형식 문제 해결</li>
              <li><strong>보안 분석:</strong> 악성코드나 의심스러운 파일 조사</li>
              <li><strong>데이터 복구:</strong> 손상된 파일에서 데이터 추출</li>
              <li><strong>학습:</strong> 파일 형식과 바이너리 구조 이해</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              파일 시그니처 (매직 바이트)
            </h3>
            <p className="leading-relaxed mb-4">
              대부분의 파일 형식은 고유한 &quot;매직 바이트&quot;로 시작합니다.
              이를 통해 파일 확장자와 관계없이 실제 파일 형식을 확인할 수 있습니다.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">형식</th>
                    <th className="px-4 py-2 text-left border-b">시그니처 (Hex)</th>
                    <th className="px-4 py-2 text-left border-b">ASCII</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr>
                    <td className="px-4 py-2 border-b">PDF</td>
                    <td className="px-4 py-2 border-b">25 50 44 46</td>
                    <td className="px-4 py-2 border-b">%PDF</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">PNG</td>
                    <td className="px-4 py-2 border-b">89 50 4E 47</td>
                    <td className="px-4 py-2 border-b">.PNG</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">JPEG</td>
                    <td className="px-4 py-2 border-b">FF D8 FF</td>
                    <td className="px-4 py-2 border-b">ÿØÿ</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">ZIP</td>
                    <td className="px-4 py-2 border-b">50 4B 03 04</td>
                    <td className="px-4 py-2 border-b">PK..</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">EXE</td>
                    <td className="px-4 py-2 border-b">4D 5A</td>
                    <td className="px-4 py-2 border-b">MZ</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">ELF (Linux)</td>
                    <td className="px-4 py-2">7F 45 4C 46</td>
                    <td className="px-4 py-2">.ELF</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              16진수 읽는 법
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
              <div>
                <p className="text-sm mb-2 font-semibold">기본 구조</p>
                <div className="font-mono text-xs bg-gray-200 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                  <p className="text-gray-500">오프셋     00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F    ASCII</p>
                  <p>00000000   48 65 6C 6C 6F 20 57 6F 72 6C 64 21 0D 0A 00 00    Hello World!....</p>
                </div>
              </div>
              <ul className="text-sm space-y-1">
                <li><strong>오프셋:</strong> 파일 시작부터의 바이트 위치 (16진수)</li>
                <li><strong>Hex 값:</strong> 각 바이트의 16진수 값 (00-FF)</li>
                <li><strong>ASCII:</strong> 출력 가능한 문자, 나머지는 점(.)으로 표시</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              명령줄 도구
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm font-semibold mb-1">Linux/Mac - xxd</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block">
                  xxd filename.bin | head -20
                </code>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Linux/Mac - hexdump</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block">
                  hexdump -C filename.bin | head -20
                </code>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              관련 도구
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/file-hash" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔐 파일 해시</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">파일의 MD5, SHA 해시 계산</p>
              </a>
              <a href="/base64-file" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">📁 Base64 파일</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">파일을 Base64로 인코딩</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
