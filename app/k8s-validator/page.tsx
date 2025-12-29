import type { Metadata } from 'next'
import K8sManifestTool from '@/components/K8sManifestTool'

export const metadata: Metadata = {
  title: 'Kubernetes Manifest Validator',
  description: 'Validate Kubernetes YAML manifests and flag common production gaps.',
  keywords: ['kubernetes', 'k8s', 'manifest validator', 'yaml'],
}

export default function K8sValidatorPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <K8sManifestTool />
    </div>
  )
}
