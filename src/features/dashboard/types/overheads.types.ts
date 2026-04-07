export interface Overhead {
  id: number;
  type: typeof OverheadType[keyof typeof OverheadType];
  costPerHour: number;
  createdAt: Date;
  updatedAt: Date;
}

export const OverheadType = {
  Electricity: 0,
  Labor: 1,
  Gas: 2,
  Maintenance: 3,
} as const;

export interface RequestRegisterOverheadJson {
  type: typeof OverheadType[keyof typeof OverheadType];
  costPerHour: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface RequestUpdateOverheadJson {
  costPerHour: number;
  updatedAt: Date;

}
