import CommitMessageTool from '@/components/CommitMessageTool'

export default function CommitMessagePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the commit message builder inside the shared layout container. */}
      <CommitMessageTool />
    </div>
  )
}
