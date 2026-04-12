import { apiClient } from '../../../lib/api-client';
import type { RequestRegisterInputJson, RequestUpdateInputJson } from '../types/inputs.types';


export const inputsService = {
    getAll: async () => {
        const response = await apiClient.get('/inputs');
        return response.data;
    },
    create: async (data: RequestRegisterInputJson) => {
        const response = await apiClient.post('/inputs', data);
        return response.data;
    },
    update: async (id: number, data: RequestUpdateInputJson) => {
        await apiClient.put(`/inputs/${id}`, data);
    },
    delete: async (id: number) => {
        await apiClient.delete(`/inputs/${id}`);
    },
};