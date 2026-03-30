export interface SummaryMetrics {
  balance: number;
  balanceChangePercentage: number;
  totalOrders: number;
  pendingOrders: number;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
