import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Toast, type ToastVariant } from './toast';
import { ToastContext, type ShowToast } from './toast-context';

interface ToastProviderProps {
  children: ReactNode;
}

interface ActiveToast {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [activeToast, setActiveToast] = useState<ActiveToast | null>(null);

  const showToast = useCallback<ShowToast>(
    (message, variant = 'success', duration = 4000) => {
      setActiveToast({
        id: Date.now(),
        message,
        variant,
        duration,
      });
    },
    [],
  );

  const value = useMemo(() => showToast, [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {activeToast && (
        <Toast
          key={activeToast.id}
          message={activeToast.message}
          variant={activeToast.variant}
          duration={activeToast.duration}
          onClose={() => setActiveToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}
