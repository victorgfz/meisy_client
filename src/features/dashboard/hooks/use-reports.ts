import { useState, useEffect, useCallback } from 'react';
import { type AllReports } from '../types/reports.types';
import { reportsService } from '../services/reports.service';

export function useReports() {
  const [reports, setReports] = useState<AllReports | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await reportsService.getAll();
      setReports(result);
    } catch (err) {
      setError('Erro ao carregar dados dos relatórios');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    isLoading,
    error,
    fetchReports
  };
}
