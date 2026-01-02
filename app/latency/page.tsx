import LatencyTesterTool from '@/components/LatencyTesterTool'

export default function LatencyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the latency tester inside the shared layout container. */}
      <LatencyTesterTool />
    </div>
  )
}
