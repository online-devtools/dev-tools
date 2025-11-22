import ColorTool from '@/components/ColorTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '컬러 변환기',
  description: 'HEX, RGB, HSL 색상 코드를 상호 변환합니다. 실시간 색상 프리뷰와 색상 피커를 제공하는 무료 온라인 컬러 변환 도구입니다.',
  keywords: ['컬러 변환기', 'color converter', 'HEX to RGB', 'RGB to HEX', 'HSL converter', '색상 변환', 'color picker'],
  openGraph: {
    title: '컬러 변환기 - Developer Tools',
    description: 'HEX, RGB, HSL 색상 코드를 변환하는 무료 도구',
  },
}

export default function ColorPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ColorTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          색상 코드 변환이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              웹 개발과 디자인에서 색상은 HEX, RGB, HSL 등 다양한 형식으로 표현됩니다.
              각 형식은 사용 목적과 장점이 다르며, 상황에 따라 적절한 형식으로 변환이 필요합니다.
            </p>
            <p className="leading-relaxed">
              예시: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm">#FF5733</code> (HEX) =
              <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm ml-2">rgb(255, 87, 51)</code> (RGB) =
              <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm ml-2">hsl(9, 100%, 60%)</code> (HSL)
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>CSS 작성:</strong> 디자이너가 제공한 HEX 코드를 RGB/HSL로 변환</li>
              <li><strong>브랜드 가이드:</strong> 브랜드 색상을 다양한 형식으로 문서화</li>
              <li><strong>색상 조정:</strong> HSL로 변환하여 명도/채도를 쉽게 조절</li>
              <li><strong>투명도 적용:</strong> RGB에 alpha 채널 추가 (rgba)</li>
              <li><strong>디자인 시스템:</strong> 일관된 색상 팔레트를 다양한 플랫폼에 적용</li>
              <li><strong>접근성:</strong> 대비율 계산을 위해 RGB 값 추출</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              색상 형식 비교
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">형식</th>
                    <th className="px-4 py-2 text-left border-b">예시</th>
                    <th className="px-4 py-2 text-left border-b">장점</th>
                    <th className="px-4 py-2 text-left border-b">용도</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">HEX</td>
                    <td className="px-4 py-2 border-b">#FF5733</td>
                    <td className="px-4 py-2 border-b">간결함</td>
                    <td className="px-4 py-2 border-b">HTML, CSS</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">RGB</td>
                    <td className="px-4 py-2 border-b">rgb(255, 87, 51)</td>
                    <td className="px-4 py-2 border-b">직관적</td>
                    <td className="px-4 py-2 border-b">CSS, 그래픽</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">RGBA</td>
                    <td className="px-4 py-2 border-b">rgba(255, 87, 51, 0.5)</td>
                    <td className="px-4 py-2 border-b">투명도</td>
                    <td className="px-4 py-2 border-b">CSS, 오버레이</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">HSL</td>
                    <td className="px-4 py-2">hsl(9, 100%, 60%)</td>
                    <td className="px-4 py-2">조정 쉬움</td>
                    <td className="px-4 py-2">테마, 색상 변형</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 1: 투명도가 필요한 배경</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`.overlay {
  /* HEX: #000000 → RGBA로 변환하여 투명도 추가 */
  background-color: rgba(0, 0, 0, 0.5);
}`}
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 2: 색상 변형 생성 (HSL 활용)</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`:root {
  --primary: hsl(210, 100%, 50%);       /* 기본 */
  --primary-dark: hsl(210, 100%, 40%);  /* 어둡게 */
  --primary-light: hsl(210, 100%, 70%); /* 밝게 */
}`}
                </code>
                <p className="text-sm mt-2">HSL의 L(명도) 값만 조정하여 쉽게 변형 생성</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 3: 디자인 시스템 문서화</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`브랜드 주 색상:
  HEX:  #4A90E2
  RGB:  rgb(74, 144, 226)
  HSL:  hsl(208, 73%, 59%)
  CMYK: C75 M36 Y0 K11`}
                </code>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>브라우저 호환성:</strong> 오래된 브라우저는 HSL을 지원하지 않을 수 있습니다.</li>
                <li><strong>색 공간:</strong> RGB는 sRGB 색 공간 기준이며, 디스플레이마다 실제 색상이 다를 수 있습니다.</li>
                <li><strong>반올림 오차:</strong> 변환 과정에서 소수점 반올림으로 인해 완벽히 동일하지 않을 수 있습니다.</li>
                <li><strong>접근성:</strong> 색상만으로 정보를 전달하지 말고, 텍스트나 아이콘을 함께 사용하세요.</li>
                <li><strong>대비율:</strong> WCAG 기준(4.5:1 이상)을 준수하여 가독성을 보장하세요.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              HSL의 장점
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm mb-3">HSL은 색상(Hue), 채도(Saturation), 명도(Lightness)로 구성되어 직관적인 색상 조정이 가능합니다:</p>
              <ul className="text-sm space-y-2">
                <li>• <strong>Hue (0-360°):</strong> 색상환의 각도 (0=빨강, 120=초록, 240=파랑)</li>
                <li>• <strong>Saturation (0-100%):</strong> 채도 (0%=회색, 100%=선명)</li>
                <li>• <strong>Lightness (0-100%):</strong> 명도 (0%=검정, 50%=순색, 100%=흰색)</li>
              </ul>
              <p className="text-sm mt-3">예: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">hsl(210, 50%, 50%)</code>에서
              L을 70%로 올리면 같은 색의 밝은 버전을 얻을 수 있습니다.</p>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              더 알아보기
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/html" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🌐 HTML 포맷터</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">HTML/CSS 코드 정리</p>
              </a>
              <a href="/snippets" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">💻 코드 스니펫</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">CSS 색상 사용 예제</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
