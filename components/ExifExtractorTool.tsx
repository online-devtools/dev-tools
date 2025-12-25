'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ExifData {
    [key: string]: string | number | undefined
}

interface ImageMetadata {
    fileName: string
    fileSize: number
    fileType: string
    width?: number
    height?: number
    exif: ExifData
    gps?: {
        latitude?: number
        longitude?: number
        altitude?: number
    }
}

// Parse EXIF data from JPEG/TIFF files
function parseExifFromBuffer(buffer: ArrayBuffer): ExifData {
    const view = new DataView(buffer)
    const exif: ExifData = {}

    // Check for JPEG
    if (view.getUint16(0) !== 0xFFD8) {
        return exif
    }

    let offset = 2
    while (offset < view.byteLength) {
        const marker = view.getUint16(offset)
        offset += 2

        // APP1 marker (EXIF)
        if (marker === 0xFFE1) {
            const length = view.getUint16(offset)
            offset += 2

            // Check for "Exif\0\0"
            const exifHeader = String.fromCharCode(
                view.getUint8(offset),
                view.getUint8(offset + 1),
                view.getUint8(offset + 2),
                view.getUint8(offset + 3)
            )

            if (exifHeader === 'Exif') {
                const tiffOffset = offset + 6
                const littleEndian = view.getUint16(tiffOffset) === 0x4949

                const ifdOffset = view.getUint32(tiffOffset + 4, littleEndian)
                parseIFD(view, tiffOffset, tiffOffset + ifdOffset, littleEndian, exif)
            }

            break
        } else if ((marker & 0xFF00) !== 0xFF00) {
            break
        } else {
            const length = view.getUint16(offset)
            offset += length
        }
    }

    return exif
}

function parseIFD(view: DataView, tiffOffset: number, ifdOffset: number, littleEndian: boolean, exif: ExifData): void {
    const numEntries = view.getUint16(ifdOffset, littleEndian)

    const tagNames: Record<number, string> = {
        0x010F: 'Make',
        0x0110: 'Model',
        0x0112: 'Orientation',
        0x011A: 'XResolution',
        0x011B: 'YResolution',
        0x0128: 'ResolutionUnit',
        0x0131: 'Software',
        0x0132: 'DateTime',
        0x013B: 'Artist',
        0x0213: 'YCbCrPositioning',
        0x8298: 'Copyright',
        0x8769: 'ExifIFDPointer',
        0x8825: 'GPSInfoIFDPointer',
        0x9000: 'ExifVersion',
        0x9003: 'DateTimeOriginal',
        0x9004: 'DateTimeDigitized',
        0x920A: 'FocalLength',
        0x9286: 'UserComment',
        0xA000: 'FlashpixVersion',
        0xA001: 'ColorSpace',
        0xA002: 'PixelXDimension',
        0xA003: 'PixelYDimension',
        0xA300: 'FileSource',
        0xA301: 'SceneType',
        0xA401: 'CustomRendered',
        0xA402: 'ExposureMode',
        0xA403: 'WhiteBalance',
        0xA404: 'DigitalZoomRatio',
        0xA405: 'FocalLengthIn35mmFilm',
        0xA406: 'SceneCaptureType',
        0xA408: 'Contrast',
        0xA409: 'Saturation',
        0xA40A: 'Sharpness',
        0x829A: 'ExposureTime',
        0x829D: 'FNumber',
        0x8822: 'ExposureProgram',
        0x8827: 'ISOSpeedRatings',
        0x9201: 'ShutterSpeedValue',
        0x9202: 'ApertureValue',
        0x9203: 'BrightnessValue',
        0x9204: 'ExposureBiasValue',
        0x9205: 'MaxApertureValue',
        0x9207: 'MeteringMode',
        0x9208: 'LightSource',
        0x9209: 'Flash',
    }

    for (let i = 0; i < numEntries; i++) {
        const entryOffset = ifdOffset + 2 + i * 12
        const tag = view.getUint16(entryOffset, littleEndian)
        const type = view.getUint16(entryOffset + 2, littleEndian)
        const count = view.getUint32(entryOffset + 4, littleEndian)

        const tagName = tagNames[tag] || `Tag_0x${tag.toString(16).toUpperCase()}`

        let value: string | number | undefined

        // Type sizes: 1=BYTE, 2=ASCII, 3=SHORT, 4=LONG, 5=RATIONAL
        const typeSize = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8][type] || 1
        const totalSize = typeSize * count

        let valueOffset = entryOffset + 8
        if (totalSize > 4) {
            valueOffset = tiffOffset + view.getUint32(entryOffset + 8, littleEndian)
        }

        try {
            switch (type) {
                case 1: // BYTE
                    value = view.getUint8(valueOffset)
                    break
                case 2: // ASCII
                    {
                        const chars: string[] = []
                        for (let j = 0; j < count - 1 && valueOffset + j < view.byteLength; j++) {
                            const char = view.getUint8(valueOffset + j)
                            if (char === 0) break
                            chars.push(String.fromCharCode(char))
                        }
                        value = chars.join('')
                    }
                    break
                case 3: // SHORT
                    value = view.getUint16(valueOffset, littleEndian)
                    break
                case 4: // LONG
                    value = view.getUint32(valueOffset, littleEndian)
                    break
                case 5: // RATIONAL
                    {
                        const numerator = view.getUint32(valueOffset, littleEndian)
                        const denominator = view.getUint32(valueOffset + 4, littleEndian)
                        value = denominator !== 0 ? numerator / denominator : 0
                    }
                    break
                default:
                    value = undefined
            }

            if (value !== undefined) {
                exif[tagName] = value

                // Parse sub-IFDs
                if (tag === 0x8769 && typeof value === 'number') { // Exif IFD
                    parseIFD(view, tiffOffset, tiffOffset + value, littleEndian, exif)
                }
            }
        } catch {
            // Skip entries that can't be parsed
        }
    }
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

