import { useId, useState, type ReactNode } from 'react';
import { Lightbulb } from 'lucide-react';

interface HelperMessageProps {
  message: ReactNode;
  triggerLabel?: string;
  ariaLabel?: string;
  defaultOpen?: boolean;
}

export function HelperMessage({
  message,
  triggerLabel,
  ariaLabel = 'Ver explicação',
  defaultOpen = false,
}: HelperMessageProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="flex max-w-full flex-col items-start gap-1.5">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-label={triggerLabel ? undefined : ariaLabel}
        title={triggerLabel ? undefined : ariaLabel}
        className="group inline-flex items-center gap-1.5 whitespace-nowrap border-none bg-transparent p-0 text-left text-xs font-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        {triggerLabel && <span>{triggerLabel}</span>}
        <span
          className={`flex p-1 items-center justify-center rounded-full transition-colors bg-gray-100 ${isOpen
            ? 'bg-primary/20 text-primary'
            : 'text-gray-500'
            }`}
        >
          <Lightbulb
            aria-hidden="true"
            className="shrink-0"
            size={14}
          />
        </span>

      </button>

      {isOpen && (
        <div
          id={contentId}
          role="note"
          className="max-w-sm border-l border-border py-0.5 pl-2.5 text-left text-xs font-normal leading-relaxed text-text-secondary animate-fade-in"
        >
          {message}
        </div>
      )}
    </div>
  );
}
