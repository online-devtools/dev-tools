import type { Metadata } from 'next'
import ApiScenarioTool from '@/components/ApiScenarioTool'

export const metadata: Metadata = {
  title: 'API Scenario Runner',
  description: 'Replay multi-step API scenarios against two environments and compare responses side by side.',
  keywords: ['api scenario', 'regression testing', 'api replay', 'response diff'],
}

export default function ApiScenarioPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <ApiScenarioTool />
    </div>
  )
}
