import CronParser from '@/components/CronParser'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cron 표현식 파서',
  description: 'Cron 표현식을 해석하고 다음 실행 시간을 계산합니다. 무료 온라인 Cron 파서 및 생성기입니다.',
  keywords: ['Cron', 'Cron 파서', 'Cron parser', 'Cron expression', 'Cron generator', 'crontab', 'schedule', '스케줄러'],
  openGraph: {
    title: 'Cron 표현식 파서 - Developer Tools',
    description: 'Cron 표현식을 해석하고 다음 실행 시간을 계산하는 무료 온라인 도구',
  },
}

export default function CronPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <CronParser />

      {/* 심화 콘텐츠 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Cron 표현식이란?
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              왜 필요한가요?
            </h3>
            <p className="leading-relaxed mb-3">
              Cron은 Unix 계열 시스템에서 작업을 주기적으로 실행하기 위한 스케줄러입니다.
              Cron 표현식은 5개 또는 6개의 필드로 구성되어 분, 시, 일, 월, 요일 등을 지정합니다.
            </p>
            <p className="leading-relaxed">
              예시: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm">0 2 * * *</code>는
              매일 새벽 2시에 실행됩니다. 복잡한 반복 일정을 간단한 문자열로 표현할 수 있어
              백업, 로그 정리, 보고서 생성 등 자동화에 필수적입니다.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              언제 사용하나요?
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>자동 백업:</strong> 매일 새벽 데이터베이스 백업 실행</li>
              <li><strong>로그 정리:</strong> 주 단위로 오래된 로그 파일 삭제</li>
              <li><strong>보고서 생성:</strong> 매월 1일 자동 리포트 생성 및 전송</li>
              <li><strong>캐시 정리:</strong> 매시간 만료된 캐시 데이터 삭제</li>
              <li><strong>헬스체크:</strong> 5분마다 서버 상태 모니터링</li>
              <li><strong>배치 작업:</strong> 대량 데이터 처리를 야간에 실행</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Cron 표현식 구조
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
              <code className="text-sm">
                * * * * * *<br />
                │ │ │ │ │ │<br />
                │ │ │ │ │ └─ 요일 (0-7, 0과 7은 일요일)<br />
                │ │ │ │ └─── 월 (1-12)<br />
                │ │ │ └───── 일 (1-31)<br />
                │ │ └─────── 시 (0-23)<br />
                │ └───────── 분 (0-59)<br />
                └─────────── 초 (0-59, 선택적)
              </code>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <p className="text-sm font-semibold mb-1">특수 문자</p>
                <ul className="text-xs space-y-1">
                  <li>• <code className="bg-gray-200 dark:bg-gray-800 px-1">*</code> : 모든 값 (every)</li>
                  <li>• <code className="bg-gray-200 dark:bg-gray-800 px-1">,</code> : 복수 값 (예: 1,3,5)</li>
                  <li>• <code className="bg-gray-200 dark:bg-gray-800 px-1">-</code> : 범위 (예: 1-5)</li>
                  <li>• <code className="bg-gray-200 dark:bg-gray-800 px-1">/</code> : 간격 (예: */5 = 5분마다)</li>
                  <li>• <code className="bg-gray-200 dark:bg-gray-800 px-1">?</code> : 무시 (일/요일 중 하나만 지정 시)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              자주 사용하는 Cron 표현식
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">표현식</th>
                    <th className="px-4 py-2 text-left border-b">설명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b"><code>* * * * *</code></td>
                    <td className="px-4 py-2 border-b">매분마다</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><code>*/5 * * * *</code></td>
                    <td className="px-4 py-2 border-b">5분마다</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><code>0 * * * *</code></td>
                    <td className="px-4 py-2 border-b">매시간 정각</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><code>0 0 * * *</code></td>
                    <td className="px-4 py-2 border-b">매일 자정</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><code>0 2 * * *</code></td>
                    <td className="px-4 py-2 border-b">매일 새벽 2시</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><code>0 0 * * 0</code></td>
                    <td className="px-4 py-2 border-b">매주 일요일 자정</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><code>0 0 1 * *</code></td>
                    <td className="px-4 py-2 border-b">매월 1일 자정</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><code>0 9-17 * * 1-5</code></td>
                    <td className="px-4 py-2 border-b">평일 9시~17시 매시간</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2"><code>0 0 1 1 *</code></td>
                    <td className="px-4 py-2">매년 1월 1일 자정</td>
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
                <p className="text-sm mb-2 font-semibold">예시 1: Linux crontab</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  # 매일 새벽 3시에 데이터베이스 백업<br />
                  0 3 * * * /usr/local/bin/backup.sh<br />
                  <br />
                  # 매주 일요일 자정에 로그 정리<br />
                  0 0 * * 0 /usr/local/bin/clean_logs.sh
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 2: Node.js (node-cron)</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`const cron = require('node-cron');

// 매 5분마다 실행
cron.schedule('*/5 * * * *', () => {
  console.log('Running task every 5 minutes');
});`}
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">예시 3: Spring Boot (@Scheduled)</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  {`@Scheduled(cron = "0 0 2 * * ?")
public void backupDatabase() {
    // 매일 새벽 2시 백업
}`}
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
                <li><strong>시간대:</strong> Cron은 서버의 시간대를 따릅니다. UTC와 로컬 시간 차이를 확인하세요.</li>
                <li><strong>중복 실행:</strong> 작업이 완료되기 전에 다음 실행 시간이 되면 중복 실행될 수 있습니다.</li>
                <li><strong>리소스 사용:</strong> 너무 짧은 간격은 시스템 부하를 일으킬 수 있습니다.</li>
                <li><strong>일/요일 혼용:</strong> 일과 요일을 동시에 지정하면 OR 조건으로 작동합니다.</li>
                <li><strong>초 필드:</strong> 표준 Cron은 5개 필드이지만, 일부 시스템(Quartz)은 6개 필드(초 포함)를 사용합니다.</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              더 알아보기
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/timestamp" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">⏱️ 타임스탬프 변환기</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">시간 계산 및 변환 도구</p>
              </a>
              <a href="/snippets" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">💻 코드 스니펫</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">언어별 Cron 사용 예제</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
