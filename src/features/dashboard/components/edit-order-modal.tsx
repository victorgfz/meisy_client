import { Modal } from './modal';
import { EditOrderForm } from './edit-order-form';
import { useEditOrder } from '../hooks/use-edit-order';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';
import { type Order } from '../types/orders.types';

interface EditOrderModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditOrderModal({ isOpen, order, onClose, onSuccess }: EditOrderModalProps) {
  const { form, isLoading, serverErrors, onSubmit, resetForm } = useEditOrder(order, () => {
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
      title={ORDERS_CONSTANTS.form.editModalTitle}
    >
      <EditOrderForm
        form={form}
        isLoading={isLoading}
        serverErrors={serverErrors}
        onSubmit={onSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}
