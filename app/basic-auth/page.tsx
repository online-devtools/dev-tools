import BasicAuthTool from '@/components/BasicAuthTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Basic Auth Generator - HTTP 기본 인증 생성',
  description: 'HTTP Basic Authentication 헤더를 생성합니다.',
  keywords: ['basic auth', 'http auth', 'authorization', '기본 인증'],
}

export default function BasicAuthPage() {
  return <BasicAuthTool />
}
