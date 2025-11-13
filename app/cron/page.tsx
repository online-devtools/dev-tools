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
    <div className="max-w-4xl mx-auto">
      <CronParser />
    </div>
  )
}
