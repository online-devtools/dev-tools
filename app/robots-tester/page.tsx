import type { Metadata } from 'next'
import RobotsTesterTool from '@/components/RobotsTesterTool'

// Metadata is used for SEO and sharing previews.
export const metadata: Metadata = {
  title: 'Robots.txt Tester - Allow/Disallow Checker',
  description: 'Test robots.txt rules against paths and user-agents locally in your browser.',
  keywords: ['robots.txt', 'seo', 'crawler', 'tester', 'user-agent'],
}

export default function RobotsTesterPage() {
  // Render the tool component directly for the App Router page.
  return <RobotsTesterTool />
}
