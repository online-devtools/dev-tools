import ImageOptimizerTool from '@/components/ImageOptimizerTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Optimizer - 이미지 압축 및 최적화',
  description: '클라이언트 사이드에서 이미지를 압축하고 최적화합니다. WebP, JPEG, PNG 변환 지원. 서버 업로드 없이 프라이버시 보장.',
  keywords: ['이미지 압축', 'image compression', 'WebP', 'JPEG', 'PNG', '이미지 최적화', 'image optimizer'],
  openGraph: {
    title: 'Image Optimizer - Developer Tools',
    description: '클라이언트 사이드 이미지 압축 도구',
  },
}

export default function ImageOptimizerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ImageOptimizerTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          이미지 최적화 가이드
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 이미지 최적화가 중요한가요?
            </h3>
            <p className="leading-relaxed">
              웹사이트에서 이미지는 전체 페이지 용량의 50% 이상을 차지하는 경우가 많습니다.
              최적화되지 않은 이미지는 페이지 로딩 속도를 늦추고, 사용자 경험을 저해하며,
              Core Web Vitals 점수에 악영향을 줍니다. 적절한 이미지 최적화는 SEO와 성능 향상에 필수적입니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              포맷별 특징
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">포맷</th>
                    <th className="px-4 py-2 text-left border-b">장점</th>
                    <th className="px-4 py-2 text-left border-b">단점</th>
                    <th className="px-4 py-2 text-left border-b">사용 사례</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">WebP</td>
                    <td className="px-4 py-2 border-b">작은 파일 크기, 투명도 지원</td>
                    <td className="px-4 py-2 border-b">구형 브라우저 미지원</td>
                    <td className="px-4 py-2 border-b">대부분의 웹 이미지</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">JPEG</td>
                    <td className="px-4 py-2 border-b">높은 호환성, 사진에 적합</td>
                    <td className="px-4 py-2 border-b">투명도 미지원</td>
                    <td className="px-4 py-2 border-b">사진, 그라데이션</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">PNG</td>
                    <td className="px-4 py-2 border-b">투명도 지원, 무손실</td>
                    <td className="px-4 py-2 border-b">파일 크기가 큼</td>
                    <td className="px-4 py-2 border-b">로고, 아이콘, 스크린샷</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">AVIF</td>
                    <td className="px-4 py-2">가장 작은 크기</td>
                    <td className="px-4 py-2">브라우저 지원 제한</td>
                    <td className="px-4 py-2">최신 브라우저용 이미지</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              품질 설정 가이드
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-4">
                <span className="w-24 font-mono text-sm">90-100%</span>
                <span className="text-gray-600 dark:text-gray-400">원본과 거의 동일한 품질, 파일 크기 절감 적음</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-24 font-mono text-sm">75-90%</span>
                <span className="text-gray-600 dark:text-gray-400">권장 범위, 품질과 크기의 균형</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-24 font-mono text-sm">50-75%</span>
                <span className="text-gray-600 dark:text-gray-400">눈에 띄는 품질 저하, 썸네일에 적합</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-24 font-mono text-sm">50% 미만</span>
                <span className="text-gray-600 dark:text-gray-400">심한 품질 저하, 권장하지 않음</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              반응형 이미지 전략
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto">
{`<picture>
  <source
    srcset="image.avif"
    type="image/avif"
  />
  <source
    srcset="image.webp"
    type="image/webp"
  />
  <img
    src="image.jpg"
    alt="Description"
    loading="lazy"
    decoding="async"
  />
</picture>`}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              추천 크기
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>히어로 이미지:</strong> 1920px (데스크톱), 768px (태블릿), 390px (모바일)</li>
                <li><strong>블로그 썸네일:</strong> 400-600px</li>
                <li><strong>제품 이미지:</strong> 800-1200px</li>
                <li><strong>아바타:</strong> 200-400px</li>
                <li><strong>소셜 미디어:</strong> 1200×630px (OG Image)</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              관련 도구
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/svg-optimizer" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🎨 SVG 최적화</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">SVG 파일 크기 줄이기</p>
              </a>
              <a href="/base64-file" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">📁 Base64 파일</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">파일을 Base64로 변환</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
