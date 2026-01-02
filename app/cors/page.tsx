import CorsTesterTool from '@/components/CorsTesterTool'

export default function CorsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the CORS tester inside the shared layout container. */}
      <CorsTesterTool />
    </div>
  )
}
