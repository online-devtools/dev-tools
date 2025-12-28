import StackTraceBeautifierTool from '@/components/StackTraceBeautifierTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Stack Trace Beautifier - Developer Tools',
    description: 'Parse and beautify Java, Python, and JavaScript stack traces. Syntax highlighting and framework code filtering.',
    keywords: ['stack trace', 'stacktrace', 'beautifier', 'java exception', 'python traceback', '스택 트레이스'],
    openGraph: {
        title: 'Stack Trace Beautifier - Developer Tools',
        description: 'Free online tool to beautify stack traces',
    },
}

export default function StackTracePage() {
    return <StackTraceBeautifierTool />
}
