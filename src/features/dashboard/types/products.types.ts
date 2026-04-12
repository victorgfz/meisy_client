import { MeasurementUnit } from './inputs.types';

export const ProductionMeasurementUnit = {
  g: 0,
  kg: 1,
  ml: 2,
  l: 3,
  unit: 4,
  tsp: 5,
  tbscp: 6,
} as const;

export interface ProductInput {
  inputId: number;
  productionAmount: number;
  productionMeasurementUnit: typeof ProductionMeasurementUnit[keyof typeof ProductionMeasurementUnit];
}

export interface Product {
  id: number;
  description: string;
  price: number;
  amount: number;
  measurementUnit: typeof MeasurementUnit[keyof typeof MeasurementUnit];
  productionTime: string;
  servings: number;
  createdAt: Date;
  updatedAt: Date;
  productInputs: ProductInput[];
  companyId: number;
}

export interface CreateProductFormValues {
  description: string,
  price: number,
  amount: number,
  measurementUnit: number,
  productionTime: string,
  servings: number,
  productInputs: { inputId: number, productionAmount: number, productionMeasurementUnit: number }[],
  createdAt: Date,
  updatedAt: Date
}

export interface ProductDetailInput {
  id: number;
  description: string;
  type: number;
  productionAmount: number;
  productionMeasurementUnit: typeof ProductionMeasurementUnit[keyof typeof ProductionMeasurementUnit];
  productionPrice: number;
}

export interface ProductOverhead {
  id: number;
  type: number;
  totalCost: number;
}

export interface ProductDetail {
  id: number;
  description: string;
  price: number;
  amount: number;
  measurementUnit: typeof MeasurementUnit[keyof typeof MeasurementUnit];
  productionTime: string;
  servings: number;
  updatedAt: Date;
  companyId: number;
  productInputs: ProductDetailInput[];
  productOverheads: ProductOverhead[];
}
