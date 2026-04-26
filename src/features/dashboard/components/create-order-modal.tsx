
import { Modal } from '../components/modal';
import { CreateOrderForm } from './create-order-form';
import { useCreateOrder } from '../hooks/use-create-order';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
  const { form, isLoading, serverErrors, onSubmit, resetForm } = useCreateOrder(() => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={ORDERS_CONSTANTS.modal.createTitle}
    >
      <CreateOrderForm
        form={form}
        isLoading={isLoading}
        serverErrors={serverErrors}
        onSubmit={onSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}
