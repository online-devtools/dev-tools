import ProtobufTool from '@/components/ProtobufTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Protocol Buffers Decoder - Protobuf Viewer',
  description: 'Decode and inspect Protocol Buffers binary data. View field numbers, wire types, and values without a schema.',
  keywords: ['protobuf', 'protocol buffers', 'decoder', 'binary', 'grpc', 'serialization', 'viewer'],
  openGraph: {
    title: 'Protobuf Decoder - Developer Tools',
    description: 'Decode Protocol Buffers binary data',
  },
}

export default function ProtobufPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProtobufTool />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Protocol Buffers Guide
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              What is Protocol Buffers?
            </h3>
            <p className="leading-relaxed">
              Protocol Buffers (protobuf) is Google&apos;s language-neutral, platform-neutral
              extensible mechanism for serializing structured data. It&apos;s smaller, faster,
              and simpler than XML or JSON, commonly used with gRPC.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Wire Format
            </h3>
            <p className="mb-4">
              Protobuf uses a compact binary format. Each field is encoded as a tag (field number + wire type)
              followed by the value.
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm">
              <p className="mb-2">Tag = (field_number &lt;&lt; 3) | wire_type</p>
              <p>Example: Field 1, string type = (1 &lt;&lt; 3) | 2 = 0x0A</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Encoding Examples
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-purple-600 mb-2">Varint (int32, int64, bool)</p>
                <code className="text-sm">150 → 96 01 (0x9601)</code>
                <p className="text-xs text-gray-500 mt-1">Each byte uses 7 bits for data, MSB indicates continuation</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-blue-600 mb-2">String</p>
                <code className="text-sm">&quot;Hello&quot; → 0A 05 48 65 6C 6C 6F</code>
                <p className="text-xs text-gray-500 mt-1">Tag (0A) + Length (05) + UTF-8 bytes</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-green-600 mb-2">Signed Integer (ZigZag)</p>
                <code className="text-sm">-1 → 01, -2 → 03, 1 → 02, 2 → 04</code>
                <p className="text-xs text-gray-500 mt-1">ZigZag encoding: (n &lt;&lt; 1) ^ (n &gt;&gt; 31)</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Getting Protobuf Data
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm space-y-2">
              <p><span className="text-green-600"># Capture gRPC traffic with grpcurl</span></p>
              <p>grpcurl -plaintext -d &apos;{`{"id": 1}`}&apos; localhost:50051 myservice.MyMethod</p>
              <p></p>
              <p><span className="text-green-600"># Encode with protoc</span></p>
              <p>echo &apos;name: &quot;test&quot;&apos; | protoc --encode=MyMessage message.proto | xxd -p</p>
              <p></p>
              <p><span className="text-green-600"># Decode with protoc</span></p>
              <p>cat data.bin | protoc --decode_raw</p>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Related Tools
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/grpc-client" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">gRPC Client</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Build grpcurl commands</p>
              </a>
              <a href="/hex-viewer" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">Hex Viewer</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Analyze binary files</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
