import type { Metadata } from 'next'
import ExifExtractorTool from '@/components/ExifExtractorTool'

export const metadata: Metadata = {
    title: 'EXIF Metadata Extractor - View Image EXIF Data Online',
    description: 'Extract and view EXIF metadata from JPEG images. View camera info, exposure settings, date/time, and more. Free online image metadata viewer.',
    keywords: ['exif', 'metadata', 'image', 'jpeg', 'photo', 'camera', 'exposure', 'gps', 'extractor'],
}

export default function ExifExtractorPage() {
    return <ExifExtractorTool />
}
