import { cn } from '@/shared/lib/utils';

/**
 * 소셜 로그인 버튼 컴포넌트
 *
 * Figma 컴포넌트:
 * - kakao → Button/social-login-kakao : bg=#FEE500, rounded-lg, h-12
 * - naver → Button/social-login-naver : bg=#03A94D, rounded-lg, h-12, white text
 */

interface LogoProps {
  size?: number;
}

export function KakaoLogo({ size = 24 }: LogoProps) {
  /* 피그마 스펙: 24×24 */
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 2C5.582 2 2 4.925 2 8.527c0 2.26 1.5 4.247 3.768 5.382l-.962 3.594a.25.25 0 0 0 .378.272L9.572 15.1c.14.009.282.014.428.014 4.418 0 8-2.925 8-6.527S14.418 2 10 2z"
        fill="#3A1D1D"
      />
    </svg>
  );
}

export function NaverLogo({ size = 24 }: LogoProps) {
  /* 피그마 스펙: 18×18
   * N 경로 좌표가 (5.5~14.5) 범위이므로 viewBox를 타이트하게 조정해
   * 실제 N이 18px 영역을 충분히 채우도록 함 */
  return (
    <svg width={size} height={size} viewBox="3.5 3.5 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.37 10.279L8.51 5.5H5.5v9h3.13V9.721L11.49 14.5H14.5V5.5h-3.13v4.779z"
        fill="white"
      />
    </svg>
  );
}

const config = {
  kakao: {
    bg: 'bg-accent-kakao',
    Logo: KakaoLogo,
    label: '카카오로 계속하기',
    textColor: 'text-[#3A1D1D]',
  },
  naver: {
    bg: 'bg-accent-naver',
    Logo: NaverLogo,
    label: '네이버로 계속하기',
    textColor: 'text-text-on-dark',
  },
} as const;

interface SocialLoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'kakao' | 'naver';
  /** 버튼 텍스트. 미지정 시 variant별 기본 텍스트 사용 */
  children?: React.ReactNode;
  /**
   * 텍스트 타이포그래피 클래스 오버라이드
   * 기본값: 'typography-section-title'
   * @example textClassName="typography-body-sm"
   */
  textClassName?: string;
  /**
   * 로고 아이콘 크기 (px). 기본값: 24
   * @example logoSize={16}
   */
  logoSize?: number;
}

export function SocialLoginButton({
  variant,
  className,
  children,
  textClassName,
  logoSize,
  ...props
}: SocialLoginButtonProps) {
  const { bg, Logo, label, textColor } = config[variant];

  return (
    <button
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-lg transition-opacity cursor-pointer active:opacity-80 disabled:pointer-events-none disabled:opacity-40',
        bg,
        className,
      )}
      {...props}
    >
      <Logo size={logoSize} />
      <span className={cn(textClassName ?? 'typography-section-title', textColor)}>
        {children ?? label}
      </span>
    </button>
  );
}
