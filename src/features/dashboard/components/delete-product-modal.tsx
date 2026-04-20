import { Modal } from './modal';
import { useDeleteProduct } from '../hooks/use-delete-product';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';
import { type Product } from '../types/products.types';
import { ServerErrorMessages } from '../../../components/server-error-messages';

interface DeleteProductModalProps {
  isOpen: boolean;
  item: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteProductModal({ isOpen, item, onClose, onSuccess }: DeleteProductModalProps) {
  const { isLoading, serverErrors, handleDelete, resetError } = useDeleteProduct(item, () => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    resetError();
    onClose();
  };

  const description = item?.description || '';
  const confirmationMessage = PRODUCTS_CONSTANTS.form.deleteConfirmation.replace('{description}', description);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={PRODUCTS_CONSTANTS.form.deleteModalTitle}>
      <div className="flex flex-col gap-4">
        {serverErrors && <ServerErrorMessages message={serverErrors} />}
        <p className="text-text-primary text-md">
          {confirmationMessage}
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="button"
            className="w-full py-3.5 rounded-xl bg-red-600 text-white text-base font-bold tracking-wider cursor-pointer hover:bg-red-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md border-none"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? PRODUCTS_CONSTANTS.form.deletingButton : PRODUCTS_CONSTANTS.form.deleteButton}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gray-200 text-gray-700 text-base font-bold tracking-wider cursor-pointer hover:bg-gray-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border-none"
          >
            {PRODUCTS_CONSTANTS.form.cancelButton}
          </button>
        </div>
      </div>
    </Modal>
  );
}
