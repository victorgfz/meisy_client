import { useState } from 'react';
import { inputsService } from '../services/inputs.service';
import { INPUTS_CONSTANTS } from '../constants/inputs.constants';
import { type Input } from '../types/inputs.types';

export function useDeleteInput(item: Input | null, onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const handleDelete = async () => {
    if (!item) return;

    setIsLoading(true);
    setServerErrors(null);

    try {
      await inputsService.delete(item.id);
      onSuccess();
    } catch (error: any) {
      const messages = error?.response?.data?.errorMessages ?? [INPUTS_CONSTANTS.validation.deleteError];
      setServerErrors(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => setServerErrors(null);

  return {
    isLoading,
    serverErrors,
    handleDelete,
    resetError,
  };
}
