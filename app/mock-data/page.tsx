import type { Metadata } from 'next'
import MockDataTool from '@/components/MockDataTool'

export const metadata: Metadata = {
  title: 'Mock Data Generator - Generate Test Data',
  description: 'Generate realistic mock data for testing and development. Create fake names, emails, addresses, dates, and more in JSON, CSV, or SQL format.',
  keywords: ['mock data', 'fake data', 'test data', 'dummy data', 'data generator', 'faker', 'mock generator'],
}

export default function MockDataPage() {
  return <MockDataTool />
}
