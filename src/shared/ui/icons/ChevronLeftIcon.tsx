interface IconProps {
  size?: number;
  className?: string;
}

export function ChevronLeftIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.48649 14L3 7L9.48649 0L11 1.63333L6.02703 7L11 12.3667L9.48649 14Z" fill="currentColor" />
    </svg>
  );
}
