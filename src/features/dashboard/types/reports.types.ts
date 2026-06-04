export interface BestSellingProductReport {
  description: string;
  total: number;
  totalRevenue: number;
}

export interface CurrentMonthReport {
  quantityOfOrders: number;
  quantityOfOrdersVariationRate: number;
  quantityOfCompletedOrders: number;
  totalRevenue: number;
  totalRevenueVariationRate: number;
  totalCosts: number;
  totalCostsVariationRate: number;
  totalProfit: number;
  totalProfitVariationRate: number;
  bestSellingProducts: BestSellingProductReport[];
}

export interface PreviousMonthReport {
  quantityOfOrders: number;
  quantityOfCompletedOrders: number;
  totalRevenue: number;
  totalRevenueVariationRate: number;
  totalCosts: number;
  totalCostsVariationRate: number;
  totalProfit: number;
  totalProfitVariationRate: number;
}

export interface AllReports {
  currentMonth: CurrentMonthReport;
  previousMonths: PreviousMonthReport[];
}
