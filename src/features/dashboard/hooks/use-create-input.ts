import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { inputsService } from '../services/inputs.service';
import { InputType, MeasurementUnit } from '../types/inputs.types';

const createInputSchema = z.object({
  inputType: z.enum(['ingredient', 'packaging']),
  description: z.string().min(2, 'A descrição deve ter pelo menos 2 caracteres'),
  amount: z.string().min(1, 'A quantidade é obrigatória'),
  measurementUnit: z.enum(['g', 'kg', 'ml', 'l', 'un']),
  price: z.string().min(1, 'O preço é obrigatório'),
});

export type CreateInputFormValues = z.infer<typeof createInputSchema>;

interface UseCreateInputReturn {
  form: UseFormReturn<CreateInputFormValues>;
  isLoading: boolean;
  serverErrors: string[] | null;
  onSubmit: (values: CreateInputFormValues) => void;
  resetForm: () => void;
}

export function useCreateInput(onSuccess: () => void): UseCreateInputReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const form = useForm<CreateInputFormValues>({
    resolver: zodResolver(createInputSchema),
    defaultValues: {
      inputType: 'ingredient',
      description: '',
      amount: '',
      measurementUnit: 'g',
      price: '',
    },
  });

  const resetForm = () => {
    form.reset();
    setServerErrors(null);
  };

  const onSubmit = async (values: CreateInputFormValues) => {
    setIsLoading(true);
    setServerErrors(null);

    try {
      const priceNumber = parseFloat(values.price.replace(/\./g, '').replace(',', '.'));
      const amountNumber = parseFloat(values.amount.replace(/\./g, '').replace(',', '.'));

      if (isNaN(priceNumber) || isNaN(amountNumber)) {
        throw new Error('Valores numéricos inválidos');
      }

      await inputsService.create({
        description: values.description,
        price: priceNumber,
        type: values.inputType === 'ingredient' ? InputType.ingredient : InputType.packaging,
        amount: amountNumber,
        measurementUnit: MeasurementUnit[values.measurementUnit === 'un' ? 'unit' : values.measurementUnit as keyof typeof MeasurementUnit],
      });

      resetForm();
      onSuccess();
    } catch (error: any) {
      console.error('Create input error:', error?.response?.data?.errorMessages || error.message);
      const messages = error?.response?.data?.errorMessages ?? [error.message || 'Ocorreu um erro ao cadastrar. Tente novamente.'];
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
