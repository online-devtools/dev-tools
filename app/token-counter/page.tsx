import type { Metadata } from 'next'
import TokenCounterTool from '@/components/TokenCounterTool'

export const metadata: Metadata = {
  title: 'AI Token Counter - GPT & Claude Token Estimator',
  description: 'Count tokens and estimate costs for OpenAI GPT-4, GPT-3.5, and Anthropic Claude models. Free online AI token counter with pricing calculator.',
  keywords: ['token counter', 'GPT token calculator', 'Claude tokens', 'AI token estimator', 'OpenAI pricing', 'token cost calculator', 'GPT-4 tokens', 'prompt tokens'],
}

export default function TokenCounterPage() {
  return <TokenCounterTool />
}
