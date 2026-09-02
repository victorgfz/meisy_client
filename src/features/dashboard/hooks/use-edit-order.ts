import { useState, useEffect } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ordersService } from '../services/orders.service';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';
import { getDateCorrected } from '../../../lib/date-corrected';
import { type Order } from '../types/orders.types';

const { validation } = ORDERS_CONSTANTS;

const editOrderSchema = z.object({
  deliveryDate: z.string().min(1, validation.deliveryDateRequired),
  orderProducts: z.record(z.string(), z.object({
    amount: z.string().optional(),
  })).optional()
});

export type EditOrderFormValues = z.infer<typeof editOrderSchema>;

interface UseEditOrderReturn {
  form: UseFormReturn<EditOrderFormValues>;
  isLoading: boolean;
  serverErrors: string[] | null;
  onSubmit: (values: EditOrderFormValues) => void;
  resetForm: () => void;
}

const formatForDateTimeLocal = (date: Date | string) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function useEditOrder(
  initialData: Order | null,
  onSuccess: () => void
): UseEditOrderReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const form = useForm<EditOrderFormValues>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      deliveryDate: '',
      orderProducts: {}
    },
  });

  useEffect(() => {
    if (initialData) {
      const orderProductsValue: Record<string, { amount?: string }> = {};

      if (initialData.orderProducts) {
        initialData.orderProducts.forEach(product => {
          orderProductsValue[product.id.toString()] = {
            amount: product.amount.toString(),
          };
        });
      }

      form.reset({
        deliveryDate: formatForDateTimeLocal(initialData.deliveryDate),
        orderProducts: orderProductsValue,
      });
    }
  }, [initialData, form]);

  const resetForm = () => {
    if (initialData) {
      const orderProductsValue: Record<string, { amount?: string }> = {};

      if (initialData.orderProducts) {
        initialData.orderProducts.forEach(product => {
          orderProductsValue[product.id.toString()] = {
            amount: product.amount.toString(),
          };
        });
      }

      form.reset({
        deliveryDate: formatForDateTimeLocal(initialData.deliveryDate),
        orderProducts: orderProductsValue,
      });
    } else {
      form.reset();
    }
    setServerErrors(null);
  };

  const onSubmit = async (values: EditOrderFormValues) => {
    if (!initialData) return;

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

      await ordersService.update(initialData.id, {
        deliveryDate: getDateCorrected(new Date(values.deliveryDate)),
        orderProducts: products,
        updatedAt: getDateCorrected(new Date()),
      });
      
      window.dispatchEvent(new Event('dashboard-needs-refresh'));
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
