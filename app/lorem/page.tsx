import LoremTool from '@/components/LoremTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lorem Ipsum 생성기',
  description: '더미 텍스트를 무료로 생성합니다. 문단, 문장, 단어 단위로 Lorem Ipsum을 생성할 수 있는 온라인 도구입니다.',
  keywords: ['Lorem Ipsum', '더미 텍스트', 'dummy text', 'placeholder text', 'lorem ipsum generator', 'text generator', 'filler text'],
  openGraph: {
    title: 'Lorem Ipsum 생성기 - Developer Tools',
    description: '더미 텍스트를 생성하는 무료 온라인 도구',
  },
}

export default function LoremPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <LoremTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Lorem Ipsum이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              Lorem Ipsum은 1500년대부터 사용된 가짜 텍스트(더미 텍스트)로, 디자인과 레이아웃을 테스트할 때
              실제 콘텐츠 대신 사용됩니다. 의미 없는 라틴어 기반 문장으로 구성되어 있어 디자인에 집중할 수 있습니다.
            </p>
            <p className="leading-relaxed">
              실제 의미 있는 텍스트를 사용하면 독자가 내용에 집중하여 디자인 평가가 어렵습니다.
              Lorem Ipsum은 실제 텍스트의 길이와 분포를 시뮬레이션하면서도 의미 없는 내용으로
              순수하게 시각적 요소만 평가할 수 있게 합니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>와이어프레임/목업:</strong> 디자인 초안에서 텍스트 영역 표시</li>
              <li><strong>웹사이트 개발:</strong> 프론트엔드 개발 시 임시 콘텐츠 배치</li>
              <li><strong>타이포그래피 테스트:</strong> 폰트, 크기, 줄 간격 등 시각적 요소 테스트</li>
              <li><strong>레이아웃 검증:</strong> 다양한 길이의 텍스트에서 레이아웃 동작 확인</li>
              <li><strong>클라이언트 프레젠테이션:</strong> 최종 콘텐츠 없이 디자인 시안 제시</li>
              <li><strong>인쇄물 디자인:</strong> 브로슈어, 포스터 등의 레이아웃 작업</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              역사와 유래
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm mb-3">Lorem Ipsum은 키케로(Cicero)의 작품 "de Finibus Bonorum et Malorum"(기원전 45년)에서 유래했습니다:</p>
              <blockquote className="text-xs italic border-l-4 border-gray-400 dark:border-gray-600 pl-4 mb-3">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              </blockquote>
              <p className="text-sm">1500년대 한 인쇄업자가 활자 견본을 만들 때 이 텍스트를 사용한 이래, 500년 넘게 업계 표준 더미 텍스트로 자리 잡았습니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              실무 사용 예시
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 1: HTML 프로토타입</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`<div class="card">
  <h2>Lorem Ipsum Dolor</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
     Sed do eiusmod tempor incididunt ut labore et dolore magna
     aliqua. Ut enim ad minim veniam.</p>
  <button>Read More</button>
</div>`}
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 2: 블로그 포스트 템플릿</p>
                <p className="text-xs mb-2">제목: Lorem Ipsum Dolor Sit Amet</p>
                <p className="text-xs mb-2">요약: Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                <p className="text-xs">본문: 5-6개 문단의 Lorem Ipsum 텍스트로 레이아웃 테스트</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주의사항
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>최종 제품 금지:</strong> Lorem Ipsum은 반드시 실제 콘텐츠로 교체해야 합니다. 런칭 전 확인 필수!</li>
                <li><strong>SEO 영향:</strong> 더미 텍스트는 검색 엔진 최적화에 도움이 되지 않습니다.</li>
                <li><strong>접근성:</strong> 스크린 리더 사용자에게 혼란을 줄 수 있으므로 개발 환경에서만 사용하세요.</li>
                <li><strong>클라이언트 오해:</strong> 클라이언트가 Lorem Ipsum을 실제 콘텐츠로 오해하지 않도록 명확히 설명하세요.</li>
                <li><strong>길이 조절:</strong> 실제 콘텐츠 길이에 맞춰 더미 텍스트 양을 조절하세요.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Lorem Ipsum 대안
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">종류</th>
                    <th className="px-4 py-2 text-left border-b">설명</th>
                    <th className="px-4 py-2 text-left border-b">용도</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">Lorem Ipsum</td>
                    <td className="px-4 py-2 border-b">고전적인 라틴어 더미 텍스트</td>
                    <td className="px-4 py-2 border-b">범용, 전문적</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">Bacon Ipsum</td>
                    <td className="px-4 py-2 border-b">고기 관련 유머러스한 텍스트</td>
                    <td className="px-4 py-2 border-b">캐주얼, 음식 사이트</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">Hipster Ipsum</td>
                    <td className="px-4 py-2 border-b">힙스터 용어 기반 텍스트</td>
                    <td className="px-4 py-2 border-b">트렌디한 디자인</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">실제 콘텐츠</td>
                    <td className="px-4 py-2">진짜 텍스트 사용</td>
                    <td className="px-4 py-2">가장 정확한 테스트</td>
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
              <a href="/html" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🌐 HTML 포맷터</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">HTML 템플릿 정리</p>
              </a>
              <a href="/case" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">📝 케이스 변환</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">텍스트 케이스 변환</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
