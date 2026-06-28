export const ORDERS_CONSTANTS = {
  actions: {
    create: 'Novo Pedido',
    cancel: 'Cancelar',
    advanceStatus: 'Avançar',
  },
  tabs: {
    pending: 'Pendente',
    preparing: 'Preparando',
    ready: 'Pronto para entrega',
    completed: 'Concluído',
  },
  list: {
    empty: 'Nenhum pedido encontrado nesta etapa.',
  },
  card: {
    orderId: 'Pedido',
    status: 'Status:',
    totalPrice: 'Total:',
    seller: 'Vendedor(a):',
    client: 'Cliente:',
    orderDate: 'Data do pedido:',
    deliveryDate: 'Data de entrega:',
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
  } as Record<number, string>,
  modal: {
    createTitle: 'Adicionar Pedido',
  },
  form: {
    deliveryDateLabel: 'Data de Entrega',
    deliveryDatePlaceholder: 'Selecione a data e hora',
    productsSubtitle: 'Produtos do Pedido',
    amountInputPlaceholder: 'Qtd.',
    saveButton: 'Salvar Pedido',
    savingButton: 'Salvando...',
    cancelButton: 'Cancelar',
    totalLabel: 'Valor Total',
    cancelModalTitle: 'Cancelar Pedido',
    cancelConfirmation: 'Tem certeza que deseja cancelar o pedido #{id}? Esta ação não pode ser desfeita.',
    cancelConfirmButton: 'Sim, Cancelar',
    cancelingButton: 'Cancelando...',
    keepButton: 'Não, Manter',
    noProducts: "Nenhum produto cadastrado ainda. Para registrar um pedido é necessário cadastrar pelo menos um produto."
  },
  validation: {
    deliveryDateRequired: 'A data de entrega é obrigatória.',
    deliveryDatePast: 'A data de entrega não pode estar no passado.',
    hasProducts: 'Adicione pelo menos um produto ao pedido.',
    productAmountRequired: 'Informe a quantidade para os produtos selecionados.',
    numericInvalid: 'Valores numéricos inválidos.',
    genericError: 'Ocorreu um erro ao salvar o pedido.',
  },
  messages: {
    successAdd: 'Pedido adicionado com sucesso!',
    successAdvance: 'Status do pedido avançado com sucesso!',
    successCancel: 'Pedido cancelado com sucesso!',
  }
};
