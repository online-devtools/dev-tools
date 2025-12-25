import type { Metadata } from 'next'
import SslCertAnalyzer from '@/components/SslCertAnalyzer'

export const metadata: Metadata = {
    title: 'SSL Certificate Analyzer - Parse and Inspect X.509 Certificates',
    description: 'Analyze SSL/TLS certificates. View expiration dates, issuer info, SAN, fingerprints and more. Free online X.509 certificate parser.',
    keywords: ['ssl', 'tls', 'certificate', 'x509', 'pem', 'analyzer', 'parser', 'expiration', 'fingerprint'],
}

export default function SslCertPage() {
    return <SslCertAnalyzer />
}
