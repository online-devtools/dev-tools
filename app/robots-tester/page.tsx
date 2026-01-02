import type { Metadata } from 'next'
import RobotsTesterTool from '@/components/RobotsTesterTool'

// Metadata is used for SEO and sharing previews.

export default function RobotsTesterPage() {
  // Render the tool component directly for the App Router page.
  return <RobotsTesterTool />
}
