import { cn } from '@/shared/lib/utils';

/**
 * 텍스트 인풋 컴포넌트
 *
 * Figma 패턴: label + input 조합
 * - label: typography-body-sm-bold, text-text-subtle, pl-1
 * - input: h-[60px], rounded-[10px], bg-input-white, px-6,
 *          shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)], typography-body-lg
 *
 * @example
 * // 라벨 포함
 * <Input id="name" label="어르신 성함" placeholder="성함을 입력해주세요" />
 *
 * // 라벨 없이 단독 사용
 * <Input id="code" placeholder="초대 코드 6자리" />
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 인풋 위에 표시할 라벨 텍스트 — 제공 시 label 요소가 함께 렌더링됩니다 */
  label?: string;
  /** 라벨 + 인풋 wrapper의 추가 className */
  wrapperClassName?: string;
}

export function Input({ label, id, className, wrapperClassName, ...props }: InputProps) {
  const input = (
    <input
      id={id}
      className={cn(
        'h-[60px] w-full rounded-[10px] bg-bg-input-white px-6 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] typography-body-lg text-text-primary outline-none placeholder:text-text-placeholder',
        className,
      )}
      {...props}
    />
  );

  if (!label) return input;

  return (
    <div className={cn('flex flex-col gap-3', wrapperClassName)}>
      <label htmlFor={id} className="typography-body-sm-bold pl-1 text-text-subtle">
        {label}
      </label>
      {input}
    </div>
  );
}
