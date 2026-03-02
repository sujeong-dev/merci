'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

/**
 * 셀렉트 드롭다운 컴포넌트
 *
 * Figma 컴포넌트: Select (Property 1=Select / Select Options)
 * - 트리거: hug content, body-sm 텍스트
 * - 드롭다운: 176px wide, border-border-default, rounded-input(12px), shadow-lg, py-2
 */
export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Select({ options, value, placeholder = '선택하세요', onChange, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function handleSelect(opt: SelectOption) {
    onChange?.(opt.value);
    setOpen(false);
  }

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      {/* 트리거 */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 typography-body-sm text-text-primary"
      >
        <span>{selected?.label ?? placeholder}</span>
        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>

      {/* 드롭다운 패널 */}
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 w-44 rounded-input border border-border-default bg-bg-surface py-2 shadow-lg"
        >
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={opt.value === value}>
              <button
                type="button"
                onClick={() => handleSelect(opt)}
                className={cn(
                  'flex w-full items-center gap-2 px-4 py-2 typography-body-sm transition-colors hover:bg-bg-muted',
                  opt.value === value ? 'text-text-primary font-semibold' : 'text-text-secondary',
                )}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
