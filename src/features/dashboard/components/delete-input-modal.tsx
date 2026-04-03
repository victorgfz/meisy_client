import { Modal } from './modal';
import { useDeleteInput } from '../hooks/use-delete-input';
import { INPUTS_CONSTANTS } from '../constants/inputs.constants';
import { type Input } from '../types/inputs.types';
import { ServerErrorMessages } from '../../../components/server-error-messages';

interface DeleteInputModalProps {
  isOpen: boolean;
  item: Input | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteInputModal({ isOpen, item, onClose, onSuccess }: DeleteInputModalProps) {
  const { isLoading, serverErrors, handleDelete, resetError } = useDeleteInput(item, () => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    resetError();
    onClose();
  };

  const description = item?.description || '';
  const confirmationMessage = INPUTS_CONSTANTS.form.deleteConfirmation.replace('{description}', description);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={INPUTS_CONSTANTS.form.deleteModalTitle}>
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
            {isLoading ? INPUTS_CONSTANTS.form.deletingButton : INPUTS_CONSTANTS.form.deleteButton}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gray-200 text-gray-700 text-base font-bold tracking-wider cursor-pointer hover:bg-gray-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border-none"
          >
            {INPUTS_CONSTANTS.form.cancelButton}
          </button>
        </div>
      </div>
    </Modal>
  );
}
