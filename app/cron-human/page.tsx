import CronHumanTool from '@/components/CronHumanTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cron to Human',
  description: 'Convert cron expressions to human-readable text and next run times.',
}

export default function CronHumanPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <CronHumanTool />
    </div>
  )
}
