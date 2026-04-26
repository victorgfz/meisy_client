import { useState } from 'react';
import { ordersService } from '../services/orders.service';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';
import { type Order } from '../types/orders.types';

export function useCancelOrder(item: Order | null, onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const handleCancel = async () => {
    if (!item) return;

    setIsLoading(true);
    setServerErrors(null);

    try {
      await ordersService.cancelOrder(item.id);
      onSuccess();
    } catch (error: any) {
      const messages = error?.response?.data?.errorMessages ?? [ORDERS_CONSTANTS.validation.genericError];
      setServerErrors(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => setServerErrors(null);

  return {
    isLoading,
    serverErrors,
    handleCancel,
    resetError,
  };
}
