import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useOrders } from '../hooks/use-orders';
import { OrderList } from '../components/order-list';
import { useDashboardAction } from '../contexts/dashboard-action.context';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';
import { type Order, OrderStatus } from '../types/orders.types';
import { CreateOrderModal } from '../components/create-order-modal';
import { SuccessMessage } from '../components/success-message';
import { useAdvanceOrder } from '../hooks/use-advance-order';
import { useInfoDashboard } from '../hooks/use-info-dashboard';
import { ModalConfirmation } from '../components/modal-confirmation';
import { useCancelOrder } from '../hooks/use-cancel-order';

type ConfirmationAction = 'advance' | 'cancel';

export function OrdersPage() {
  const {
    pendingOrders, preparingOrders, readyOrders, completedOrders, isLoading, handleCreate,
    isCreateModalOpen, setIsCreateModalOpen, fetchOrders,
  } = useOrders();
  const { fetchInfoDashboard } = useInfoDashboard();

  const { setAction } = useDashboardAction();

  const [activeTab, setActiveTab] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ action: ConfirmationAction; order: Order } | null>(null);

  const handleSuccessCreate = () => {
    fetchInfoDashboard();
    fetchOrders();
    setSuccessMessage(ORDERS_CONSTANTS.messages.successAdd);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSuccessAdvance = () => {
    fetchOrders();
    setSuccessMessage(ORDERS_CONSTANTS.messages.successAdvance);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSuccessCancel = () => {
    fetchOrders();
    setSuccessMessage(ORDERS_CONSTANTS.messages.successCancel);
    setTimeout(() => setSuccessMessage(null), 4000);
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

  const getActiveList = () => {

    switch (activeTab) {
      case OrderStatus.Pending: return pendingOrders;
      case OrderStatus.Preparing: return preparingOrders;
      case OrderStatus.Ready: return readyOrders;
      case OrderStatus.Completed: return completedOrders;
      default: return [];
    }
  };

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


      <div className="flex justify-start md:justify-center overflow-x-auto w-full border-b border-gray-300 mb-6 sticky top-0 z-20 pt-8 scrollbar-hide bg-bg-body">
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
      {successMessage && <SuccessMessage message={successMessage} />}

      <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <OrderList 
          orders={getActiveList()} 
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
