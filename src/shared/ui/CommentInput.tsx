'use client';

import { cn } from '@/shared/lib/utils';
import { Button } from './Button';
import { CommentIcon } from './icons';

/**
 * 댓글 입력 컴포넌트
 *
 * Figma: 사진 상세 › 가족들의 반응 › 입력 영역 (node 19:507)
 * 레이아웃: row, items-center, gap:12px
 *   - 좌측: CommentIcon (32×32 원형, text-text-tertiary)
 *   - 중앙: 텍스트 입력창 (fill, body-sm, placeholder #C7C7CC)
 *   - 우측: 등록하기 버튼 (70px, variant="gray")
 *
 * @example
 * <CommentInput
 *   value={comment}
 *   onChange={setComment}
 *   onSubmit={handleSubmit}
 *   placeholder="어르신의 반응을 공유해주세요"
 * />
 */
interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  submitLabel?: string;
  className?: string;
}

export function CommentInput({
  value,
  onChange,
  onSubmit,
  placeholder = '댓글을 입력해주세요',
  submitLabel = '등록하기',
  className,
}: CommentInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      onSubmit();
    }
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <CommentIcon size={24} className="shrink-0 text-text-tertiary" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-1 typography-body-sm text-text-primary outline-none placeholder:text-text-placeholder"
      />

      <Button
        type="button"
        variant="gray"
        onClick={onSubmit}
        className="w-[70px] shrink-0 typography-body-xs py-2"
      >
        {submitLabel}
      </Button>
    </div>
  );
}
