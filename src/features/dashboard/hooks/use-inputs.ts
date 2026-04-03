import { useState, useEffect, useMemo, useCallback } from 'react';
import { type Input } from '../types/inputs.types';
import { inputsService } from '../services/inputs.service';

export function useInputs() {
  const [inputs, setInputs] = useState<Input[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Input | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Input | null>(null);

  const fetchInputs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await inputsService.getAll();
      setInputs(response);
    } catch (error) {

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
    const item = inputs.find(i => i.id === id);
    if (item) {
      setItemToEdit(item);
      setIsEditModalOpen(true);
    }
  }, [inputs]);

  const handleDelete = useCallback((id: number) => {
    const item = inputs.find(i => i.id === id);
    if (item) {
      setItemToDelete(item);
      setIsDeleteModalOpen(true);
    }
  }, [inputs]);

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
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToEdit,
    itemToDelete,
    fetchInputs,
    handleEdit,
    handleDelete,
    handleCreate,
  };
}
