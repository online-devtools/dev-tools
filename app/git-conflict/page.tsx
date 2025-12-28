import GitConflictResolverTool from '@/components/GitConflictResolverTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Git Conflict Resolver - Developer Tools',
    description: 'Visualize and resolve Git merge conflicts easily. Parse conflict markers and choose resolutions for each block.',
    keywords: ['git', 'merge conflict', 'git conflict', 'conflict resolver', '충돌 해결', 'merge tool'],
    openGraph: {
        title: 'Git Conflict Resolver - Developer Tools',
        description: 'Free online tool to visualize and resolve Git merge conflicts',
    },
}

export default function GitConflictPage() {
    return <GitConflictResolverTool />
}
