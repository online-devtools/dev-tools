import DockerComposeValidatorTool from '@/components/DockerComposeValidatorTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Docker Compose Validator - Developer Tools',
    description: 'Validate Docker Compose YAML files. Check for syntax errors, deprecated options, and visualize services.',
    keywords: ['docker', 'docker-compose', 'yaml', 'validate', 'docker compose validator', '도커 컴포즈'],
    openGraph: {
        title: 'Docker Compose Validator - Developer Tools',
        description: 'Free online tool to validate Docker Compose files',
    },
}

export default function DockerComposePage() {
    return <DockerComposeValidatorTool />
}
