import type { Metadata } from 'next'
import GitignoreGeneratorTool from '@/components/GitignoreGeneratorTool'

export const metadata: Metadata = {
  title: '.gitignore Generator - Create gitignore Files Online',
  description: 'Generate .gitignore files for your project. Select from templates for Node.js, Python, Java, React, Next.js, and more.',
  keywords: ['gitignore generator', '.gitignore', 'git ignore', 'gitignore templates', 'create gitignore', 'ignore files'],
}

export default function GitignoreGeneratorPage() {
  return <GitignoreGeneratorTool />
}
