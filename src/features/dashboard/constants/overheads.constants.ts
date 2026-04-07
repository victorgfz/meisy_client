export const OVERHEADS_CONSTANTS = {
  types: {
    electricity: 'Eletricidade',
    labor: 'Mão de Obra',
    gas: 'Gás',
    maintenance: 'Manutenção',
    default: 'Custos Indiretos'
  },
  labels: {
    addCost: 'Adicionar custo',
    costPerHour: 'Custo por hora',
    costPerHourInputLabel: 'Custo por hora (R$)'
  },
  placeholders: {
    costPerHour: 'Ex: 15,50'
  },
  actions: {
    edit: 'Editar',
    add: 'Adicionar',
    cancel: 'Cancelar',
    save: 'Salvar',
    saving: 'Salvando...',
    tip: 'Como calcular esse custo?'
  },
  messages: {
    successSave: 'Custo operacional salvo com sucesso!'
  },
  validation: {
    costRequired: 'O custo por hora é obrigatório.',
    costInvalid: 'O custo por hora é inválido.',
  },
  tabs: {
    overheads: 'Custos Indiretos'
  },
  tips: {
    electricity: 'Para calcular o custo de eletricidade, divida o valor médio da sua conta de luz pelas horas trabalhadas no mês, ou verifique o consumo em kW/h dos equipamentos multiplicando pelo valor da tarifa de energia.',
    labor: 'Some sua retirada mensal desejada (pró-labore), encargos e benefícios. Em seguida, divida esse valor pelo total de horas que você produz no mês.',
    gas: 'Divida o valor investido no botijão (ou gás encanado) pela quantidade média de horas contínuas de produção que esse volume suporta.',
    maintenance: 'Estime os gastos mensais comuns com manutenção e insumos para os equipamentos e divida pelo total de horas trabalhadas no mês.',
    default: 'Calcule seus custos mensais para esta categoria e divida pelo total de horas de produção no mês para obter o valor por hora.'
  }
} as const;
