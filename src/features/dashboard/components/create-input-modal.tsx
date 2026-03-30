import { Modal } from './modal';
import { CreateInputForm } from './create-input-form';
import { useCreateInput } from '../hooks/use-create-input';

interface CreateInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateInputModal({ isOpen, onClose, onSuccess }: CreateInputModalProps) {
  const { form, isLoading, serverErrors, onSubmit, resetForm } = useCreateInput(() => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cadastrar Insumo">
      <CreateInputForm
        form={form}
        isLoading={isLoading}
        serverErrors={serverErrors}
        onSubmit={onSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}
