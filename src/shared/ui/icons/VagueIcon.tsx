interface IconProps {
  size?: number;
  className?: string;
}

export function VagueIcon({ size = 48, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M32 18.9231L30.8461 16.3334L28.2564 15.1795L30.8461 14.0257L32 11.4359L33.1538 14.0257L35.7436 15.1795L33.1538 16.3334L32 18.9231ZM32 36.5641L30.8461 33.9744L28.2564 32.8205L30.8461 31.6667L32 29.0769L33.1538 31.6667L35.7436 32.8205L33.1538 33.9744L32 36.5641ZM19.6923 31.4359L17.3846 26.3077L12.2563 24L17.3846 21.6923L19.6923 16.5641L22 21.6923L27.1282 24L22 26.3077L19.6923 31.4359ZM19.6923 28.2L21.0256 25.3334L23.8923 24L21.0256 22.6667L19.6923 19.8L18.3589 22.6667L15.4923 24L18.3589 25.3334L19.6923 28.2Z"
        fill="#9C27B0"
      />
    </svg>
  );
}
