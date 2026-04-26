import { apiClient } from '../../../lib/api-client';
import type { CreateOrderRequest } from '../types/orders.types';

export const ordersService = {
  getAll: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },
  create: async (data: CreateOrderRequest) => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },
  advanceStatus: async (id: number) => {
    const response = await apiClient.patch(`/orders/${id}/update`);
    return response.data;
  },
  cancelOrder: async (id: number) => {
    const response = await apiClient.patch(`/orders/${id}/cancel`);
    return response.data;
  },
};
