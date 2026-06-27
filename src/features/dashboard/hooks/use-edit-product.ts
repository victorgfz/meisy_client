import { useState, useEffect } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { productsService } from '../services/products.service';
import { MeasurementUnit } from '../types/inputs.types';
import { ProductionMeasurementUnit, type ProductDetail } from '../types/products.types';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';
import { getDateCorrected } from '../../../lib/date-corrected';

const { validation } = PRODUCTS_CONSTANTS;

const editProductSchema = z.object({
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

export type EditProductFormInput = z.input<typeof editProductSchema>;
export type EditProductFormValues = z.output<typeof editProductSchema>;

interface UseEditProductReturn {
  form: UseFormReturn<EditProductFormInput, any, EditProductFormValues>;
  isLoading: boolean;
  serverErrors: string[] | null;
  onSubmit: (values: EditProductFormValues) => void;
  resetForm: () => void;
}

const getUnitKey = (value: number) => {
  const key = Object.keys(MeasurementUnit).find(key => MeasurementUnit[key as keyof typeof MeasurementUnit] === value);
  if (key === 'unit') return 'un';
  return key || 'g';
};

const getProductionUnitKey = (value: number) => {
  const key = Object.keys(ProductionMeasurementUnit).find(key => ProductionMeasurementUnit[key as keyof typeof ProductionMeasurementUnit] === value);
  if (key === 'unit') return 'un';
  return key || 'g';
};

export function useEditProduct(
  initialData: ProductDetail | null,
  onSuccess: () => void
): UseEditProductReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const form = useForm<EditProductFormInput, any, EditProductFormValues>({
    resolver: zodResolver(editProductSchema),
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

  useEffect(() => {
    if (initialData) {
      const unit = getUnitKey(initialData.measurementUnit);
      const formattedPrice = initialData.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedAmount = initialData.amount.toString().replace('.', ',');

      const productInputsValue: Record<string, { isChecked: boolean, amount?: string, unit: any }> = {};

      if (initialData.productInputs) {
        initialData.productInputs.forEach(input => {
          const recipeAmount = parseFloat((input.productionAmount * initialData.servings).toFixed(4));
          productInputsValue[input.id.toString()] = {
            isChecked: true,
            amount: recipeAmount.toString().replace('.', ','),
            unit: getProductionUnitKey(input.productionMeasurementUnit) as any
          };
        });
      }

      form.reset({
        description: initialData.description,
        amount: formattedAmount,
        measurementUnit: unit as any,
        price: formattedPrice,
        productionTime: initialData.productionTime,
        servings: initialData.servings.toString(),
        productInputs: productInputsValue
      });
    }
  }, [initialData, form]);

  const resetForm = () => {
    if (initialData) {
      const unit = getUnitKey(initialData.measurementUnit);
      const formattedPrice = initialData.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedAmount = initialData.amount.toString().replace('.', ',');

      const productInputsValue: Record<string, { isChecked: boolean, amount?: string, unit: any }> = {};

      if (initialData.productInputs) {
        initialData.productInputs.forEach(input => {
          const recipeAmount = parseFloat((input.productionAmount * initialData.servings).toFixed(4));
          productInputsValue[input.id.toString()] = {
            isChecked: true,
            amount: recipeAmount.toString().replace('.', ','),
            unit: getProductionUnitKey(input.productionMeasurementUnit) as any
          };
        });
      }

      form.reset({
        description: initialData.description,
        amount: formattedAmount,
        measurementUnit: unit as any,
        price: formattedPrice,
        productionTime: initialData.productionTime,
        servings: initialData.servings.toString(),
        productInputs: productInputsValue
      });
    } else {
      form.reset();
    }
    setServerErrors(null);
  };

  const onSubmit = async (values: EditProductFormValues) => {
    if (!initialData) return;

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
      const submitData = {
        description: values.description,
        price: priceNumber,
        amount: amountNumber,
        productionTime: values.productionTime,
        servings: servingsNumber,
        productInputs: apiInputs,
        updatedAt: getDateCorrected(new Date()),
      }
      await productsService.update(initialData.id, submitData);

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
