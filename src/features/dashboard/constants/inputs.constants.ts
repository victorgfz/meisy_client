export const INPUTS_CONSTANTS = {
  actions: {
    edit: 'Editar',
    delete: 'Excluir',
    create: 'Cadastrar Ingrediente',
  },
  list: {
    empty: 'Nenhum item cadastrado',
  },
  form: {
    ingredient: 'Ingrediente',
    packaging: 'Embalagem',
    descriptionLabel: 'Descrição',
    descriptionPlaceholder: 'Ex: Farinha de Trigo',
    amountLabel: 'Quantidade',
    amountPlaceholder: '1000',
    priceLabel: 'Preço',
    pricePlaceholder: '10,00',
    saveButton: 'Salvar',
    savingButton: 'Salvando...',
    cancelButton: 'Cancelar',
    deleteButton: 'Excluir',
    deletingButton: 'Excluindo...',
    deleteConfirmation: 'Tem certeza que deseja excluir o insumo {description}?',
    modalTitle: 'Cadastrar Insumo',
    editModalTitle: 'Editar Insumo',
    deleteModalTitle: 'Excluir Insumo'
  },
  validation: {
    descriptionMin: 'A descrição deve ter pelo menos 2 caracteres',
    amountRequired: 'A quantidade é obrigatória',
    unitRequired: 'A unidade é obrigatória',
    priceRequired: 'O preço é obrigatório',
    numericInvalid: 'Valores numéricos inválidos',
    genericError: 'Ocorreu um erro ao cadastrar. Tente novamente.',
    deleteError: 'Ocorreu um erro ao excluir. Tente novamente.',
  },
  messages: {
    successAdd: 'Insumo cadastrado com sucesso!',
    successEdit: 'Insumo atualizado com sucesso!',
    successDelete: 'Insumo excluído com sucesso!'
  }
};
