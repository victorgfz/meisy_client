import { apiClient } from '../../../lib/api-client';

export const ordersService = {
  getAll: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },
};
