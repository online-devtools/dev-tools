import FeatureFlagTool from '@/components/FeatureFlagTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feature Flag Config Builder - 기능 플래그 설정 생성기',
  description: 'Feature Flag 설정 파일을 쉽게 생성합니다. JSON, LaunchDarkly, Unleash, 환경변수 형식 지원.',
  keywords: ['Feature Flag', 'Feature Toggle', 'LaunchDarkly', 'Unleash', '기능 플래그', 'A/B 테스트', 'rollout'],
  openGraph: {
    title: 'Feature Flag Config Builder - Developer Tools',
    description: 'Feature Flag 설정 파일 생성 도구',
  },
}

export default function FeatureFlagPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <FeatureFlagTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Feature Flag 가이드
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Feature Flag란?
            </h3>
            <p className="leading-relaxed">
              Feature Flag(기능 플래그)는 코드 배포 없이 애플리케이션의 기능을 켜고 끌 수 있게 해주는 기술입니다.
              이를 통해 점진적 롤아웃, A/B 테스트, 긴급 기능 비활성화 등이 가능합니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주요 사용 사례
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>점진적 롤아웃:</strong> 새 기능을 일부 사용자에게만 먼저 공개</li>
              <li><strong>A/B 테스트:</strong> 두 가지 버전의 기능을 비교 테스트</li>
              <li><strong>Kill Switch:</strong> 문제 발생 시 즉시 기능 비활성화</li>
              <li><strong>베타 테스트:</strong> 특정 사용자 그룹에게 먼저 공개</li>
              <li><strong>환경별 설정:</strong> 개발/스테이징/프로덕션 환경별 기능 관리</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              코드 예시
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
              <div>
                <p className="text-sm mb-2 font-semibold">React에서 Feature Flag 사용</p>
                <pre className="text-xs bg-gray-200 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`// Feature Flag 체크
const flags = useFeatureFlags()

function App() {
  return (
    <div>
      {flags.new_checkout_flow ? (
        <NewCheckout />
      ) : (
        <LegacyCheckout />
      )}
    </div>
  )
}`}
                </pre>
              </div>
              <div>
                <p className="text-sm mb-2 font-semibold">Node.js에서 Feature Flag 사용</p>
                <pre className="text-xs bg-gray-200 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`const flags = require('./feature-flags.json')

function handleRequest(req, res) {
  if (flags.new_api_v2.enabled) {
    return handleV2(req, res)
  }
  return handleV1(req, res)
}`}
                </pre>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              주요 Feature Flag 서비스
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">서비스</th>
                    <th className="px-4 py-2 text-left border-b">특징</th>
                    <th className="px-4 py-2 text-left border-b">가격</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">LaunchDarkly</td>
                    <td className="px-4 py-2 border-b">엔터프라이즈급, 강력한 타겟팅</td>
                    <td className="px-4 py-2 border-b">유료</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">Unleash</td>
                    <td className="px-4 py-2 border-b">오픈소스, 셀프호스팅 가능</td>
                    <td className="px-4 py-2 border-b">무료/유료</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-semibold">Flagsmith</td>
                    <td className="px-4 py-2 border-b">오픈소스, 원격 설정 지원</td>
                    <td className="px-4 py-2 border-b">무료/유료</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">ConfigCat</td>
                    <td className="px-4 py-2">간단한 설정, 무료 티어</td>
                    <td className="px-4 py-2">무료/유료</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              베스트 프랙티스
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>명확한 네이밍:</strong> 플래그 이름은 기능을 명확히 설명해야 함</li>
                <li><strong>기본값 설정:</strong> 서비스 장애 시에도 안전한 기본값 사용</li>
                <li><strong>정리 주기:</strong> 더 이상 필요 없는 플래그는 주기적으로 삭제</li>
                <li><strong>로깅:</strong> 플래그 평가 결과를 로그로 남겨 디버깅 용이하게</li>
                <li><strong>테스트:</strong> 플래그 on/off 모든 경우를 테스트</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              관련 도구
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/env-manager" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 환경변수 관리</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">.env 파일 편집 및 관리</p>
              </a>
              <a href="/json" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">📋 JSON 포맷터</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">JSON 설정 파일 검증</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
