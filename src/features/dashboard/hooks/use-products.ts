import { useState, useEffect, useCallback } from 'react';
import { type Product } from '../types/products.types';
import { productsService } from '../services/products.service';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await productsService.getAll();
      setProducts(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = useCallback((id: number) => {
    const item = products.find(p => p.id === id);
    if (item) {
      setItemToEdit(item);
      setIsEditModalOpen(true);
    }
  }, [products]);

  const handleDelete = useCallback((id: number) => {
    const item = products.find(p => p.id === id);
    if (item) {
      setItemToDelete(item);
      setIsDeleteModalOpen(true);
    }
  }, [products]);

  const handleCreate = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleViewDetail = useCallback((id: number) => {
    setSelectedProductId(id);
    setIsDetailModalOpen(true);
  }, []);

  return {
    products,
    isLoading,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    itemToEdit,
    itemToDelete,
    selectedProductId,
    fetchProducts,
    handleEdit,
    handleDelete,
    handleCreate,
    handleViewDetail,
  };
}
