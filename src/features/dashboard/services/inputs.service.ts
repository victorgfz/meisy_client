import { apiClient } from '../../../lib/api-client';



export const inputsService = {
    getAll: async () => {
        const response = await apiClient.get('/inputs');
        return response.data;
    },
    create: async (data: { description: string, price: number, type: number, amount: number, measurementUnit: number, createdAt: Date, updatedAt: Date }) => {
        const response = await apiClient.post('/inputs', data);
        return response.data;
    },
    update: async (id: number, data: { description: string, price: number, amount: number, updatedAt: Date }) => {
        await apiClient.put(`/inputs/${id}`, data);
    },
    delete: async (id: number) => {
        await apiClient.delete(`/inputs/${id}`);
    },
};