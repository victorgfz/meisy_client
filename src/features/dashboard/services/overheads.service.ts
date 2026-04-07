import { apiClient } from '../../../lib/api-client';
import type { Overhead, RequestRegisterOverheadJson, RequestUpdateOverheadJson } from '../types/overheads.types';

export const overheadsService = {
  getAll: async (): Promise<Overhead[]> => {
    const response = await apiClient.get('/overheads');
    return response.data;
  },
  register: async (data: RequestRegisterOverheadJson): Promise<void> => {
    await apiClient.post('/overheads', data);
  },
  update: async (id: number, data: RequestUpdateOverheadJson): Promise<void> => {
    await apiClient.put(`/overheads/${id}`, data);
  }
};
