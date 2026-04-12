import { useState, useCallback, useEffect } from 'react';
import { productsService } from '../services/products.service';
import type { ProductDetail } from '../types/products.types';

export function useProductDetail(id: number | null) {
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await productsService.getById(id);
      setProductDetail(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao buscar detalhes do produto');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { productDetail, isLoading, error, refetch: fetchDetail };
}
