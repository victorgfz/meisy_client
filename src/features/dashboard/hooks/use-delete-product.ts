import { useState } from 'react';
import { productsService } from '../services/products.service';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';
import { type Product } from '../types/products.types';

export function useDeleteProduct(item: Product | null, onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const handleDelete = async () => {
    if (!item) return;

    setIsLoading(true);
    setServerErrors(null);

    try {
      await productsService.delete(item.id);
      onSuccess();
    } catch (error: any) {
      const messages = error?.response?.data?.errorMessages ?? [PRODUCTS_CONSTANTS.validation.deleteError];
      setServerErrors(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => setServerErrors(null);

  return {
    isLoading,
    serverErrors,
    handleDelete,
    resetError,
  };
}
