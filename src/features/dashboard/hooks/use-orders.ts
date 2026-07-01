import { useState, useEffect, useMemo, useCallback } from 'react';
import { type Order } from '../types/orders.types';
import { ordersService } from '../services/orders.service';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    
    try {
      setIsLoading(true);
      const response = await ordersService.getAll();
      setOrders(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


  const pendingOrders = useMemo(() => orders.length > 0 ? orders.filter(o => o.status === Number(0)) : [], [orders]);
  const preparingOrders = useMemo(() => orders.length > 0 ? orders.filter(o => o.status === Number(1)) : [], [orders]);
  const readyOrders = useMemo(() => orders.length > 0 ? orders.filter(o => o.status === Number(2)) : [], [orders]);
  const completedOrders = useMemo(() => orders.length > 0 ? orders.filter(o => o.status === Number(3)) : [], [orders]);


  const handleCreate = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  return {
    orders,
    pendingOrders,
    preparingOrders,
    readyOrders,
    completedOrders,
    isLoading,
    isCreateModalOpen,
    setIsCreateModalOpen,
    fetchOrders,
    handleCreate,
  };
}
