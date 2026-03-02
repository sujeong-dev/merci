'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * 컨텍스트 메뉴 드롭다운 컴포넌트
 *
 * Figma 컴포넌트: Dropdown
 * - 96px wide, rounded-[10px], shadow(0px 4px 20px rgba(0,0,0,0.08))
 * - 각 항목: row, center, gap-2, px-4 py-2
 */
export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ items, trigger, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>

      {open && (
        <ul
          role="menu"
          className={cn(
            'absolute top-full z-50 mt-1 min-w-24 rounded-[10px] bg-bg-surface py-1',
            'shadow-[0px_4px_20px_rgba(0,0,0,0.08)]',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item, i) => (
            <li key={i} role="menuitem">
              <button
                type="button"
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-center gap-2 px-4 py-2 typography-body-sm transition-colors hover:bg-bg-muted',
                  item.danger ? 'text-status-danger' : 'text-text-secondary',
                )}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
