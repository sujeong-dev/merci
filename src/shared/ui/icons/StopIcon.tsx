interface IconProps {
  size?: number;
  className?: string;
}

export function StopIcon({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M0 28C0 12.536 12.536 0 28 0V0C43.464 0 56 12.536 56 28V28C56 43.464 43.464 56 28 56V56C12.536 56 0 43.464 0 28V28Z" fill="#111827" />
      <path d="M21 21V28.6V31.8V35H35V28.6V21H21Z" fill="white" />
    </svg>
  );
}
