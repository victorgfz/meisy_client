import { apiClient } from '../../../lib/api-client';
import type { LoginFormValues } from '../hooks/use-login';


interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  companyCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  login: async (data: LoginFormValues) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },


  register: async (data: RegisterFormValues) => {

    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
};
