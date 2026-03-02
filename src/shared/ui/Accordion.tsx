'use client';

import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

/**
 * 아코디언 컴포넌트
 *
 * Figma 컴포넌트: Accordion (Property 1=open/closed)
 * - 행: row, space-between, py-3 (12px), bg-bg-base (#FAFAFA)
 * - 열림/닫힘 시 chevron 방향 전환
 */
interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('bg-bg-base', className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="typography-body-sm-bold text-text-primary">{title}</span>
        {open ? (
          <ChevronUpIcon className="text-text-tertiary" />
        ) : (
          <ChevronDownIcon className="text-text-tertiary" />
        )}
      </button>

      {open && (
        <div className="pb-3">
          {children}
        </div>
      )}
    </div>
  );
}
