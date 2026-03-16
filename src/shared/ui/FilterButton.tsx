import { cn } from '@/shared/lib/utils';
import { ChevronDownIcon } from './icons';

interface FilterButtonProps {
  label: string;
  onClick: () => void;
  isSelected?: boolean;
  className?: string;
}

export function FilterButton({ 
  label, 
  onClick, 
  isSelected = false, 
  className 
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-4 py-2 transition-colors",
        isSelected 
          ? "border-primary-500 bg-primary-50 text-primary-600" 
          : "border-[#E5E7EB] bg-white text-text-primary hover:bg-[#F9FAFB]",
        className
      )}
    >
      <span className="typography-body-lg font-medium">{label}</span>
      <ChevronDownIcon size={16} />
    </button>
  );
}
