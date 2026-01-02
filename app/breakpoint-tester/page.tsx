import BreakpointTesterTool from '@/components/BreakpointTesterTool'

export default function BreakpointTesterPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Allow wider preview frames for large breakpoint lists. */}
      <BreakpointTesterTool />
    </div>
  )
}
