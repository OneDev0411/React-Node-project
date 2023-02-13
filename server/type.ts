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
  dealNumber: any;
}
export interface ICombinedDealData {
  commissionData: any;
  dealData: any;
}
export interface IFeeData {
  DealSide: string,
  DealFeeType: string,
  DealFeeCode: string,
  FeeBase: string,
  PercentorAmount: string,
  Amount: number,
  FeeCollectFrom: string,
  AgentId: string,
  CreditToSeller: boolean,
  IncludeInGross: boolean,
  AgentName: string
}