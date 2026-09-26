import { useState, useEffect, useCallback } from 'react';
import { type Profile } from '../types/profile.types';
import { profileService } from '../services/profile.service';
import { PROFILE_CONSTANTS } from '../constants/profile.constants';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await profileService.get();
      setProfile(result);
    } catch (err) {
      setError(PROFILE_CONSTANTS.error);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile
  };
}
