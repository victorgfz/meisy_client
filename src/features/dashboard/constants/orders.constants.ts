export const ORDERS_CONSTANTS = {
  actions: {
    create: 'Novo Pedido',
    cancel: 'Cancelar Pedido',
    advanceStatus: 'Avançar Status',
  },
  tabs: {
    pending: 'Pendente',
    preparing: 'Preparando',
    ready: 'Pronto',
    completed: 'Concluído',
  },
  list: {
    empty: 'Nenhum pedido encontrado nesta etapa.',
  },
  card: {
    orderId: 'Pedido',
    deliveryDate: 'Entrega:',
    status: 'Status:',
    totalPrice: 'Total:',
    seller: 'Vendedor(a):',
    client: 'Cliente:',
    productsTitle: 'Produtos do Pedido',
    hideProducts: 'Ocultar Produtos',
    showProducts: 'Exibir Produtos',
    amount: 'Qtd:',
  },
  statusDisplay: {
    0: 'Pendente',
    1: 'Preparando',
    2: 'Pronto',
    3: 'Concluído',
    4: 'Cancelado',
  } as Record<number, string>
};
