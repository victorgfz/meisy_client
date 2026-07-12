import { useEffect, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

type ToastVariant = 'success' | 'error';

interface ToastProps {
  message: ReactNode;
  variant?: ToastVariant;
  onClose: () => void;
  duration?: number;
}

const variants = {
  success: {
    icon: CheckCircle2,
    title: 'Sucesso',
    container: 'border-green-200 bg-green-50 text-green-900',
    iconColor: 'text-green-600',
    progress: 'bg-green-500',
  },
  error: {
    icon: AlertCircle,
    title: 'Erro',
    container: 'border-red-200 bg-red-50 text-red-900',
    iconColor: 'text-red-600',
    progress: 'bg-red-500',
  },
} satisfies Record<ToastVariant, object>;

export function Toast({
  message,
  variant = 'success',
  onClose,
  duration = 4000,
}: ToastProps) {
  const config = variants[variant];
  const Icon = config.icon;

  useEffect(() => {
    if (duration <= 0) return;

    const timeout = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timeout);
  }, [duration, onClose]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4 sm:inset-x-auto sm:right-5 sm:top-5 sm:w-full sm:max-w-sm sm:px-0"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <div
        role={variant === 'error' ? 'alert' : 'status'}
        className={`toast-enter pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 pr-11 shadow-lg ${config.container}`}
      >
        <Icon
          aria-hidden="true"
          className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconColor}`}
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{config.title}</p>
          <div className="mt-0.5 break-words text-sm leading-5 opacity-80">
            {message}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-2.5 top-2.5 rounded-lg p-1.5 opacity-60 transition hover:bg-black/5 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
          aria-label="Fechar notificação"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>

        {duration > 0 && (
          <span
            aria-hidden="true"
            className={`toast-progress absolute bottom-0 left-0 h-1 w-full origin-left ${config.progress}`}
            style={{ animationDuration: `${duration}ms` }}
          />
        )}
      </div>
    </div>
  );
}

export type { ToastProps, ToastVariant };
