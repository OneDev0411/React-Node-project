import * as Ui from "@material-ui/core";

export type ConfirmRoleStatus =
  | "Validating"
  | "Listing"
  | "Upserting"
  | "Selecting"
  | "Skipped";

export type GCISplitStatus = "Listing" | "Inserting" | "Selecting";

export type RoleType = "Buyer" | "Seller" | "BuyerLawyer" | "SellerLawyer" | "Tenant" | "Landlord" | "TenantPowerOfAttorney" | "LandlordPowerOfAttorney";

export type RemittanceStatus = "ShowBuy" | "ShowSell";

export type GCIUnit = "$" | "%" | "";

export type DealType = "Buying" | "Selling" | "Both";

export interface SelectData {
  label: string;
  value: string;
}

export interface IGCIInfoItemProps {
  Ui: typeof Ui;
  // itemData: ItemData
  price: Number;
  index: number;
  saveData: IDataToConText;
  totalClc: (index: number, data: IRoleData, clcFlag: boolean) => void;
  role: IRoleData;
  updateData: (role: IRoleData) => void;
}

export interface IDealData {
  deal: string | null;
  gci_de_value: number;
  gci_reason_select: number;
  gci_reason: string;
  brokerage_commission: number;
  stage_cost: number;
  remittance_buy_side_bank_wire_amount: number | null;
  remittance_listing_side_bank_wire_amount: number | null;
  approval_request_date: string;
  status: string;
  submitted: number; // -1: unsubmitted or submit failed, 1: submitted, 2: should be submitted again
  current_step: number;
}

export interface IRoleData {
  deal: string;
  role_id: IDealRole["id"];
  user_id: string | null;
  agent_id: string | null; // d365AgentId
  legal_full_name: IDealRole["legal_full_name"];
  role: IDealRole["role"];
  share_percent: IDealRole["commission_percentage"];
  share_value: IDealRole["commission_dollar"];
  note: string;
  address: string
}

export interface IRemittanceChecks {
  id: number | null;
  deal: string;
  check_num: number;
  check_date: Date;
  check_receive_date: Date;
  amount: number;
  deal_side: string;
}

export interface IChecksItemProps {
  checkData: IRemittanceChecks;
  id: number;
  length: number;
  dayPicker: React.FC<DatePickerProps>;
  removeCheckData: (item: number) => void;
  updateCheckData: (id: number, key: keyof IRemittanceChecks, value: IRemittanceChecks[typeof key]) => void
}

export interface IPaidByData {
  roleId: IDealRole["id"],
  role: string,
  payment_by_name: string;
  payment_unit_type?: number | null;
  payment_value?: number | null;
  payment_calculated_from?: number | null;
  payment_note?: string;
}

export interface IPayment {
  id: number | null;
  deal: string;
  de_payment_type: string;
  de_paid_to: string;
  de_paid_to_deUserId: string;
  de_paid_by: IPaidByData[];
  de_payment_company: string;
  de_payment_company_address: string;
  de_payment_office: string;
  de_payment_cell: string;
  de_payment_fax: string;
  de_payment_tax_id: string;
  de_payment_mail: string;
  payment_side: string;
  keyIndex: number;
  de_office_address: string;
}

export interface AppContextApi {
  dealData: IDealData;
  setDealData?: (data: IDealData) => void;
  roleData: IRoleData[];
  setRoleData?: (data: IRoleData[]) => void;
  remittanceChecks: IRemittanceChecks[];
  setRemittanceChecks?: (data: IRemittanceChecks[]) => void;
  insidePayments: IPayment[];
  setInsidePayments?: (data: IPayment[]) => void;
  outsidePayments: IPayment[];
  setOutsidePayments?: (data: IPayment[]) => void;
  submitted: number;
  setSubmitted?: (data: number) => void;
  financing: string;
  setFinancing?: (data: string) => void;
  currentStep: number;
  setCurrentStep?: (data: number) => void;
  feeData: IFeeData[];
  setFeeData?: (data: IFeeData[]) => void;
  dealNumber: IDealNumberData;
  setDealNumber?: (data: IDealNumberData) => void;
}

export interface IQuestionProps {
  hooks: EntryProps["hooks"]["wizard"];
  models: EntryProps["models"];
  api: EntryProps["api"];
  Components: EntryProps["Components"];
  Wizard: CoreComponents["Wizard"];
  roleType?: RoleType;
  utils: {
    notify: (data: NotificationData) => void;
    // notifyOffice: (comment: string) => Promise<void>;
    isBackOffice: boolean;
    isReview: boolean;
  };
  isNYC: boolean;
}

export interface IDatePickerProps {
  Picker: CoreComponents["DatePicker"];
  value: Date;
  setValue: (date: Date) => void;
  label?: string;
}

export interface IPaidByCardProps {
  Ui: typeof Ui;
  saveData: IDataToConText;
  payment: IPayment;
  paymentIndex: number;
  updatePayment: (payment: IPayment, index: number) => void;
  index: number;
  paymentSide: string;
}

export interface IPaidByInfoCardProps {
  Ui: typeof Ui;
  paidByData: IPaidByData;
}

export interface CheckData {
  number: number;
  date: Date;
  receiveDate: Date;
  amount: number;
}

export interface IPaymentData {
  groupName: string;
  member: string[];
}

export interface IFeeType {
  feeName: string[];
}

export interface IFeeData {
  id: number | null;
  deal: string;
  deal_side: number;
  fee_type: string;
  fee_amount: string;
  fee_amount_percentage: string;
  fee_from: number;
  fee_paid: number;
  fee_unit: number;
  fee_method: number;
  key_Index: number;
  agent_name: string;
}

export interface IDealNumberData {
  deal: string;
  deal_number: string;
}

export interface FeeQuestionProps {
  saveData: IDataToConText;
  Components: CoreComponents;
  dealType: IDeal["deal_type"];
  tempFeeData: IFeeData[];
  handleClickRemoveFee: (id: number) => void;
  handleClickAddAnotherButton: () => void;
  updateFeeData: (item: IFeeData, id: number) => void;
}

export interface FeeItemProps {
  item: IFeeData;
  id: number;
  length: number;
  handleClickRemoveFee: (id: number) => void;
  updateData: (item: IFeeData, id: number) => void;
  Components: CoreComponents;
  dealType: IDeal["deal_type"];
}

export interface IPaymentQuestionData {
  range: string;
  dealType: string;
  dealId: string;
  saveData: IDataToConText;
  components: EntryProps["Components"];
  paymentSide: string
}

export interface IDataToConText {
  updateFlag: (flag: boolean) => void;
}
