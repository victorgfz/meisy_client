import { apiClient } from '../../../lib/api-client';



export const inputsService = {
    getAll: async () => {
        const response = await apiClient.get('/inputs');
        return response.data;
    },
    create: async (data: { description: string, price: number, type: number, amount: number, measurementUnit: number }) => {
        const response = await apiClient.post('/inputs', data);
        return response.data;
    },
};