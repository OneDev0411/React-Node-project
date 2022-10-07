export interface IDealData {
  deal: string;
  is_finalized: boolean;
  object: string;
}
export interface ICommissionData {
  dealData: any;
  roleData: any;
  remittanceChecks: any;
  insidePayments: any;
  outsidePayments: any;
  submitted: number;
}
export interface ICombinedDealData {
  commissionData: any;
  dealData: any;
}
