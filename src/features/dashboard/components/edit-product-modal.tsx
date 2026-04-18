import { Modal } from './modal';
import { EditProductForm } from './edit-product-form';
import { useEditProduct } from '../hooks/use-edit-product';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';
import { useProductDetail } from '../hooks/use-product-detail';
import { Loader2 } from 'lucide-react';

interface EditProductModalProps {
  isOpen: boolean;
  productId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProductModal({ isOpen, productId, onClose, onSuccess }: EditProductModalProps) {
  const { productDetail, isLoading: isLoadingDetail, error } = useProductDetail(isOpen ? productId : null);
  
  const { form, isLoading, serverErrors, onSubmit, resetForm } = useEditProduct(productDetail, () => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={PRODUCTS_CONSTANTS.form.editModalTitle}>
      {isLoadingDetail ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : (
        <EditProductForm
          form={form}
          isLoading={isLoading}
          serverErrors={serverErrors}
          onSubmit={onSubmit}
          onCancel={handleClose}
        />
      )}
    </Modal>
  );
}
