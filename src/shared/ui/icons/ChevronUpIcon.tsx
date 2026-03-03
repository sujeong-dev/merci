interface IconProps {
  size?: number;
  className?: string;
}

export function ChevronUpIcon({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
<path d="M1.4 9.70005L0 8.30005L6 2.30005L12 8.30005L10.6 9.70005L6 5.10005L1.4 9.70005Z" fill="#8E8E8E"/>
</svg>

  );
}
