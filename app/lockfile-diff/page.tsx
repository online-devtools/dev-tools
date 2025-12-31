import LockfileDiffTool from '@/components/LockfileDiffTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lockfile Diff Analyzer - 패키지 변경사항 분석',
  description: 'package-lock.json, yarn.lock 파일의 변경사항을 분석합니다. 추가, 삭제, 업데이트된 패키지와 major/minor/patch 변경 표시.',
  keywords: ['package-lock.json', 'yarn.lock', 'npm', 'yarn', 'dependency', '의존성 분석', 'lockfile'],
  openGraph: {
    title: 'Lockfile Diff Analyzer - Developer Tools',
    description: '락파일 의존성 변경사항 분석 도구',
  },
}

export default function LockfileDiffPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <LockfileDiffTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Lockfile 분석 가이드
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Lockfile이란?
            </h3>
            <p className="leading-relaxed">
              Lockfile(package-lock.json, yarn.lock)은 프로젝트의 정확한 의존성 버전을 기록합니다.
              이를 통해 모든 개발자와 CI/CD 환경에서 동일한 패키지 버전을 사용할 수 있어
              &quot;내 컴퓨터에서는 되는데...&quot; 문제를 방지합니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 Lockfile 변경을 분석해야 하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>보안:</strong> 새로 추가되거나 업데이트된 패키지에 보안 취약점이 있을 수 있음</li>
              <li><strong>호환성:</strong> Major 버전 변경은 Breaking Change를 의미할 수 있음</li>
              <li><strong>디버깅:</strong> 문제 발생 시 어떤 패키지가 변경되었는지 파악</li>
              <li><strong>코드 리뷰:</strong> PR에서 의존성 변경사항 검토</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Semantic Versioning (SemVer)
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="font-mono text-center text-lg mb-4">MAJOR.MINOR.PATCH</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-4">
                  <span className="w-20 font-semibold text-purple-600">Major</span>
                  <span>호환되지 않는 API 변경 (Breaking Changes) - 주의 필요!</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-20 font-semibold text-blue-600">Minor</span>
                  <span>하위 호환되는 기능 추가</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-20 font-semibold text-gray-600">Patch</span>
                  <span>하위 호환되는 버그 수정</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Major 업데이트 체크리스트
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>해당 패키지의 CHANGELOG 또는 마이그레이션 가이드 확인</li>
                <li>Breaking Changes 목록 검토</li>
                <li>코드에서 deprecated API 사용 여부 확인</li>
                <li>테스트 스위트 실행하여 호환성 검증</li>
                <li>필요시 코드 수정 후 업데이트</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              유용한 명령어
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm font-semibold mb-1">npm outdated - 업데이트 가능한 패키지 확인</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block">
                  npm outdated
                </code>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">npm audit - 보안 취약점 확인</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block">
                  npm audit
                </code>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">npm ls - 의존성 트리 확인</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block">
                  npm ls --depth=0
                </code>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              관련 도구
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/dependency-checker" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">📊 의존성 검사</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">package.json 의존성 분석</p>
              </a>
              <a href="/semver" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">🔢 SemVer 계산기</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">버전 범위 계산 및 비교</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
