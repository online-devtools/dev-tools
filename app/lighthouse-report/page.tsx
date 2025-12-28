import type { Metadata } from 'next'
import LighthouseReportTool from '@/components/LighthouseReportTool'

export const metadata: Metadata = {
  title: 'Lighthouse Report Analyzer',
  description: 'Analyze Lighthouse JSON reports and surface Core Web Vitals, scores, and opportunities.',
  keywords: ['lighthouse', 'core web vitals', 'performance report', 'web vitals'],
}

export default function LighthouseReportPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <LighthouseReportTool />
    </div>
  )
}
