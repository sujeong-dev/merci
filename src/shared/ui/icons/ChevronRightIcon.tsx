interface ChevronRightIconProps {
  /** 아이콘 높이(px). 너비는 viewBox 비율(8:12)에 따라 자동 결정됩니다. */
  size?: number;
  className?: string;
}

export function ChevronRightIcon({ size = 12, className }: ChevronRightIconProps) {
  // viewBox는 8×12 — 너비는 size * (8/12)
  const width = Math.round((size * 8) / 12);

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z"
        fill="currentColor"
      />
    </svg>
  );
}
