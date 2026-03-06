interface IconProps {
  size?: number;
  className?: string;
}

export function DeleteIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2.625 14C2.14375 14 1.73177 13.8477 1.38906 13.5431C1.04635 13.2384 0.875 12.8722 0.875 12.4444V2.33333H0V0.777778H4.375V0H9.625V0.777778H14V2.33333H13.125V12.4444C13.125 12.8722 12.9536 13.2384 12.6109 13.5431C12.2682 13.8477 11.8562 14 11.375 14H2.625ZM11.375 2.33333H2.625V12.4444H11.375V2.33333ZM4.375 10.8889H6.125V3.88889H4.375V10.8889ZM7.875 10.8889H9.625V3.88889H7.875V10.8889Z" fill="#EF4444" />
    </svg>
  );
}
