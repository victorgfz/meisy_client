import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ordersService } from '../services/orders.service';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';

const { validation } = ORDERS_CONSTANTS;

const createOrderSchema = z.object({
  deliveryDate: z.string().min(1, validation.deliveryDateRequired).refine(dateStr => {
    const date = new Date(dateStr);
    const minDate = new Date(new Date().getTime() - 60000);
    return date >= minDate;
  }, validation.deliveryDatePast),
  orderProducts: z.record(z.string(), z.object({
    amount: z.string().optional(),
  })).optional()
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;

interface UseCreateOrderReturn {
  form: UseFormReturn<CreateOrderFormValues>;
  isLoading: boolean;
  serverErrors: string[] | null;
  onSubmit: (values: CreateOrderFormValues) => void;
  resetForm: () => void;
}

export function useCreateOrder(onSuccess: () => void): UseCreateOrderReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      deliveryDate: '',
      orderProducts: {}
    },
  });

  const resetForm = () => {
    form.reset();
    setServerErrors(null);
  };

  const onSubmit = async (values: CreateOrderFormValues) => {
    setIsLoading(true);
    setServerErrors(null);

    try {
      const products: { productId: number; amount: number }[] = [];

      if (values.orderProducts) {
        Object.entries(values.orderProducts).forEach(([idString, data]) => {
          const amountStr = (data.amount || '0').toString();
          const amount = parseFloat(amountStr.replace(/\./g, '').replace(',', '.'));

          if (!isNaN(amount) && amount > 0) {
            products.push({
              productId: parseInt(idString, 10),
              amount: amount,
            });
          }
        });
      }

      if (products.length === 0) {
        throw new Error(validation.hasProducts);
      }

      const now = new Date();
      await ordersService.create({
        deliveryDate: new Date(values.deliveryDate).toISOString(),
        clientId: null,
        orderProducts: products,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
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
