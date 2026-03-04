interface IconProps {
  size?: number;
  className?: string;
}

export function PauseIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="5" y="4" width="4" height="16" rx="1" fill="currentColor" />
      <rect x="15" y="4" width="4" height="16" rx="1" fill="currentColor" />
    </svg>
  );
}
