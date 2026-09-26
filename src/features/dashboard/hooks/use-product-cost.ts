import { InputType, MeasurementUnit, type Input } from '../types/inputs.types';
import type { Overhead } from '../types/overheads.types';

// Mirrors Meisy.Application/Utils/ProductCostUtils.cs
type ProductionUnit = 'g' | 'kg' | 'ml' | 'l' | 'un' | 'tsp' | 'tbscp';

interface ProductInputFormValue {
  isChecked?: boolean;
  amount?: string;
  unit?: ProductionUnit;
}

interface UseProductCostParams {
  inputs: Input[];
  overheads: Overhead[];
  productInputs?: Record<string, ProductInputFormValue>;
  productionTime?: string;
  servings?: string;
  price?: string;
}

export interface ProductCostBreakdown {
  ingredientsCost: number;
  packagesCost: number;
  overheadsCost: number;
  totalCost: number;
  profit: number | null;
  hasSelectedInputs: boolean;
  hasServings: boolean;
  hasProductionTime: boolean;
}

const formatAmount = (amount: number, unit: number) => {
  const multiplier = unit === MeasurementUnit.kg || unit === MeasurementUnit.l ? 1000 : 1;
  return amount * multiplier;
};

const formatProductionAmount = (amount: number, unit: ProductionUnit = 'g') => {
  const multipliers: Record<ProductionUnit, number> = {
    g: 1,
    kg: 1000,
    ml: 1,
    l: 1000,
    un: 1,
    tsp: 5,
    tbscp: 15,
  };
  return amount * multipliers[unit];
};

const parseDecimal = (value?: string) => {
  const parsed = parseFloat((value || '').replace(/\./g, '').replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
};

const parseProductionTimeInHours = (value?: string) => {
  const [hours = 0, minutes = 0, seconds = 0] = (value || '')
    .split(':')
    .map((part) => parseInt(part, 10) || 0);
  return hours + minutes / 60 + seconds / 3600;
};

export function useProductCost({
  inputs,
  overheads,
  productInputs,
  productionTime,
  servings,
  price,
}: UseProductCostParams): ProductCostBreakdown {
  // Not memoized: react-hook-form's watch may keep the same nested reference between changes
  let ingredientsCost = 0;
  let packagesCost = 0;
  let hasSelectedInputs = false;

  inputs.forEach((input) => {
    const selected = productInputs?.[input.id];
    if (!selected?.isChecked) return;

    hasSelectedInputs = true;

    const formattedAmount = formatAmount(input.amount, input.measurementUnit);
    if (formattedAmount === 0) return;

    const formattedProductionAmount = formatProductionAmount(parseDecimal(selected.amount), selected.unit);
    const cost = (input.price / formattedAmount) * formattedProductionAmount;

    if (input.type === InputType.packaging) packagesCost += cost;
    else ingredientsCost += cost;
  });


  // Custo por porção: custo total da receita dividido pela quantidade de porções que ela rende
  const servingsNumber = parseInt(servings || '', 10) || 0;
  const hasServings = servingsNumber > 0;
  const productionHours = parseProductionTimeInHours(productionTime);
  const recipeOverheadsCost = overheads.reduce((acc, overhead) => acc + productionHours * overhead.costPerHour, 0);

  const perServing = (value: number) => (hasServings ? value / servingsNumber : 0);

  const ingredientsCostPerServing = perServing(ingredientsCost);
  const packagesCostPerServing = perServing(packagesCost);
  const overheadsCostPerServing = perServing(recipeOverheadsCost);

  const totalCost = ingredientsCostPerServing + packagesCostPerServing + overheadsCostPerServing;
  const priceNumber = parseDecimal(price);
  const profit = hasServings && priceNumber > 0 ? priceNumber - totalCost : null;

  return {
    ingredientsCost: ingredientsCostPerServing,
    packagesCost: packagesCostPerServing,
    overheadsCost: overheadsCostPerServing,
    totalCost,
    profit,
    hasSelectedInputs,
    hasServings,
    hasProductionTime: productionHours > 0,
  };
}