export default function ExifExtractorTool() {
    const { t } = useLanguage()
    const [metadata, setMetadata] = useState<ImageMetadata | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            setError(t('exif.error.notImage'))
            return
        }

        setIsLoading(true)
        setError('')
        setMetadata(null)
        setImagePreview(null)

        try {
            // Read file for EXIF
            const buffer = await file.arrayBuffer()
            const exif = parseExifFromBuffer(buffer)

            // Create image for dimensions
            const dataUrl = URL.createObjectURL(file)
            setImagePreview(dataUrl)

            const img = new Image()
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve()
                img.onerror = reject
                img.src = dataUrl
            })

            setMetadata({
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                width: img.naturalWidth,
                height: img.naturalHeight,
                exif,
            })
        } catch (err) {
            setError(t('exif.error.parseFailed') + ': ' + (err instanceof Error ? err.message : 'Unknown error'))
        } finally {
            setIsLoading(false)
        }
    }, [t])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file) {
            const input = document.createElement('input')
            input.type = 'file'
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(file)
            input.files = dataTransfer.files
            handleFileUpload({ target: input } as React.ChangeEvent<HTMLInputElement>)
        }
    }, [handleFileUpload])

    const groupExifData = (exif: ExifData) => {
        const groups: Record<string, Record<string, string | number>> = {
            camera: {},
            settings: {},
            datetime: {},
            image: {},
            other: {},
        }

        const cameraKeys = ['Make', 'Model', 'Software', 'Artist', 'Copyright']
        const settingsKeys = ['ExposureTime', 'FNumber', 'ISOSpeedRatings', 'FocalLength', 'FocalLengthIn35mmFilm', 'ExposureProgram', 'MeteringMode', 'Flash', 'WhiteBalance', 'ExposureMode']
        const datetimeKeys = ['DateTime', 'DateTimeOriginal', 'DateTimeDigitized']
        const imageKeys = ['PixelXDimension', 'PixelYDimension', 'Orientation', 'ColorSpace', 'XResolution', 'YResolution', 'ResolutionUnit']

        Object.entries(exif).forEach(([key, value]) => {
            if (value === undefined) return

            if (cameraKeys.includes(key)) {
                groups.camera[key] = value
            } else if (settingsKeys.includes(key)) {
                groups.settings[key] = value
            } else if (datetimeKeys.includes(key)) {
                groups.datetime[key] = value
            } else if (imageKeys.includes(key)) {
                groups.image[key] = value
            } else if (!key.startsWith('Tag_') && key !== 'ExifIFDPointer' && key !== 'GPSInfoIFDPointer') {
                groups.other[key] = value
            }
        })

        return groups
    }

    const formatExifValue = (key: string, value: string | number): string => {
        if (key === 'ExposureTime' && typeof value === 'number') {
            return value < 1 ? `1/${Math.round(1 / value)}s` : `${value}s`
        }
        if (key === 'FNumber' && typeof value === 'number') {
            return `f/${value.toFixed(1)}`
        }
        if (key === 'FocalLength' && typeof value === 'number') {
            return `${value.toFixed(1)}mm`
        }
        if (key === 'ISOSpeedRatings') {
            return `ISO ${value}`
        }
        return String(value)
    }

    const copyAllMetadata = () => {
        if (!metadata) return

        const text = JSON.stringify({
            file: {
                name: metadata.fileName,
                size: metadata.fileSize,
                type: metadata.fileType,
                dimensions: `${metadata.width}x${metadata.height}`,
            },
            exif: metadata.exif,
        }, null, 2)

        navigator.clipboard.writeText(text)
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                📷 {t('exif.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('exif.description')}
            </p>

            {/* Upload Section */}
            <div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed 
                        border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer 
                        hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">📁</span>
                        <span className="text-gray-600 dark:text-gray-400 text-center">
                            {t('exif.dropzone')}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            {t('exif.supportedFormats')}
                        </span>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </label>

                {isLoading && (
                    <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
                        {t('exif.loading')}
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Results Section */}
            {metadata && (
                <div className="space-y-4">
                    {/* Preview & Basic Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                📋 {t('exif.result.fileInfo')}
                            </h2>
                            <button
                                onClick={copyAllMetadata}
                                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                            >
                                {t('exif.copyAll')}
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            {imagePreview && (
                                <div className="shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-w-48 max-h-48 rounded-lg object-contain bg-gray-100 dark:bg-gray-700"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 flex-1">
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('exif.result.fileName')}</span>
                                    <p className="font-medium text-gray-800 dark:text-white truncate">{metadata.fileName}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('exif.result.fileSize')}</span>
                                    <p className="font-medium text-gray-800 dark:text-white">{formatFileSize(metadata.fileSize)}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('exif.result.dimensions')}</span>
                                    <p className="font-medium text-gray-800 dark:text-white">{metadata.width} × {metadata.height} px</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('exif.result.mimeType')}</span>
                                    <p className="font-medium text-gray-800 dark:text-white">{metadata.fileType}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EXIF Data */}
                    {Object.keys(metadata.exif).length > 0 ? (
                        <>
                            {Object.entries(groupExifData(metadata.exif)).map(([group, data]) => {
                                if (Object.keys(data).length === 0) return null

                                const groupNames: Record<string, string> = {
                                    camera: t('exif.group.camera'),
                                    settings: t('exif.group.settings'),
                                    datetime: t('exif.group.datetime'),
                                    image: t('exif.group.image'),
                                    other: t('exif.group.other'),
                                }

                                return (
                                    <div key={group} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                                            {groupNames[group]}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Object.entries(data).map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{key}</span>
                                                    <span className="font-mono text-sm text-gray-800 dark:text-white">
                                                        {formatExifValue(key, value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                            <p className="text-yellow-700 dark:text-yellow-400">
                                {t('exif.noExifData')}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                    💡 {t('exif.info.title')}
                </h3>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li>• {t('exif.info.item1')}</li>
                    <li>• {t('exif.info.item2')}</li>
                    <li>• {t('exif.info.item3')}</li>
                    <li>• {t('exif.info.item4')}</li>
                </ul>
            </div>
        </div>
    )
}
