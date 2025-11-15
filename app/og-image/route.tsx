import { ImageResponse } from 'next/server'

const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'
export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          backgroundImage:
            'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #38bdf8 100%)',
          color: '#f8fafc',
          fontFamily: 'Inter, Pretendard, system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            opacity: 0.9,
            fontSize: 28,
            letterSpacing: 6,
            textTransform: 'uppercase',
          }}
        >
          <span>Developer Tools</span>
          <span>15+ Utilities</span>
        </div>

        <div>
          <h1
            style={{
              fontSize: 84,
              margin: 0,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            개발자를 위한
            <br />
            필수 온라인 도구
          </h1>
          <p
            style={{
              marginTop: 32,
              fontSize: 32,
              opacity: 0.9,
            }}
          >
            Base64 · JSON · JWT · Regex · QR Code · Lorem Ipsum
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 26,
            opacity: 0.85,
          }}
        >
          <span>dev-tools.example.com</span>
          <span>빠르고 안전한 클라이언트 사이드 처리</span>
        </div>
      </div>
    ),
    size
  )
}
