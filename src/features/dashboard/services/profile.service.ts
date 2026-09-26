import { apiClient } from '../../../lib/api-client';
import { type Profile } from '../types/profile.types';

export const profileService = {
  get: async (): Promise<Profile> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
};
