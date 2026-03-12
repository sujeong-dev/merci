import { clsx } from 'clsx';

export interface QuizOptionButtonProps {
  index: number;
  label: string;
  state: 'default' | 'selected' | 'correct';
  disabled?: boolean;
  onClick?: () => void;
}

export const QuizOptionButton = ({
  index,
  label,
  state,
  disabled,
  onClick,
}: QuizOptionButtonProps) => {
  const getContainerStyles = () => {
    switch (state) {
      case 'correct':
        return 'bg-status-unfamiliar-bg border-2 border-status-unfamiliar';
      case 'selected':
        return 'bg-gray-100 border-2 border-gray-500';
      case 'default':
      default:
        return 'bg-transparent border border-gray-200';
    }
  };

  const getNumberStyles = () => {
    switch (state) {
      case 'correct':
        return 'bg-status-unfamiliar border-transparent text-white';
      case 'selected':
        return 'bg-gray-800 border-transparent text-white';
      case 'default':
      default:
        return 'bg-gray-100 border-transparent text-gray-500';
    }
  };

  const getLabelStyles = () => {
    switch (state) {
      case 'selected':
      case 'correct':
        return 'typography-body-lg-bold text-text-primary';
      case 'default':
      default:
        return 'typography-body-lg text-text-primary';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'w-full flex items-center p-5 rounded-lg text-left transition-colors',
        state !== 'default' ? 'p-[19px]' : '', // Border 1px vs 2px compensation (20px total)
        getContainerStyles()
      )}
    >
      <div
        className={clsx(
          'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold mr-3',
          getNumberStyles()
        )}
      >
        {index}
      </div>
      <span className={clsx('flex-1 break-keep', getLabelStyles())}>{label}</span>
    </button>
  );
};
