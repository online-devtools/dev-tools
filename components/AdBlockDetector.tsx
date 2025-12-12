'use client'

import { useState, useEffect } from 'react'

export default function AdBlockDetector() {
  const [adBlockDetected, setAdBlockDetected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const detectAdBlock = async () => {
      let detectionCount = 0
      const detectionThreshold = 2 // 3가지 중 2가지 이상 감지되면 차단

      try {
        // 방법 1: 베이트 요소 생성 (애드블락이 숨기는 클래스명 사용)
        const bait = document.createElement('div')
        bait.className = 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links adsbygoogle'
        bait.setAttribute('id', 'ad-banner')
        bait.style.cssText = 'width:1px !important;height:1px !important;position:absolute !important;left:-10000px !important;top:-1000px !important;'
        document.body.appendChild(bait)

        // 애드블락이 작동할 시간을 충분히 줌
        await new Promise(resolve => setTimeout(resolve, 300))

        // 요소가 숨겨졌는지 확인
        const computedStyle = window.getComputedStyle(bait)
        const isHidden =
          bait.offsetParent === null ||
          bait.offsetHeight === 0 ||
          bait.offsetWidth === 0 ||
          computedStyle.display === 'none' ||
          computedStyle.visibility === 'hidden' ||
          computedStyle.opacity === '0'

        document.body.removeChild(bait)

        if (isHidden) {
          detectionCount++
          console.log('[AdBlock] 베이트 요소가 차단되었습니다')
        }

        // 방법 2: 광고 스크립트 fetch 시도
        try {
          const response = await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
          })
          // no-cors 모드에서는 response가 opaque이므로 도달했다는 것만으로 차단되지 않았다고 판단
        } catch (error) {
          detectionCount++
          console.log('[AdBlock] 광고 스크립트 fetch가 차단되었습니다')
        }

        // 방법 3: Google AdSense 요소 검사
        const adsenseCheck = await new Promise<boolean>((resolve) => {
          const testAd = document.createElement('div')
          testAd.innerHTML = '&nbsp;'
          testAd.className = 'adsbygoogle'
          testAd.style.cssText = 'width:300px !important;height:250px !important;position:absolute !important;left:-10000px !important;top:-1000px !important;'
          testAd.setAttribute('data-ad-client', 'ca-pub-test')
          document.body.appendChild(testAd)

          setTimeout(() => {
            const isBlocked = testAd.offsetHeight === 0 || testAd.offsetWidth === 0
            document.body.removeChild(testAd)
            resolve(isBlocked)
          }, 300)
        })

        if (adsenseCheck) {
          detectionCount++
          console.log('[AdBlock] AdSense 요소가 차단되었습니다')
        }

        // 방법 4: 가짜 광고 파일 요청
        try {
          await fetch('/ads.js', { method: 'HEAD', cache: 'no-cache' }).catch(() => {
            // 파일이 없어도 요청이 가는지만 확인
          })
        } catch (error) {
          detectionCount++
          console.log('[AdBlock] 광고 파일 요청이 차단되었습니다')
        }

        console.log(`[AdBlock] 총 ${detectionCount}개 감지됨 (임계값: ${detectionThreshold})`)

        if (detectionCount >= detectionThreshold) {
          setAdBlockDetected(true)
        }

        setIsChecking(false)

      } catch (error) {
        console.error('AdBlock detection error:', error)
        // 에러 발생 시에도 감지되지 않았다고 가정
        setIsChecking(false)
      }
    }

    // 페이지 로드 후 감지 시작 (충분한 시간 확보)
    const timer = setTimeout(() => {
      detectAdBlock()
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // 확인 중이거나 애드블락이 감지되지 않으면 아무것도 표시하지 않음
  if (isChecking || !adBlockDetected) {
    return null
  }

  // 애드블락이 감지된 경우 전체 화면 오버레이 표시
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm">
      <div className="max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center">
          {/* 아이콘 */}
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* 제목 */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            애드블록이 감지되었습니다
          </h2>

          {/* 설명 */}
          <div className="space-y-4 text-gray-700 dark:text-gray-300 mb-8">
            <p className="text-lg">
              이 사이트는 무료로 제공되며, 광고 수익으로 운영됩니다.
            </p>
            <p className="text-base">
              계속 사용하시려면 <strong className="text-red-500">애드블록을 해제</strong>해 주세요.
            </p>
          </div>

          {/* 안내 사항 */}
          <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
              애드블록 해제 방법:
            </h3>
            <ol className="text-left text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span>브라우저의 확장 프로그램 아이콘을 클릭하세요</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span>애드블록 확장 프로그램을 찾으세요 (예: AdBlock, uBlock Origin)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span>이 사이트에서 애드블록을 비활성화하세요</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4.</span>
                <span>페이지를 새로고침하세요</span>
              </li>
            </ol>
          </div>

          {/* 새로고침 버튼 */}
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            애드블록 해제 후 새로고침
          </button>

          {/* 추가 안내 */}
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            이 사이트의 모든 도구는 클라이언트 사이드에서만 작동하며,<br />
            광고는 서비스 운영을 위한 최소한의 수익원입니다.
          </p>
        </div>
      </div>
    </div>
  )
}
