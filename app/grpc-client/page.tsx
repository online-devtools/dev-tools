import type { Metadata } from 'next'
import GrpcClientTool from '@/components/GrpcClientTool'

export const metadata: Metadata = {
  title: 'gRPC Client Helper',
  description: 'Build grpcurl commands, inspect responses, and validate gRPC metadata quickly.',
  keywords: ['grpc', 'grpcurl', 'protobuf', 'api testing'],
}

export default function GrpcClientPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <GrpcClientTool />
    </div>
  )
}
