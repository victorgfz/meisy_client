import { useEffect } from 'react';
import type { Overhead } from '../types/overheads.types';
import { OverheadType } from '../types/overheads.types';
import { OVERHEADS_CONSTANTS } from '../constants/overheads.constants';
import { Modal } from './modal';
import { useUpsertOverhead } from '../hooks/use-upsert-overhead';
import { OverheadForm } from './overhead-form';

interface OverheadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: number | null;
  overhead: Overhead | null;
}

export function OverheadModal({ isOpen, onClose, onSuccess, type, overhead }: OverheadModalProps) {
  const { form, isLoading, serverErrors, onSubmit, resetForm } = useUpsertOverhead(
    type,
    overhead,
    () => {
      onSuccess();
      onClose();
    }
  );

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      if (overhead) {
        // If there's an existing overhead, format it to real mask (string matching the R$ Input structure).
        let value = overhead.costPerHour.toFixed(2).replace('.', ',');
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        form.setValue('costPerHour', value);
      } else {
        form.setValue('costPerHour', '');
      }
    } else {
      resetForm();
    }
  }, [isOpen, overhead, form]);

  const getLabelForType = (t: number | null) => {
    switch (t) {
      case OverheadType.Electricity: return OVERHEADS_CONSTANTS.types.electricity;
      case OverheadType.Labor: return OVERHEADS_CONSTANTS.types.labor;
      case OverheadType.Gas: return OVERHEADS_CONSTANTS.types.gas;
      case OverheadType.Maintenance: return OVERHEADS_CONSTANTS.types.maintenance;
      default: return OVERHEADS_CONSTANTS.types.default;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`${overhead ? OVERHEADS_CONSTANTS.actions.edit : OVERHEADS_CONSTANTS.actions.add} ${getLabelForType(type)}`}
    >
      <OverheadForm
        form={form}
        isLoading={isLoading}
        serverErrors={serverErrors}
        type={type}
        onSubmit={onSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}
