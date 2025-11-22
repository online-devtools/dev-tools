import HTMLTool from '@/components/HTMLTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTML/XML 포맷터',
  description: 'HTML과 XML 코드를 예쁘게 포맷하거나 압축합니다. 코드 가독성을 향상시키는 무료 온라인 HTML/XML 포맷터 도구입니다.',
  keywords: ['HTML 포맷터', 'XML 포맷터', 'HTML formatter', 'XML formatter', 'HTML beautifier', 'XML beautifier', 'code formatter'],
  openGraph: {
    title: 'HTML/XML 포맷터 - Developer Tools',
    description: 'HTML/XML을 포맷하는 무료 온라인 도구',
  },
}

export default function HTMLPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <HTMLTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          HTML/XML 포맷팅이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              HTML과 XML은 태그 기반 마크업 언어로, 사람이 읽기 어려운 한 줄 형태로 압축되거나
              들여쓰기가 엉망인 경우가 많습니다. 포맷터는 코드를 읽기 쉽게 정렬하고 들여쓰기를 바로잡아
              가독성을 크게 향상시킵니다.
            </p>
            <p className="leading-relaxed">
              반대로, 프로덕션 환경에서는 코드를 압축(minify)하여 공백과 줄바꿈을 제거함으로써
              파일 크기를 줄이고 네트워크 전송 속도를 높일 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>API 응답 확인:</strong> 웹 서비스에서 받은 XML/HTML 응답을 읽기 쉽게 포맷</li>
              <li><strong>코드 리뷰:</strong> 압축된 HTML을 펼쳐 구조 분석</li>
              <li><strong>디버깅:</strong> 브라우저 개발자 도구에서 복사한 HTML 정리</li>
              <li><strong>코드 정리:</strong> 일관된 들여쓰기로 프로젝트 코드 표준화</li>
              <li><strong>성능 최적화:</strong> 배포 전 HTML/XML 파일 압축으로 용량 감소</li>
              <li><strong>마이그레이션:</strong> 레거시 코드의 구조를 파악하기 위한 포맷팅</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">압축된 HTML → 포맷팅</p>
                <p className="text-xs mb-2">원본 (압축):</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto mb-2">
                  {`<div><h1>Title</h1><p>Content</p></div>`}
                </code>
                <p className="text-xs">포맷팅 후:</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto mt-2">
                  {`<div>
  <h1>Title</h1>
  <p>Content</p>
</div>`}
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">XML API 응답</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`<?xml version="1.0" encoding="UTF-8"?>
<response>
  <status>success</status>
  <data>
    <item id="1">
      <name>Product A</name>
      <price>29.99</price>
    </item>
  </data>
</response>`}
                </code>
                <p className="text-sm mt-2">계층 구조가 명확하게 보임</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>공백 민감:</strong> XML에서 태그 사이 공백은 의미가 있을 수 있으니 주의하세요.</li>
                <li><strong>주석 보존:</strong> 포맷팅 시 주석이 유지되는지 확인하세요.</li>
                <li><strong>자체 닫힘 태그:</strong> {`<br />와 <br>의 차이를 인식하세요 (XHTML vs HTML5).`}</li>
                <li><strong>인코딩:</strong> 특수문자가 HTML 엔티티(&amp;, &lt;, &gt;)로 올바르게 인코딩되었는지 확인하세요.</li>
                <li><strong>파일 크기:</strong> 매우 큰 파일은 브라우저에서 포맷팅 시 느려질 수 있습니다.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              HTML vs XML
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">특징</th>
                    <th className="px-4 py-2 text-left border-b">HTML</th>
                    <th className="px-4 py-2 text-left border-b">XML</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">목적</td>
                    <td className="px-4 py-2 border-b">웹 페이지 표시</td>
                    <td className="px-4 py-2 border-b">데이터 저장/전송</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">태그 규칙</td>
                    <td className="px-4 py-2 border-b">미리 정의됨</td>
                    <td className="px-4 py-2 border-b">사용자 정의 가능</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">엄격성</td>
                    <td className="px-4 py-2 border-b">유연함 (닫힘 태그 선택)</td>
                    <td className="px-4 py-2 border-b">엄격함 (반드시 닫아야 함)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">대소문자</td>
                    <td className="px-4 py-2">구분 안 함</td>
                    <td className="px-4 py-2">구분함</td>
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
              <a href="/json" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">📋 JSON 포맷터</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">JSON 포맷팅 및 검증</p>
              </a>
              <a href="/url" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">🔗 URL 인코더</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">URL 특수문자 인코딩</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
