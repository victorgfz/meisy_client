import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { productsService } from '../services/products.service';
import { MeasurementUnit } from '../types/inputs.types';
import { ProductionMeasurementUnit } from '../types/products.types';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';
import { getDateCorrected } from '../../../lib/date-corrected';

const { validation } = PRODUCTS_CONSTANTS;

const createProductSchema = z.object({
  description: z.string().min(2, validation.descriptionMin),
  amount: z.string().min(1, validation.amountRequired),
  measurementUnit: z.enum(['g', 'kg', 'ml', 'l', 'un']),
  price: z.string().min(1, validation.priceRequired),
  productionTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, validation.productionTimeInvalid),
  servings: z.string().min(1, validation.servingsRequired),
  productInputs: z.record(z.string(), z.object({
    isChecked: z.boolean().default(false),
    amount: z.string().optional(),
    unit: z.enum(['g', 'kg', 'ml', 'l', 'un', 'tsp', 'tbscp']).default('g'),
  })).optional()
});

export type CreateProductFormInput = z.input<typeof createProductSchema>;
export type CreateProductFormValues = z.output<typeof createProductSchema>;

interface UseCreateProductReturn {
  form: UseFormReturn<CreateProductFormInput, any, CreateProductFormValues>;
  isLoading: boolean;
  serverErrors: string[] | null;
  onSubmit: (values: CreateProductFormValues) => void;
  resetForm: () => void;
}

export function useCreateProduct(onSuccess: () => void): UseCreateProductReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const form = useForm<CreateProductFormInput, any, CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      description: '',
      amount: '',
      measurementUnit: 'un',
      price: '',
      productionTime: '00:00:00',
      servings: '',
      productInputs: {}
    },
  });

  const resetForm = () => {
    form.reset();
    setServerErrors(null);
  };

  const onSubmit = async (values: CreateProductFormValues) => {
    setIsLoading(true);
    setServerErrors(null);

    try {
      const priceNumber = parseFloat(values.price.replace(/\./g, '').replace(',', '.'));
      const amountNumber = parseFloat(values.amount.replace(/\./g, '').replace(',', '.'));
      const servingsNumber = parseInt(values.servings, 10);

      if (isNaN(priceNumber) || isNaN(amountNumber) || isNaN(servingsNumber)) {
        throw new Error(validation.numericInvalid);
      }

      // Map product inputs
      const apiInputs: { inputId: number, productionAmount: number, productionMeasurementUnit: number }[] = [];

      if (values.productInputs) {
        Object.entries(values.productInputs).forEach(([idString, data]) => {
          if (data.isChecked) {
            const prodAmt = parseFloat((data.amount || '0').replace(/\./g, '').replace(',', '.'));
            if (isNaN(prodAmt) || prodAmt <= 0) {
              throw new Error(validation.productionAmountRequired);
            }

            const unitKey = data.unit === 'un' ? 'unit' : data.unit as keyof typeof ProductionMeasurementUnit;
            const prodUnit = ProductionMeasurementUnit[unitKey];

            apiInputs.push({
              inputId: parseInt(idString, 10),
              productionAmount: prodAmt,
              productionMeasurementUnit: prodUnit
            });
          }
        });
      }

      const mUnitKey = values.measurementUnit === 'un' ? 'unit' : values.measurementUnit as keyof typeof MeasurementUnit;



      await productsService.create({
        description: values.description,
        price: priceNumber,
        amount: amountNumber,
        measurementUnit: MeasurementUnit[mUnitKey],
        productionTime: values.productionTime,
        servings: servingsNumber,
        productInputs: apiInputs,
        createdAt: getDateCorrected(new Date()),
        updatedAt: getDateCorrected(new Date()),
      });

      resetForm();
      onSuccess();
    } catch (error: any) {
      if (error instanceof Error) {
        setServerErrors([error.message]);
      } else {
        const messages = error?.response?.data?.errorMessages ?? [validation.genericError];
        setServerErrors(messages);
      }
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
