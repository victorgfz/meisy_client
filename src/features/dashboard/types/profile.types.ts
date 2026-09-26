export interface ProfileCompanyUser {
  id: number;
  name: string;
  quantityOfOrders: number;
  isLoggedUser: boolean;
}

export interface Profile {
  name: string;
  email: string;
  companyCode: string;
  quantityOfOrders: number;
  totalRevenue: number;
  companyUsers: ProfileCompanyUser[];
}
