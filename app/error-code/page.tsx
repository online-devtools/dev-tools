import ErrorCodeLookupTool from '@/components/ErrorCodeLookupTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Error Code Lookup - Developer Tools',
    description: 'Search HTTP, PostgreSQL, and MySQL error codes. Get descriptions, solutions, and quick fixes.',
    keywords: ['error code', 'http status', 'postgresql error', 'mysql error', '에러 코드', 'status code'],
    openGraph: {
        title: 'Error Code Lookup - Developer Tools',
        description: 'Free online tool to lookup error codes',
    },
}

export default function ErrorCodePage() {
    return <ErrorCodeLookupTool />
}
