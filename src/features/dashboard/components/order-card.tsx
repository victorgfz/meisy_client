import { useEffect, useState } from 'react';
import { type Order, OrderStatus } from '../types/orders.types';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';
import { ChevronDown, ChevronUp, User, UserCircle, ArrowRight, Ban, ShoppingCart, CalendarArrowDown, CalendarDays } from 'lucide-react';
import { formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';


interface OrderCardProps {
  order: Order;
  onAdvance: () => void;
  onCancel: () => void;
}

export function OrderCard({ order, onAdvance, onCancel }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const formatDate = (date: string | Date) => new Date(date).toLocaleDateString('pt-BR');
  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  const formatDateRelative = (date: string | Date) => {
    const data = new Date(date);
    const hoje = new Date();

    if (data < hoje) {
      return `Entregue em ${formatRelative(data, hoje, { locale: ptBR })}`;
    }

    return `Entrega para ${formatRelative(data, hoje, { locale: ptBR })}`;

  };


  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
      <button disabled={isLargeScreen} onClick={() => setIsExpanded(!isExpanded)} className={`mb-4 w-full ${isExpanded || isLargeScreen ? 'mb-0' : ''}`}>

        <div className='flex justify-between items-start w-full mb-2'>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            <h3 className='text-xl font-bold text-gray-900 '>
              #{order.id}
            </h3>

          </div>
          <p className="text-lg text-right font-semibold text-emerald-600 flex items-center justify-end gap-1">
            {formatPrice(order.totalPrice)}
          </p>

        </div>


        <div className='flex items-center justify-between mt-4'>
          <p className='text-sm text-left text-slate-500'>
            {formatDateRelative(order.deliveryDate)}
          </p>

          {!isLargeScreen && (isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}

        </div>


      </button>


      {(isExpanded || isLargeScreen) && (
        <div className='animate-in fade-in slide-in-from-bottom-2 duration-300 my-4 py-4 border-y border-gray-200 flex-1'>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-[12px] text-gray-600 gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700 uppercase">{ORDERS_CONSTANTS.card.seller}</span> {order.seller.name}
            </div>

            <div className="flex items-center text-[12px] text-gray-600 gap-2">
              <UserCircle className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700 uppercase">{ORDERS_CONSTANTS.card.client}</span> {order.client ? order.client.name : "Não informado"}
            </div>

            <div className="flex items-center text-[12px] text-gray-600 gap-2">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700 uppercase">{ORDERS_CONSTANTS.card.orderDate}</span> {formatDate(order.createdAt)}
            </div>
            <div className="flex items-center text-[12px] text-gray-600 gap-2">
              <CalendarArrowDown className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700 uppercase">{ORDERS_CONSTANTS.card.deliveryDate}</span> {formatDate(order.deliveryDate)}
            </div>
          </div>


          <div className="mb-4 bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              <p className="font-medium text-gray-800">{ORDERS_CONSTANTS.card.productsTitle}</p>
            </div>
            <div className="space-y-2 divide-y divide-gray-200 max-h-24 h-full overflow-y-auto">
              {order.orderProducts.map((product) => (
                <div key={product.id} className="pt-2 flex justify-between items-center gap-2 text-xs">

                  <p className="text-gray-600 flex-1">{product.description}</p>


                  <p className="text-gray-400">{product.amount}x</p>
                  <p className="text-gray-600">
                    {formatPrice(product.amount * product.priceAtTheMoment)}
                  </p>
                </div>
              ))}
            </div>

          </div>


        </div>)}
      <div className="flex gap-2 pt-2">
        <button
          onClick={(e) => { e.stopPropagation(); onAdvance(); }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/50 text-white rounded-2xl text-sm font-medium transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          {ORDERS_CONSTANTS.actions.advanceStatus}
        </button>
        {order.status !== OrderStatus.Completed && (
          <button
            onClick={(e) => { e.stopPropagation(); onCancel(); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl text-sm font-medium transition-colors"
          >
            <Ban className="w-4 h-4" />
            {ORDERS_CONSTANTS.actions.cancel}
          </button>
        )}
      </div>
    </div>
  );
}
