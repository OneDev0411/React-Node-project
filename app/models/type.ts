import * as Ui from "@material-ui/core";

export type ConfirmRoleStatus =
  | "Validating"
  | "Listing"
  | "Upserting"
  | "Selecting"
  | "Skipped";

export type GCISplitStatus = "Listing" | "Inserting" | "Selecting";

export type RoleType = "Buyer" | "Seller" | "BuyerLawyer" | "SellerLawyer";

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
  salesPrice: Number;
  index: number;
  saveData: IDataToConText;
  totalClc: (index: number, data: IRoleData, clcFlag: boolean) => void;
  role: IRoleData;
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
  submitted: number;
  current_step: number;
}

export interface IRoleData {
  deal: string;
  role_id: IDealRole["id"];
  legal_full_name: IDealRole["legal_full_name"];
  role: IDealRole["role"];
  share_percent: IDealRole["commission_percentage"];
  share_value: IDealRole["commission_dollar"];
  note: string;
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
  inside_de_payment_type: string;
  inside_de_paid_to: string;
  inside_de_paid_by: IPaidByData[];
  outside_de_payment_type: string;
  outside_de_paid_to: string;
  outside_de_paid_by: IPaidByData[];
  outside_de_payment_company: string;
  outside_de_payment_company_address: string;
  outside_de_payment_office: string;
  outside_de_payment_cell: string;
  outside_de_payment_fax: string;
  outside_de_payment_tax_id: string;
  outside_de_payment_mail: string;
}

export interface AppContextApi {
  dealData: IDealData;
  setDealData?: (data: IDealData) => void;
  roleData: IRoleData[];
  setRoleData?: (data: IRoleData[]) => void;
  remittanceChecks: IRemittanceChecks[];
  setRemittanceChecks?: (data: IRemittanceChecks[]) => void;
  payments: IPayment[];
  setPayments?: (data: IPayment[]) => void;
  submitted: number;
  setSubmitted?: (data: number) => void;
  financing: string;
  setFinancing?: (data: string) => void;
  currentStep: number;
  setCurrentStep?: (data: number) => void;
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
  };
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
  range: string;
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

export interface IPaymentQuestionData {
  range: string;
  dealType: string;
  dealId: string;
  saveData: IDataToConText;
  components: EntryProps["Components"];
}

export interface IDataToConText {
  updateFlag: (flag: boolean) => void;
}
