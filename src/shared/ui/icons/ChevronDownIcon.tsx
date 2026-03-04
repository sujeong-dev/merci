interface IconProps {
  size?: number;
  className?: string;
}

export function ChevronDownIcon({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
<path d="M6 9.70005L0 3.70005L1.4 2.30005L6 6.90005L10.6 2.30005L12 3.70005L6 9.70005Z" fill="#8E8E8E"/>
</svg>
  );
}
