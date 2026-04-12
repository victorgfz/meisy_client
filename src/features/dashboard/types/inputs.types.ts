export interface Input {
  id: number;
  description: string;
  price: number;
  type: typeof InputType[keyof typeof InputType];
  amount: number;
  measurementUnit: typeof MeasurementUnit[keyof typeof MeasurementUnit];

  createdAt: Date;
  updatedAt: Date;
  companyId: number;
}

export interface RequestRegisterInputJson {
  description: string;
  price: number;
  type: number;
  amount: number;
  measurementUnit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestUpdateInputJson {
  description: string;
  price: number;
  amount: number;
  updatedAt: Date;
}



export const InputType = {
  ingredient: 0,
  packaging: 1,
} as const

export const MeasurementUnit = {
  g: 0,
  kg: 1,
  ml: 2,
  l: 3,
  unit: 4
} as const