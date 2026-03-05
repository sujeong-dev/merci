'use client';

import Script from 'next/script';

/**
 * Kakao JavaScript SDK 로더
 *
 * Server Component인 layout.tsx에서 onLoad 이벤트 핸들러를 직접 사용할 수 없으므로
 * Client Component로 분리하여 SDK 로드 + 초기화를 처리합니다.
 */
export function KakaoSDK() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
        if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(kakaoKey);
        }
      }}
    />
  );
}
