import type { Metadata } from 'next'
import DockerfileLinterTool from '@/components/DockerfileLinterTool'

export const metadata: Metadata = {
  title: 'Dockerfile Linter',
  description: 'Lint Dockerfiles for common issues and estimate base image sizes.',
  keywords: ['dockerfile', 'docker', 'linter', 'container'],
}

export default function DockerfileLinterPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <DockerfileLinterTool />
    </div>
  )
}
