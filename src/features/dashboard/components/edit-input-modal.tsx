import { Modal } from './modal';
import { EditInputForm } from './edit-input-form';
import { useEditInput } from '../hooks/use-edit-input';
import { INPUTS_CONSTANTS } from '../constants/inputs.constants';
import { type Input } from '../types/inputs.types';

interface EditInputModalProps {
  isOpen: boolean;
  item: Input | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditInputModal({ isOpen, item, onClose, onSuccess }: EditInputModalProps) {
  const { form, isLoading, serverErrors, onSubmit, resetForm } = useEditInput(item, () => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={INPUTS_CONSTANTS.form.editModalTitle}>
      <EditInputForm
        form={form}
        isLoading={isLoading}
        serverErrors={serverErrors}
        onSubmit={onSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}
