import { apiClient } from '../../../lib/api-client';
import type {
  NotificationPreferences,
  PushSubscriptionRequest,
} from '../types/notifications.types';

export const notificationsService = {
  getVapidPublicKey: async () => {
    const response = await apiClient.get('/notification/vapid-public-key');
    return response.data.publicKey as string;
  },

  subscribe: async (data: PushSubscriptionRequest) => {
    await apiClient.post('/notification/subscribe', data);
  },

  getPreferences: async (endpoint: string) => {
    const response = await apiClient.get<NotificationPreferences>('/notification/preferences', {
      params: { endpoint },
    });
    return response.data;
  },

  updatePreferences: async (endpoint: string, receiveNotifications: boolean) => {
    await apiClient.put('/notification/preferences', {
      endpoint,
      receiveNotifications,
    });
  },
};
