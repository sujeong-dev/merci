'use client';

import { useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from './icons';

interface YearSelectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedYear: string;
  onSelect: (year: string) => void;
  showAllTime?: boolean;
}

export function YearSelectSheet({
  isOpen,
  onClose,
  selectedYear,
  onSelect,
  showAllTime = false,
}: YearSelectSheetProps) {
  const currentYear = new Date().getFullYear();
  
  // Calculate initial decade start based on selected year, or fallback to current year
  const initialDecadeStart = useMemo(() => {
    if (selectedYear) {
      const y = parseInt(selectedYear, 10);
      if (!isNaN(y)) return Math.floor(y / 10) * 10;
    }
    return Math.floor(currentYear / 10) * 10;
  }, [selectedYear, currentYear]);

  const [currentDecadeStart, setCurrentDecadeStart] = useState<number>(initialDecadeStart);

  const handleSelect = (val: string) => {
    onSelect(val);
    onClose();
  };

  const handlePrevDecade = () => {
    setCurrentDecadeStart((prev) => Math.max(1900, prev - 10));
  };

  const handleNextDecade = () => {
    setCurrentDecadeStart((prev) => Math.min(Math.floor(currentYear / 10) * 10, prev + 10));
  };

  const isPrevDisabled = currentDecadeStart <= 1900;
  const isNextDisabled = currentDecadeStart + 10 > currentYear;

  if (!isOpen) return null;

  // Generate the 12 cells for the 4x3 grid
  // 1 year from prev decade, 10 years for current decade, 1 year for next decade
  const gridCells = Array.from({ length: 12 }, (_, i) => currentDecadeStart - 1 + i);

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app rounded-t-[24px] bg-bg-surface px-6 pt-8 pb-10 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-6">
          <h2 className="typography-heading-sm font-bold text-text-primary">연도 선택</h2>
          <button onClick={onClose} aria-label="닫기" className="text-text-tertiary p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-col pb-2">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <button
              type="button"
              onClick={handlePrevDecade}
              disabled={isPrevDisabled}
              className={`p-2 transition-colors ${isPrevDisabled ? 'text-gray-300' : 'text-text-primary hover:bg-[#F3F4F6] rounded-full'}`}
              aria-label="이전 10년"
            >
              <ChevronLeftIcon size={20} className="text-text-tertiary" />
            </button>
            <span className="typography-body-lg font-bold text-text-primary">
              {currentDecadeStart}-{currentDecadeStart + 9}
            </span>
            <button
              type="button"
              onClick={handleNextDecade}
              disabled={isNextDisabled}
              className={`p-2 transition-colors ${isNextDisabled ? 'text-gray-300' : 'text-text-primary hover:bg-[#F3F4F6] rounded-full'}`}
              aria-label="다음 10년"
            >
              <ChevronRightIcon size={20} className="text-text-tertiary" />
            </button>
          </div>

          {/* Year Grid */}
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {gridCells.map((y, index) => {
              // User constraints: if year > currentYear, show an empty dummy slot
              if (y > currentYear) {
                return <div key={`empty-${index}`} className="h-12" />;
              }

              const isSelected = selectedYear === String(y);
              const isCurrentDecade = y >= currentDecadeStart && y <= currentDecadeStart + 9;

              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => handleSelect(String(y))}
                  className={`flex h-12 items-center justify-center rounded-[8px] typography-body-lg transition-colors ${
                    isSelected
                      ? 'bg-text-primary text-white font-bold'
                      : isCurrentDecade
                      ? 'bg-transparent text-text-primary hover:bg-[#F3F4F6]'
                      : 'bg-transparent text-text-primary hover:bg-[#F3F4F6]' // Grayed out for prev/next padding
                  }`}
                >
                  {y}
                </button>
              );
            })}
          </div>

          {/* 전체 기간 보기 버튼 (선택적 표시) */}
          {showAllTime && (
            <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => handleSelect('')}
                className={`flex w-full items-center justify-center py-4 rounded-xl typography-body-lg transition-colors ${
                  selectedYear === ''
                    ? 'bg-text-primary text-white font-bold'
                    : 'bg-[#F3F4F6] text-text-primary hover:bg-[#E5E7EB]'
                }`}
              >
                전체 기간 보기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
