import { apiClient } from '../../../lib/api-client';
import type { CreateProductFormValues } from '../types/products.types';

export const productsService = {
    getAll: async () => {
        const response = await apiClient.get('/products');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },
    create: async (data: CreateProductFormValues) => {
        const response = await apiClient.post('/products', data);
        return response.data;
    },
    update: async (id: number, data: { description: string, price: number, amount: number, updatedAt: Date }) => {
        await apiClient.put(`/products/${id}`, data);
    },
    delete: async (id: number) => {
        await apiClient.delete(`/products/${id}`);
    },
};
