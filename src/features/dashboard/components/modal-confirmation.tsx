import { type ReactNode } from 'react';
import { ServerErrorMessages } from '../../../components/server-error-messages';
import { Modal } from './modal';

type ModalConfirmationVariant = 'primary' | 'danger';

interface ModalConfirmationProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
  loadingLabel?: string;
  serverErrors?: string[] | null;
  variant?: ModalConfirmationVariant;
}

const confirmButtonVariants: Record<ModalConfirmationVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/80',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function ModalConfirmation({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  isLoading = false,
  loadingLabel,
  serverErrors,
  variant = 'primary',
}: ModalConfirmationProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        {serverErrors && <ServerErrorMessages message={serverErrors} />}

        <p className="text-text-primary text-md">
          {message}
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="button"
            className={`w-full py-3.5 rounded-xl text-base font-bold tracking-wider cursor-pointer active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md border-none ${confirmButtonVariants[variant]}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && loadingLabel ? loadingLabel : confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gray-200 text-gray-700 text-base font-bold tracking-wider cursor-pointer hover:bg-gray-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border-none"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
