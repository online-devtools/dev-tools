import Base64Tool from '@/components/Base64Tool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base64 인코더/디코더',
  description: '텍스트를 Base64로 인코딩하거나 Base64 문자열을 디코딩합니다. UTF-8을 지원하는 무료 온라인 Base64 변환 도구입니다.',
  keywords: ['Base64', 'Base64 인코더', 'Base64 디코더', 'Base64 변환', 'base64 encode', 'base64 decode'],
  openGraph: {
    title: 'Base64 인코더/디코더 - Developer Tools',
    description: '텍스트를 Base64로 인코딩하거나 디코딩하는 무료 온라인 도구',
  },
}

export default function Base64Page() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Base64Tool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Base64 인코딩/디코딩이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              Base64는 바이너리 데이터를 텍스트 형식으로 변환하는 인코딩 방식입니다.
              이메일, JSON, XML 등 텍스트만 허용하는 시스템에서 이미지, 파일 등의 바이너리 데이터를
              안전하게 전송하기 위해 사용됩니다.
            </p>
            <p className="leading-relaxed">
              특히 웹 개발에서 이미지를 Data URL로 포함하거나, API 인증 헤더(Basic Auth),
              JWT 토큰 등에서 Base64 인코딩이 널리 사용됩니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>이미지 임베딩:</strong> HTML/CSS에서 작은 이미지를 Data URL로 직접 포함</li>
              <li><strong>API 인증:</strong> HTTP Basic Authentication 헤더 값 확인</li>
              <li><strong>데이터 전송:</strong> JSON API에서 바이너리 데이터를 텍스트로 변환하여 전송</li>
              <li><strong>디버깅:</strong> Base64로 인코딩된 데이터의 원본 내용 확인</li>
              <li><strong>URL 안전:</strong> 특수문자가 포함된 데이터를 URL에 안전하게 포함</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 1: HTTP Basic Authentication 헤더 확인</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  Authorization: Basic dXNlcjpwYXNzd29yZA==
                </code>
                <p className="text-sm mt-2">디코딩 결과: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">user:password</code></p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 2: 이미지를 Data URL로 변환</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...
                </code>
                <p className="text-sm mt-2">이미지 파일을 Base64로 인코딩하여 HTML/CSS에 직접 삽입 가능</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>보안 아님:</strong> Base64는 암호화가 아닌 인코딩입니다. 누구나 쉽게 디코딩할 수 있으므로 민감한 정보 보호에 사용하지 마세요.</li>
                <li><strong>크기 증가:</strong> Base64 인코딩 시 원본 데이터보다 약 33% 크기가 증가합니다.</li>
                <li><strong>UTF-8 지원:</strong> 한글 등 유니코드 문자는 UTF-8로 인코딩한 후 Base64 변환해야 정확합니다.</li>
                <li><strong>성능:</strong> 큰 파일을 Base64로 인코딩하면 브라우저 성능에 영향을 줄 수 있습니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Base64 vs 다른 인코딩
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b border-gray-200 dark:border-gray-700">방식</th>
                    <th className="px-4 py-2 text-left border-b border-gray-200 dark:border-gray-700">용도</th>
                    <th className="px-4 py-2 text-left border-b border-gray-200 dark:border-gray-700">특징</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">Base64</td>
                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">바이너리 → 텍스트</td>
                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">이메일, JSON에 적합</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">URL 인코딩</td>
                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">URL 파라미터</td>
                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">특수문자 이스케이프</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Hex</td>
                    <td className="px-4 py-2">16진수 표현</td>
                    <td className="px-4 py-2">Base64보다 2배 크기</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              더 알아보기
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/snippets" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">💻 코드 스니펫</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Node.js, Python, Go 등 언어별 Base64 구현 예제</p>
              </a>
              <a href="/url" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">🔗 URL 인코더</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">URL 파라미터 인코딩/디코딩 도구</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
