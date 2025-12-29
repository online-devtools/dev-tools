import type { Metadata } from 'next'
import TimezoneConverterTool from '@/components/TimezoneConverterTool'

export const metadata: Metadata = {
  title: 'Timezone & Locale Converter',
  description: 'Convert date-times across multiple timezones quickly.',
  keywords: ['timezone', 'date', 'converter', 'locale'],
}

export default function TimezonePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <TimezoneConverterTool />
    </div>
  )
}
