import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useOrders } from '../hooks/use-orders';
import { OrderList } from '../components/order-list';
import { useDashboardAction } from '../contexts/dashboard-action.context';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';
import { type Order, OrderStatus } from '../types/orders.types';
import { CreateOrderModal } from '../components/create-order-modal';
import { useAdvanceOrder } from '../hooks/use-advance-order';
import { useInfoDashboard } from '../hooks/use-info-dashboard';
import { ModalConfirmation } from '../components/modal-confirmation';
import { useCancelOrder } from '../hooks/use-cancel-order';
import { useToast } from '../../../hooks/use-toast';
import { FilterBar } from '../components/filter-bar';
import { useFilterSort } from '../hooks/use-filter-sort';
import { useProducts } from '../hooks/use-products';

type ConfirmationAction = 'advance' | 'cancel';

export function OrdersPage() {
  const {
    pendingOrders, preparingOrders, readyOrders, completedOrders, isLoading, handleCreate,
    isCreateModalOpen, setIsCreateModalOpen, fetchOrders, orders,
  } = useOrders();
  const { fetchInfoDashboard } = useInfoDashboard();
  const { products } = useProducts();

  const { setAction } = useDashboardAction();

  const [activeTab, setActiveTab] = useState<number>(0);
  const toast = useToast();
  const [confirmation, setConfirmation] = useState<{ action: ConfirmationAction; order: Order } | null>(null);

  const handleSuccessCreate = () => {
    fetchInfoDashboard();
    fetchOrders();
    toast(ORDERS_CONSTANTS.messages.successAdd, 'success', 4000)
  };
  const handleSuccessAdvance = () => {
    fetchOrders();
    toast(ORDERS_CONSTANTS.messages.successAdvance, 'success', 4000)

  };
  const handleSuccessCancel = () => {
    fetchOrders();
    toast(ORDERS_CONSTANTS.messages.successCancel, 'success', 4000)
  };

  const closeConfirmationState = () => {
    setConfirmation(null);
  };

  const {
    handleAdvance,
    isLoading: isAdvancing,
    serverErrors: advanceServerErrors,
    resetError: resetAdvanceError,
  } = useAdvanceOrder(() => {
    handleSuccessAdvance();
    closeConfirmationState();
  });

  const {
    handleCancel: confirmCancelOrder,
    isLoading: isCanceling,
    serverErrors: cancelServerErrors,
    resetError: resetCancelError,
  } = useCancelOrder(confirmation?.order ?? null, () => {
    handleSuccessCancel();
    closeConfirmationState();
  });

  const openConfirmation = (action: ConfirmationAction, order: Order) => {
    resetAdvanceError();
    resetCancelError();
    setConfirmation({ action, order });
  };

  const handleCloseConfirmation = () => {
    resetAdvanceError();
    resetCancelError();
    closeConfirmationState();
  };

  const handleConfirmAction = () => {
    if (!confirmation) return;

    if (confirmation.action === 'advance') {
      handleAdvance(confirmation.order.id);
      return;
    }

    confirmCancelOrder();
  };

  useEffect(() => {
    setAction({
      label: ORDERS_CONSTANTS.actions.create,
      icon: <Plus className="w-5 h-5" strokeWidth={3} />,
      onClick: handleCreate,
    });


    return () => setAction(null);
  }, [setAction, handleCreate]);

  // --- Filter & Sort ---

  // Unique sellers from all orders
  const sellerOptions = useMemo(() => {
    const sellerMap = new Map<number, string>();
    for (const order of orders) {
      if (order.seller) {
        sellerMap.set(order.seller.id, order.seller.name);
      }
    }
    return Array.from(sellerMap.entries()).map(([id, name]) => ({
      label: name,
      value: `seller-${id}`,
    }));
  }, [orders]);

  // Product options from loaded products
  const productOptions = useMemo(() => {
    return products.map((p) => ({
      label: p.description,
      value: `product-${p.id}`,
    }));
  }, [products]);

  const filterGroups = useMemo(() => {
    const groups = [];
    if (sellerOptions.length > 0) {
      groups.push({ label: 'Por Vendedor', options: sellerOptions });
    }
    if (productOptions.length > 0) {
      groups.push({ label: 'Por Produto', options: productOptions });
    }
    return groups;
  }, [sellerOptions, productOptions]);

  // Filter function
  const filterFn = useCallback(
    (order: Order, activeFilters: string[]) => {
      const sellerFilters = activeFilters
        .filter((f) => f.startsWith('seller-'))
        .map((f) => Number(f.replace('seller-', '')));

      const productFilters = activeFilters
        .filter((f) => f.startsWith('product-'))
        .map((f) => Number(f.replace('product-', '')));

      const matchesSeller = sellerFilters.length === 0 ||
        (order.seller && sellerFilters.includes(order.seller.id));

      const orderProductIds = (order.orderProducts ?? []).map((op) => op.id);
      const matchesProduct = productFilters.length === 0 ||
        productFilters.some((pid) => orderProductIds.includes(pid));

      return matchesSeller && matchesProduct;
    },
    []
  );

  // Sort function
  const sortFn = useCallback((a: Order, b: Order, sortKey: string) => {
    switch (sortKey) {
      case 'delivery-asc':
        return new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
      case 'delivery-desc':
        return new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime();
      case 'created-desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'created-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'updated-desc':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'updated-asc':
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      case 'total-desc':
        return b.totalPrice - a.totalPrice;
      case 'total-asc':
        return a.totalPrice - b.totalPrice;
      default:
        return 0;
    }
  }, []);

  // Get the raw list for the active tab
  const getTabList = useCallback(() => {
    switch (activeTab) {
      case OrderStatus.Pending: return pendingOrders;
      case OrderStatus.Preparing: return preparingOrders;
      case OrderStatus.Ready: return readyOrders;
      case OrderStatus.Completed: return completedOrders;
      default: return [];
    }
  }, [activeTab, pendingOrders, preparingOrders, readyOrders, completedOrders]);

  const {
    processedItems,
    activeFilters,
    activeSort,
    setActiveFilters,
    setActiveSort,
    clearFilters,
    hasActiveFilters,
  } = useFilterSort<Order>({
    items: getTabList(),
    filterFn,
    sortFn,
  });

  const tabs = [
    { id: OrderStatus.Pending, label: ORDERS_CONSTANTS.tabs.pending, count: pendingOrders.length },
    { id: OrderStatus.Preparing, label: ORDERS_CONSTANTS.tabs.preparing, count: preparingOrders.length },
    { id: OrderStatus.Ready, label: ORDERS_CONSTANTS.tabs.ready, count: readyOrders.length },
    { id: OrderStatus.Completed, label: ORDERS_CONSTANTS.tabs.completed, count: completedOrders.length },
  ];

  const nextStatusLabel = confirmation
    ? ORDERS_CONSTANTS.statusDisplay[confirmation.order.status + 1] || ''
    : '';

  const confirmationTitle = confirmation?.action === 'advance'
    ? ORDERS_CONSTANTS.form.advanceModalTitle
    : ORDERS_CONSTANTS.form.cancelModalTitle;

  const confirmationMessage = confirmation?.action === 'advance'
    ? ORDERS_CONSTANTS.form.advanceConfirmation
      .replace('{id}', confirmation.order.id.toString())
      .replace('{status}', nextStatusLabel)
    : ORDERS_CONSTANTS.form.cancelConfirmation.replace('{id}', confirmation?.order.id.toString() || '');

  const confirmationIsLoading = confirmation?.action === 'advance' ? isAdvancing : isCanceling;
  const confirmationServerErrors = confirmation?.action === 'advance' ? advanceServerErrors : cancelServerErrors;

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto relative px-4 sm:px-0">


      <div className="flex justify-start md:justify-center overflow-x-auto w-full border-b border-gray-300 mb-4 sticky top-0 z-20 pt-8 scrollbar-hide bg-bg-body">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3 px-6 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <FilterBar
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        sortOptions={ORDERS_CONSTANTS.filterSort.sortOptions}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <OrderList 
          orders={processedItems} 
          isLoading={isLoading} 
          onAdvance={(order) => openConfirmation('advance', order)}
          onCancel={(order) => openConfirmation('cancel', order)}
        />
      </section>

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccessCreate}
      />

      <ModalConfirmation
        isOpen={!!confirmation}
        title={confirmationTitle}
        message={confirmationMessage}
        confirmLabel={confirmation?.action === 'advance' ? ORDERS_CONSTANTS.form.advanceConfirmButton : ORDERS_CONSTANTS.form.cancelConfirmButton}
        cancelLabel={confirmation?.action === 'advance' ? ORDERS_CONSTANTS.form.cancelButton : ORDERS_CONSTANTS.form.keepButton}
        loadingLabel={confirmation?.action === 'advance' ? ORDERS_CONSTANTS.form.advancingButton : ORDERS_CONSTANTS.form.cancelingButton}
        isLoading={confirmationIsLoading}
        serverErrors={confirmationServerErrors}
        variant={confirmation?.action === 'advance' ? 'primary' : 'danger'}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
