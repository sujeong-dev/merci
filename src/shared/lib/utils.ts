import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind 클래스 조합 헬퍼
 * clsx로 조건부 클래스를 처리하고, tailwind-merge로 충돌을 해소합니다.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary-navy text-text-on-dark')
 * cn('text-text-primary', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
