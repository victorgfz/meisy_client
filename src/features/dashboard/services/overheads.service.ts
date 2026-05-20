import { apiClient } from '../../../lib/api-client';
import type { CreateOverheadRequest, UpdateOverheadRequest } from '../types/overheads.types';

export const overheadsService = {
  getAll: async () => {
    const response = await apiClient.get('/overheads');
    return response.data;
  },
  register: async (data: CreateOverheadRequest) => {
    await apiClient.post('/overheads', data);
  },
  update: async (id: number, data: UpdateOverheadRequest) => {
    await apiClient.put(`/overheads/${id}`, data);
  }
};
