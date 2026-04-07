import { useState, useCallback, useEffect } from 'react';
import { overheadsService } from '../services/overheads.service';
import type { Overhead } from '../types/overheads.types';

export function useOverheads() {
  const [overheads, setOverheads] = useState<Overhead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedOverhead, setSelectedOverhead] = useState<Overhead | null>(null);

  const fetchOverheads = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await overheadsService.getAll();
      setOverheads(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch overheads', error);
      setOverheads([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverheads();
  }, [fetchOverheads]);

  const handleOpenModal = (type: number, currentOverhead?: Overhead) => {
    setSelectedType(type);
    setSelectedOverhead(currentOverhead || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedType(null);
    setSelectedOverhead(null);
  };

  return {
    overheads,
    isLoading,
    isModalOpen,
    selectedType,
    selectedOverhead,
    handleOpenModal,
    handleCloseModal,
    fetchOverheads
  };
}
