import UserAgentTool from '@/components/UserAgentTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Agent Parser - User Agent 파싱',
  description: 'User Agent 문자열을 파싱하여 브라우저, OS, 기기 정보를 확인합니다.',
  keywords: ['user agent', 'parser', 'browser', 'os', 'device'],
}

export default function UserAgentPage() {
  return <UserAgentTool />
}
