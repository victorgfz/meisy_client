import { useState, useEffect } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { inputsService } from '../services/inputs.service';
import { type Input, InputType, MeasurementUnit } from '../types/inputs.types';
import { INPUTS_CONSTANTS } from '../constants/inputs.constants';
import { getDateCorrected } from '../../../lib/date-corrected';

const { validation } = INPUTS_CONSTANTS;

const editInputSchema = z.object({
  inputType: z.enum(['ingredient', 'packaging']),
  description: z.string().min(2, validation.descriptionMin),
  amount: z.string().min(1, validation.amountRequired),
  measurementUnit: z.enum(['g', 'kg', 'ml', 'l', 'un']),
  price: z.string().min(1, validation.priceRequired),
});

export type EditInputFormValues = z.infer<typeof editInputSchema>;

interface UseEditInputReturn {
  form: UseFormReturn<EditInputFormValues>;
  isLoading: boolean;
  serverErrors: string[] | null;
  onSubmit: (values: EditInputFormValues) => void;
  resetForm: () => void;
}

const getUnitKey = (value: number) => {
  const key = Object.keys(MeasurementUnit).find(key => MeasurementUnit[key as keyof typeof MeasurementUnit] === value);
  if (key === 'unit') return 'un';
  return key || 'g';
};

export function useEditInput(
  initialData: Input | null,
  onSuccess: () => void
): UseEditInputReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const form = useForm<EditInputFormValues>({
    resolver: zodResolver(editInputSchema),
    defaultValues: {
      inputType: 'ingredient',
      description: '',
      amount: '',
      measurementUnit: 'g',
      price: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      const type = initialData.type === InputType.ingredient ? 'ingredient' : 'packaging';
      const unit = getUnitKey(initialData.measurementUnit);

      const formattedPrice = initialData.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedAmount = initialData.amount.toString().replace('.', ',');

      form.reset({
        inputType: type,
        description: initialData.description,
        amount: formattedAmount,
        measurementUnit: unit as any,
        price: formattedPrice,
      });
    }
  }, [initialData, form]);

  const resetForm = () => {
    if (initialData) {
      const type = initialData.type === InputType.ingredient ? 'ingredient' : 'packaging';
      const unit = getUnitKey(initialData.measurementUnit);
      const formattedPrice = initialData.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedAmount = initialData.amount.toString().replace('.', ',');

      form.reset({
        inputType: type,
        description: initialData.description,
        amount: formattedAmount,
        measurementUnit: unit as any,
        price: formattedPrice,
      });
    } else {
      form.reset();
    }
    setServerErrors(null);
  };

  const onSubmit = async (values: EditInputFormValues) => {
    if (!initialData) return;

    setIsLoading(true);
    setServerErrors(null);

    try {
      const priceNumber = parseFloat(values.price.replace(/\./g, '').replace(',', '.'));
      const amountNumber = parseFloat(values.amount.replace(/\./g, '').replace(',', '.'));

      if (isNaN(priceNumber) || isNaN(amountNumber)) {
        throw new Error(validation.numericInvalid);
      }

      await inputsService.update(initialData.id, {
        description: values.description,
        price: priceNumber,
        amount: amountNumber,
        updatedAt: getDateCorrected(new Date()),
      });

      onSuccess();
    } catch (error: any) {
      const messages = error?.response?.data?.errorMessages ?? ['Ocorreu um erro ao atualizar. Tente novamente.'];
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
