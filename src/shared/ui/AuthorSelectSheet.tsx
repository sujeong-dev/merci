'use client';

export interface AuthorOption {
  value: string;
  label: string;
}

interface AuthorSelectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  options: AuthorOption[];
  selectedAuthor: string;
  onSelect: (author: string) => void;
}

export function AuthorSelectSheet({
  isOpen,
  onClose,
  options,
  selectedAuthor,
  onSelect,
}: AuthorSelectSheetProps) {
  const handleSelect = (val: string) => {
    onSelect(val);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app rounded-t-[24px] bg-bg-surface px-6 pt-8 pb-10 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-6">
          <h2 className="typography-heading-sm font-bold text-text-primary">작성자 선택</h2>
          <button onClick={onClose} aria-label="닫기" className="text-text-tertiary p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-col pb-4">
        {options.map((option) => {
          const isSelected = selectedAuthor === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="flex w-full items-center justify-between py-4 text-left transition-opacity hover:opacity-70"
            >
              <span className={`typography-body-lg ${isSelected ? 'font-bold text-text-primary' : 'text-[#767676]'}`}>
                {option.label}
              </span>
            </button>
          );
        })}
        </div>
      </div>
    </>
  );
}
