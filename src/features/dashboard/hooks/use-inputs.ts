import { useState, useEffect, useMemo, useCallback } from 'react';
import { type Input } from '../types/inputs.types';
import { inputsService } from '../services/inputs.service';

export function useInputs() {
  const [inputs, setInputs] = useState<Input[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchInputs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await inputsService.getAll();
      setInputs(response);
    } catch (error) {
      console.error('Failed to fetch inputs', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInputs();
  }, [fetchInputs]);




  const ingredients = useMemo(() => inputs.filter(i => i.type === Number(0)), [inputs]);
  const packages = useMemo(() => inputs.filter(i => i.type === Number(1)), [inputs]);


  const handleEdit = useCallback((id: number) => {
    console.log('Edit item:', id);
    // Open edit modal/sheet logic here
  }, []);

  const handleDelete = useCallback((id: number) => {
    console.log('Delete item:', id);
    // Delete logic or confirmation here
  }, []);

  const handleCreate = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  return {
    inputs,
    ingredients,
    packages,
    isLoading,
    isCreateModalOpen,
    setIsCreateModalOpen,
    fetchInputs,
    handleEdit,
    handleDelete,
    handleCreate,
  };
}
