interface IconProps {
  size?: number;
  className?: string;
}

export function PlayIcon({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width={size} height={size} rx={size / 2} fill="#111827" />
      <path d="M24 21L36 28L24 35V21Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}
