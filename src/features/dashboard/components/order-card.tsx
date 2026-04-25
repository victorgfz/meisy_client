import { useState } from 'react';
import { type Order } from '../types/orders.types';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';
import { ChevronDown, ChevronUp, Package, Calendar, User, UserCircle, DollarSign, ArrowRight, Ban } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Date(order.deliveryDate).toLocaleDateString('pt-BR');
  const formattedTotalPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalPrice);

  return (
    <div className="bg-[#ffffff] border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            {ORDERS_CONSTANTS.card.orderId} {order.id}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
            {ORDERS_CONSTANTS.statusDisplay[order.status]}
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-emerald-600 flex items-center justify-end gap-1">
            <DollarSign className="w-4 h-4" />
            {formattedTotalPrice}
          </p>
          <p className="text-sm text-gray-500 flex items-center justify-end gap-1 mt-1">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-700">{ORDERS_CONSTANTS.card.seller}</span> {order.seller.name}
        </div>
        {order.client && (
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <UserCircle className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-700">{ORDERS_CONSTANTS.card.client}</span> {order.client.name}
          </div>
        )}
      </div>

      <div className="mb-4 bg-slate-50 border border-slate-100 rounded-lg p-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            {ORDERS_CONSTANTS.card.productsTitle} ({order.orderProducts.length})
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-2 divide-y divide-gray-200 animate-in slide-in-from-top-1 fade-in duration-200">
            {order.orderProducts.map((product) => (
              <div key={product.id} className="pt-2 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-gray-800">{product.description}</p>
                  <p className="text-gray-500 text-xs">{ORDERS_CONSTANTS.card.amount} {product.amount}</p>
                </div>
                <p className="font-medium text-gray-800">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.priceAtTheMoment)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
          {ORDERS_CONSTANTS.actions.advanceStatus}
          <ArrowRight className="w-4 h-4" />
        </button>
        <button className="flex-1 bg-rose-50 text-rose-600 border border-rose-200 py-2 px-4 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
          <Ban className="w-4 h-4" />
          {ORDERS_CONSTANTS.actions.cancel}
        </button>
      </div>
    </div>
  );
}
