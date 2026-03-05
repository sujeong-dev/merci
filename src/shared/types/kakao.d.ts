/* eslint-disable @typescript-eslint/no-namespace */

/**
 * Kakao JavaScript SDK 타입 선언
 * @see https://developers.kakao.com/docs/latest/ko/javascript/getting-started
 */
interface KakaoShareTextTemplate {
  objectType: 'text';
  text: string;
  link: {
    mobileWebUrl?: string;
    webUrl?: string;
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl?: string;
      webUrl?: string;
    };
  }>;
}

interface KakaoShareFeedTemplate {
  objectType: 'feed';
  content: {
    title: string;
    description?: string;
    imageUrl: string;
    link: {
      mobileWebUrl?: string;
      webUrl?: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl?: string;
      webUrl?: string;
    };
  }>;
}

type KakaoShareTemplate = KakaoShareTextTemplate | KakaoShareFeedTemplate;

interface KakaoShare {
  sendDefault(settings: KakaoShareTemplate): void;
}

interface KakaoStatic {
  init(appKey: string): void;
  isInitialized(): boolean;
  Share: KakaoShare;
}

declare global {
  interface Window {
    Kakao?: KakaoStatic;
  }
}

export {};
