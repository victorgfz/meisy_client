import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { overheadsService } from '../services/overheads.service';
import type { Overhead } from '../types/overheads.types';
import { OVERHEADS_CONSTANTS } from '../constants/overheads.constants';
import { getDateCorrected } from '../../../lib/date-corrected';

const { validation } = OVERHEADS_CONSTANTS;

const upsertOverheadSchema = z.object({
  costPerHour: z.string().min(1, validation.costRequired),
});

export type UpsertOverheadFormValues = z.infer<typeof upsertOverheadSchema>;

interface UseUpsertOverheadReturn {
  form: UseFormReturn<UpsertOverheadFormValues>;
  isLoading: boolean;
  serverErrors: string[] | null;
  onSubmit: (values: UpsertOverheadFormValues) => void;
  resetForm: () => void;
}

export function useUpsertOverhead(
  type: number | null,
  overhead: Overhead | null,
  onSuccess: () => void
): UseUpsertOverheadReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const form = useForm<UpsertOverheadFormValues>({
    resolver: zodResolver(upsertOverheadSchema),
    defaultValues: {
      costPerHour: overhead ? overhead.costPerHour.toString() : '',
    },
  });

  const resetForm = () => {
    form.reset();
    setServerErrors(null);
  };

  const onSubmit = async (values: UpsertOverheadFormValues) => {
    if (type === null) return;

    setIsLoading(true);
    setServerErrors(null);

    try {
      const costNumber = parseFloat(values.costPerHour.replace(/\./g, '').replace(',', '.'));

      if (isNaN(costNumber)) {
        throw new Error(validation.costInvalid);
      }

      if (overhead) {
        await overheadsService.update(overhead.id, {
          costPerHour: costNumber,
          updatedAt: getDateCorrected(new Date()),
        });
      } else {
        await overheadsService.register({
          type: type as any,
          costPerHour: costNumber,
          updatedAt: getDateCorrected(new Date()),
          createdAt: getDateCorrected(new Date()),
        });
      }

      resetForm();
      onSuccess();
    } catch (error: any) {

      const messages = error?.response?.data?.errorMessages ?? ['Ocorreu um erro ao salvar o custo. Tente novamente.'];
      setServerErrors(messages);

    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    serverErrors,
    onSubmit,
    resetForm,
  };
}
