import DeviceInfoTool from '@/components/DeviceInfoTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Device Information - 기기 정보',
  description: '현재 사용 중인 기기의 화면 크기, User Agent, 플랫폼 등의 정보를 확인합니다.',
  keywords: ['device info', 'screen size', 'user agent', '기기 정보'],
}

export default function DeviceInfoPage() {
  return <DeviceInfoTool />
}
