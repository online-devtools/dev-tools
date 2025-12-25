import type { Metadata } from 'next'
import WebSocketTester from '@/components/WebSocketTester'

export const metadata: Metadata = {
    title: 'WebSocket Tester - Real-time WebSocket Connection Testing Tool',
    description: 'Test WebSocket connections in real-time. Connect to ws:// or wss:// servers, send messages, and view responses. Free online WebSocket debugging tool.',
    keywords: ['websocket', 'websocket tester', 'ws', 'wss', 'realtime', 'socket', 'web socket', 'debugging'],
}

export default function WebSocketPage() {
    return <WebSocketTester />
}
