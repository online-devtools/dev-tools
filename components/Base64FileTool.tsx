'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import ToolSchemas from './ToolSchemas'

export default function Base64FileTool() {
  const [output, setOutput] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileType, setFileType] = useState('')
  const [base64Input, setBase64Input] = useState('')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setFileType(file.type)

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setOutput(base64)
    }
    reader.readAsDataURL(file)
  }

  const downloadFile = () => {
    try {
      const link = document.createElement('a')
      link.href = base64Input
      link.download = fileName || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      alert('파일 다운로드 중 오류가 발생했습니다.')
    }
  }

  return (
    <>
    <ToolSchemas toolKey="base64-file" toolPath="/base64-file" categoryKey="category.encoding" categoryType="encoding" />
    <ToolCard
      title="Base64 File Converter"
      description="파일을 Base64로 변환하거나 Base64를 파일로 변환합니다"
    >
      <div className="space-y-6">
        {/* File to Base64 */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">파일 → Base64</h3>

          <div>
            <label className="block w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-gray-600 dark:text-gray-400">
                <div className="text-4xl mb-2">📁</div>
                <div className="font-medium">파일 선택 또는 드래그 앤 드롭</div>
                <div className="text-sm mt-1">이미지, 문서, 모든 파일 지원</div>
              </div>
            </label>
          </div>

          {fileName && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>파일:</strong> {fileName} ({fileType || 'unknown'})
              </div>
            </div>
          )}

          <TextAreaWithCopy
            value={output}
            readOnly
            label="Base64 출력"
          />
        </div>

        {/* Base64 to File */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Base64 → 파일</h3>

          <TextAreaWithCopy
            value={base64Input}
            onChange={setBase64Input}
            label="Base64 입력"
            placeholder="data:image/png;base64,iVBORw0KGgo..."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              파일명
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="download.png"
            />
          </div>

          <button
            onClick={downloadFile}
            disabled={!base64Input}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            파일 다운로드
          </button>

          {base64Input && base64Input.startsWith('data:image') && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">미리보기</h4>
              <img src={base64Input} alt="Preview" className="max-w-full h-auto rounded-lg border border-gray-300 dark:border-gray-600" />
            </div>
          )}
        </div>
      </div>
    </ToolCard>
    </>
  )
}
