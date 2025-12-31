import MessagePackTool from '@/components/MessagePackTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MessagePack Converter - JSON ↔ MessagePack 변환',
  description: 'JSON 데이터를 MessagePack 바이너리 포맷으로 변환하고, MessagePack을 다시 JSON으로 디코딩합니다. 압축률 비교 기능 제공.',
  keywords: ['MessagePack', 'msgpack', 'JSON', 'binary serialization', '직렬화', '바이너리', '압축'],
  openGraph: {
    title: 'MessagePack Converter - Developer Tools',
    description: 'JSON과 MessagePack 간 변환 도구. 데이터 압축률 확인 가능.',
  },
}

export default function MessagePackPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <MessagePackTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          MessagePack이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 MessagePack을 사용하나요?
            </h3>
            <p className="leading-relaxed">
              MessagePack은 JSON과 유사한 데이터 구조를 바이너리 형식으로 직렬화하는 포맷입니다.
              JSON보다 작은 크기와 빠른 직렬화/역직렬화 속도가 특징으로,
              네트워크 대역폭 절약과 성능 향상이 필요한 환경에서 많이 사용됩니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>실시간 통신:</strong> 게임 서버, 채팅 앱 등 지연 시간이 중요한 경우</li>
              <li><strong>마이크로서비스:</strong> 서비스 간 통신에서 페이로드 크기 최적화</li>
              <li><strong>캐시 저장:</strong> Redis 등 캐시에 데이터를 효율적으로 저장</li>
              <li><strong>로그 수집:</strong> 대량의 로그 데이터를 압축하여 전송</li>
              <li><strong>IoT 디바이스:</strong> 제한된 네트워크 환경에서 데이터 전송</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              JSON vs MessagePack
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">특성</th>
                    <th className="px-4 py-2 text-left border-b">JSON</th>
                    <th className="px-4 py-2 text-left border-b">MessagePack</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">포맷</td>
                    <td className="px-4 py-2 border-b">텍스트</td>
                    <td className="px-4 py-2 border-b">바이너리</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">가독성</td>
                    <td className="px-4 py-2 border-b">높음</td>
                    <td className="px-4 py-2 border-b">낮음 (디코딩 필요)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">크기</td>
                    <td className="px-4 py-2 border-b">큼</td>
                    <td className="px-4 py-2 border-b">작음 (10-30% 절감)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">파싱 속도</td>
                    <td className="px-4 py-2">보통</td>
                    <td className="px-4 py-2">빠름</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              코드 예시
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm mb-2 font-semibold">Node.js에서 MessagePack 사용</p>
              <pre className="text-xs bg-gray-200 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`import { encode, decode } from '@msgpack/msgpack'

// 인코딩
const data = { user: 'John', age: 30 }
const encoded = encode(data)  // Uint8Array

// 디코딩
const decoded = decode(encoded)
console.log(decoded)  // { user: 'John', age: 30 }`}
              </pre>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              관련 도구
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/json" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">📋 JSON 포맷터</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">JSON 데이터 포맷 및 검증</p>
              </a>
              <a href="/base64" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">🔤 Base64 인코더</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Base64 인코딩/디코딩</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
