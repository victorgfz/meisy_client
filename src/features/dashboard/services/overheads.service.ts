import { apiClient } from '../../../lib/api-client';
import type { RequestRegisterOverheadJson, RequestUpdateOverheadJson } from '../types/overheads.types';

export const overheadsService = {
  getAll: async () => {
    const response = await apiClient.get('/overheads');
    return response.data;
  },
  register: async (data: RequestRegisterOverheadJson) => {
    await apiClient.post('/overheads', data);
  },
  update: async (id: number, data: RequestUpdateOverheadJson) => {
    await apiClient.put(`/overheads/${id}`, data);
  }
};
