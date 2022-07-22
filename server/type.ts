export interface IDealData {
  deal: string;
  is_finalized: boolean;
  object: string;
}
export interface ICommissionData {
  deal: string;
  object: string;
}
export interface ICombinedData {
  commissionData: string | null;
  dealData: string | null;
}
