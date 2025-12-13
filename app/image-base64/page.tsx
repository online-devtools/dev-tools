import type { Metadata } from 'next'
import ImageBase64Tool from '@/components/ImageBase64Tool'

export const metadata: Metadata = {
  title: 'Image to Base64 Converter - Encode Images Online',
  description: 'Convert images to Base64 encoded strings with drag-and-drop support. Free online image to Base64 converter supporting PNG, JPG, GIF, WebP and more.',
  keywords: ['image to base64', 'base64 encoder', 'image encoder', 'data url', 'base64 converter', 'online image encoder'],
}

export default function ImageBase64Page() {
  return <ImageBase64Tool />
}
