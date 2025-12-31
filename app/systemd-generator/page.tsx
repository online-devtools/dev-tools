import SystemdGeneratorTool from '@/components/SystemdGeneratorTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Systemd Unit Generator - 서비스 파일 생성기',
  description: 'Linux systemd 서비스 유닛 파일(.service)을 쉽게 생성합니다. Node.js, Docker, Python 앱을 위한 템플릿 제공.',
  keywords: ['systemd', 'service', 'unit file', 'Linux', '서비스 관리', 'daemon', '데몬'],
  openGraph: {
    title: 'Systemd Unit Generator - Developer Tools',
    description: 'Linux systemd 서비스 파일 생성기',
  },
}

export default function SystemdGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SystemdGeneratorTool />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Systemd 서비스 관리 가이드
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Systemd란?
            </h3>
            <p className="leading-relaxed">
              Systemd는 대부분의 현대 Linux 배포판에서 사용되는 시스템 및 서비스 관리자입니다.
              부팅 프로세스를 관리하고, 시스템 서비스를 시작/중지/재시작하며,
              로그 수집 및 리소스 관리 등 다양한 기능을 제공합니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              기본 명령어
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded">systemctl start myapp</code>
                <span className="text-gray-600 dark:text-gray-400 p-2">서비스 시작</span>
                <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded">systemctl stop myapp</code>
                <span className="text-gray-600 dark:text-gray-400 p-2">서비스 중지</span>
                <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded">systemctl restart myapp</code>
                <span className="text-gray-600 dark:text-gray-400 p-2">서비스 재시작</span>
                <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded">systemctl status myapp</code>
                <span className="text-gray-600 dark:text-gray-400 p-2">상태 확인</span>
                <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded">systemctl enable myapp</code>
                <span className="text-gray-600 dark:text-gray-400 p-2">부팅 시 자동 시작</span>
                <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded">systemctl disable myapp</code>
                <span className="text-gray-600 dark:text-gray-400 p-2">자동 시작 해제</span>
                <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded">journalctl -u myapp</code>
                <span className="text-gray-600 dark:text-gray-400 p-2">로그 확인</span>
                <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded">journalctl -u myapp -f</code>
                <span className="text-gray-600 dark:text-gray-400 p-2">실시간 로그</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              서비스 타입 설명
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Type</th>
                    <th className="px-4 py-2 text-left border-b">설명</th>
                    <th className="px-4 py-2 text-left border-b">사용 예</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono">simple</td>
                    <td className="px-4 py-2 border-b">기본값. ExecStart 프로세스가 메인 프로세스</td>
                    <td className="px-4 py-2 border-b">Node.js, Python 앱</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono">forking</td>
                    <td className="px-4 py-2 border-b">데몬처럼 fork하는 프로세스</td>
                    <td className="px-4 py-2 border-b">Apache, Nginx (legacy)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono">oneshot</td>
                    <td className="px-4 py-2 border-b">한 번 실행 후 종료</td>
                    <td className="px-4 py-2 border-b">백업 스크립트, 마이그레이션</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono">notify</td>
                    <td className="px-4 py-2">sd_notify()로 준비 완료 알림</td>
                    <td className="px-4 py-2">PostgreSQL, systemd-aware 앱</td>
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
                <li><strong>전용 사용자 생성:</strong> 서비스는 root가 아닌 전용 사용자로 실행</li>
                <li><strong>환경변수 분리:</strong> 비밀값은 EnvironmentFile로 분리 관리</li>
                <li><strong>재시작 정책:</strong> on-failure 또는 always로 안정성 확보</li>
                <li><strong>타임아웃 설정:</strong> 긴 시작 시간이 필요하면 TimeoutStartSec 조정</li>
                <li><strong>로그 관리:</strong> journald 또는 rsyslog로 로그 저장 설정</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              관련 도구
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/dockerfile-linter" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">🐳 Dockerfile Linter</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Dockerfile 문법 검사</p>
              </a>
              <a href="/cron" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">⏰ Cron 표현식</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">스케줄 작업 설정</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
