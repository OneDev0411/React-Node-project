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
  feeData: any;
}
export interface ICombinedDealData {
  commissionData: any;
  dealData: any;
}
