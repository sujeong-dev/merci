interface ChevronRightIconProps {
  /** 아이콘 높이(px). 너비는 viewBox 비율(8:12)에 따라 자동 결정됩니다. */
  size?: number;
  className?: string;
}

export function ChevronRightIcon({ size = 12, className }: ChevronRightIconProps) {
  // viewBox는 8×12 — 너비는 size * (8/12)
  const width = Math.round((size * 8) / 12);

  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.51351 0L11 7L4.51351 14L3 12.3667L7.97297 7L3 1.63333L4.51351 0Z" fill="currentColor"/>
</svg>

  );
}
