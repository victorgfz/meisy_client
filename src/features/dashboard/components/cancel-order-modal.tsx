import { Modal } from './modal';
import { useCancelOrder } from '../hooks/use-cancel-order';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';
import { type Order } from '../types/orders.types';
import { ServerErrorMessages } from '../../../components/server-error-messages';

interface CancelOrderModalProps {
  isOpen: boolean;
  item: Order | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CancelOrderModal({ isOpen, item, onClose, onSuccess }: CancelOrderModalProps) {
  const { isLoading, serverErrors, handleCancel, resetError } = useCancelOrder(item, () => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    resetError();
    onClose();
  };

  const orderId = item?.id?.toString() || '';
  const confirmationMessage = ORDERS_CONSTANTS.form.cancelConfirmation.replace('{id}', orderId);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={ORDERS_CONSTANTS.form.cancelModalTitle}>
      <div className="flex flex-col gap-4">
        {serverErrors && <ServerErrorMessages message={serverErrors} />}
        <p className="text-text-primary text-md">
          {confirmationMessage}
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="button"
            className="w-full py-3.5 rounded-xl bg-red-600 text-white text-base font-bold tracking-wider cursor-pointer hover:bg-red-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md border-none"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? ORDERS_CONSTANTS.form.cancelingButton : ORDERS_CONSTANTS.form.cancelConfirmButton}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gray-200 text-gray-700 text-base font-bold tracking-wider cursor-pointer hover:bg-gray-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border-none"
          >
            {ORDERS_CONSTANTS.form.keepButton}
          </button>
        </div>
      </div>
    </Modal>
  );
}
