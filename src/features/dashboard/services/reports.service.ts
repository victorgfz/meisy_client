import { apiClient } from '../../../lib/api-client';

export const reportsService = {
    getInfoDashboard: async () => {
        const response = await apiClient.get('/reports/info-dashboard');
        return response.data;
    }
}
