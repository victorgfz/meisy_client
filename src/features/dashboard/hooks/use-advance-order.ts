import { useState } from 'react';
import { ordersService } from '../services/orders.service';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';

export function useAdvanceOrder(onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const handleAdvance = async (id: number) => {
    setIsLoading(true);
    setServerErrors(null);

    try {
      await ordersService.advanceStatus(id);
      window.dispatchEvent(new Event('dashboard-needs-refresh'));
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
    handleAdvance,
    resetError,
  };
}
