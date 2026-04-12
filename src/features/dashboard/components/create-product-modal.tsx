import { Modal } from './modal';
import { CreateProductForm } from './create-product-form';
import { useCreateProduct } from '../hooks/use-create-product';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateProductModal({ isOpen, onClose, onSuccess }: CreateProductModalProps) {
  const { form, isLoading, serverErrors, onSubmit, resetForm } = useCreateProduct(() => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={PRODUCTS_CONSTANTS.form.modalTitle}>
      <CreateProductForm
        form={form}
        isLoading={isLoading}
        serverErrors={serverErrors}
        onSubmit={onSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}
