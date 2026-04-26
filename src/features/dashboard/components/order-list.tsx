import { type Order } from '../types/orders.types';
import { OrderCard } from './order-card';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';


interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  onAdvance: (order: Order) => void;
  onCancel: (order: Order) => void;
}

export function OrderList({ orders, isLoading, onAdvance, onCancel }: OrderListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-100 border border-gray-200 rounded-xl h-64 w-full"></div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary bg-white rounded-3xl border border-dashed border-gray-200">
        {ORDERS_CONSTANTS.list.empty}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onAdvance={() => onAdvance(order)} onCancel={() => onCancel(order)} />
      ))}
    </div>
  );
}
