import PackageJsonMergeTool from '@/components/PackageJsonMergeTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Package.json Merge Tool - Developer Tools',
    description: 'Merge two package.json files with conflict detection. Choose merge strategies for version conflicts.',
    keywords: ['package.json', 'npm', 'merge', 'dependencies', 'package merge', '패키지 병합'],
    openGraph: {
        title: 'Package.json Merge Tool - Developer Tools',
        description: 'Free online tool to merge package.json files',
    },
}

export default function PackageMergePage() {
    return <PackageJsonMergeTool />
}
