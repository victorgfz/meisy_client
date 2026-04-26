export const OrderStatus = {
  Pending: 0,
  Preparing: 1,
  Ready: 2,
  Completed: 3,
  Cancelled: 4,
} as const;

export interface OrderProduct {
  id: number;
  description: string;
  amount: number;
  priceAtTheMoment: number;
}

export interface Order {
  id: number;
  deliveryDate: string | Date;
  status: typeof OrderStatus[keyof typeof OrderStatus];
  totalPrice: number;
  seller: {
    id: number;
    name: string;
  };
  client: {
    id: number;
    name: string;
  } | null;
  orderProducts: OrderProduct[];
  createdAt: string | Date;
  updatedAt: string | Date;
  companyId: number;
}

export interface CreateOrderRequest {
  deliveryDate: string | Date;
  clientId: number | null;
  orderProducts: {
    productId: number;
    amount: number;
  }[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
