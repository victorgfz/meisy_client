import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { inputsService } from '../services/inputs.service';
import { InputType, MeasurementUnit } from '../types/inputs.types';
import { INPUTS_CONSTANTS } from '../constants/inputs.constants';

const { validation } = INPUTS_CONSTANTS;

const createInputSchema = z.object({
  inputType: z.enum(['ingredient', 'packaging']),
  description: z.string().min(2, validation.descriptionMin),
  amount: z.string().min(1, validation.amountRequired),
  measurementUnit: z.enum(['g', 'kg', 'ml', 'l', 'un']),
  price: z.string().min(1, validation.priceRequired),
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
        throw new Error(validation.numericInvalid);
      }

      await inputsService.create({
        description: values.description,
        price: priceNumber,
        type: values.inputType === 'ingredient' ? InputType.ingredient : InputType.packaging,
        amount: amountNumber,
        measurementUnit: MeasurementUnit[values.measurementUnit === 'un' ? 'unit' : values.measurementUnit as keyof typeof MeasurementUnit],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      resetForm();
      onSuccess();
    } catch (error: any) {
      const messages = error?.response?.data?.errorMessages ?? ['Ocorreu um erro ao cadastrar. Tente novamente.'];
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
