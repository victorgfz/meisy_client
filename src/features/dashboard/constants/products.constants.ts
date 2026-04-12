export const PRODUCTS_CONSTANTS = {
  actions: {
    edit: 'Editar',
    delete: 'Excluir',
    create: 'Cadastrar Produto',
  },
  list: {
    empty: 'Nenhum produto cadastrado',
  },
  form: {
    descriptionLabel: 'Descrição',
    descriptionPlaceholder: 'Ex: Bolo de Chocolate',
    amountLabel: 'Quantidade',
    amountPlaceholder: '1',
    priceLabel: 'Preço',
    pricePlaceholder: '50,00',
    saveButton: 'Salvar',
    savingButton: 'Salvando...',
    cancelButton: 'Cancelar',
    deleteButton: 'Excluir',
    deletingButton: 'Excluindo...',
    deleteConfirmation: 'Tem certeza que deseja excluir o produto {description}?',
    modalTitle: 'Cadastrar Produto',
    editModalTitle: 'Editar Produto',
    detailsModalTitle: 'Detalhes do Produto',
    deleteModalTitle: 'Excluir Produto',
    recipeSubtitle: 'Receita',
    productionTimeLabel: 'Tempo de Produção',
    productionTimePlaceholder: 'HH:MM:SS',
    servingsLabel: 'Quantas porções essa receita rende?',
    servingsPlaceholder: 'Ex: 10',
    ingredientsSubtitle: 'Ingredientes',
    packagingSubtitle: 'Embalagens',
    overheadsSubtitle: 'Custos Indiretos',
    amountInputPlaceholder: 'Quantidade utilizada',
    unitPlaceholder: 'Unid'
  },
  details: {
    costPerServingLabel: 'Custo por porção',
    servingsLabel: 'Porções por receita',
    productionTimeLabel: 'Tempo de preparo',
    ingredientsSubtitle: 'Ingredientes',
    packagingSubtitle: 'Embalagens',
    overheadsSubtitle: 'Indiretos',
    totalPerServingLabel: "Total por porção",

  },
  validation: {
    descriptionMin: 'A descrição deve ter pelo menos 2 caracteres',
    amountRequired: 'A quantidade é obrigatória',
    productionAmountRequired: 'A quantidade de produção é obrigatória',

    unitRequired: 'A unidade é obrigatória',
    priceRequired: 'O preço é obrigatório',
    numericInvalid: 'Valores numéricos inválidos',
    productionTimeInvalid: 'Tempo de produção inválido',
    servingsRequired: 'A quantidade de porções é obrigatória',
    genericError: 'Ocorreu um erro ao cadastrar. Tente novamente.',
    deleteError: 'Ocorreu um erro ao excluir. Tente novamente.',
    hasIngredientAndPackage: 'O produto precisa ter ao menos um ingrediente e uma embalagem selecionados.',
  },
  messages: {
    successAdd: 'Produto cadastrado com sucesso!',
    successEdit: 'Produto atualizado com sucesso!',
    successDelete: 'Produto excluído com sucesso!'
  }
};
