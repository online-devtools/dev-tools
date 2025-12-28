import TerraformLinterTool from '@/components/TerraformLinterTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terraform Linter - Developer Tools',
    description: 'Lint Terraform HCL files for security issues and best practices. Detect hardcoded secrets and wildcard permissions.',
    keywords: ['terraform', 'hcl', 'linter', 'iac', 'infrastructure as code', '테라폼 린터'],
    openGraph: {
        title: 'Terraform Linter - Developer Tools',
        description: 'Free online tool to lint Terraform files',
    },
}

export default function TerraformLinterPage() {
    return <TerraformLinterTool />
}
