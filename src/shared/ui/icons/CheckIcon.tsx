interface IconProps {
  size?: number;
  className?: string;
}

/**
 * 체크 아이콘
 *
 * Figma: Icon ComponentSet › Property 1=selected (node 157:762 기반)
 * - viewBox: 0 0 24 24 (정방형, CopyIcon과 동일 사이즈 체계)
 * - stroke 스타일: strokeWidth=1.5, round linecap/join
 *
 * 사용 예:
 * - size=12 (기본): PhotoReaction 배지 체크  → 12×12 SVG
 * - size=24       : 복사 완료 인디케이터 교체 → 24×24 SVG (CopyIcon과 동일 크기)
 */
export function CheckIcon({ size = 12, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 12L9 21L22 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
