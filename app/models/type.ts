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
  GCIValue: Number;
  index: number;
  saveData: IDataToConText;
  totalClc: (index: number, data: IRoleData, clcFlag: boolean) => void;
}

export interface IDealData {
  deal_id: string;
  gci_calculate_type: number;
  gci_de_value: number;
  gci_reason_select: number;
  gci_reason: string;
  stage_cost: number;
  remittance_bank_wire_amount: number;
  inside_de_payment_type: string;
  inside_de_paid_to: string;
  outside_de_payment_type: string;
  outside_de_paid_to: string;
  outside_de_payment_company: string;
  outside_de_payment_company_address: string;
  outside_de_payment_office: string;
  outside_de_payment_cell: string;
  outside_de_payment_fax: string;
  outside_de_payment_tax_id: string;
  outside_de_payment_mail: string;
}

export interface IRoleData {
  deal_id: string;
  role_id: IDealRole["id"];
  legal_full_name: IDealRole["legal_full_name"];
  role: IDealRole["role"];
  share_percent: IDealRole["commission_percentage"];
  share_value: IDealRole["commission_dollar"];
  note: string;
  payment_unit_type?: number;
  payment_value?: number;
  payment_calculated_from?: number;
}

export interface IRemittanceChecks {
  deal_id: string;
  check_num: number;
  check_date: Date;
  check_receive_date: Date;
  amount: number;
}

export interface AppContextApi {
  dealData: IDealData;
  setDealData?: (data: IDealData) => void;
  roleData: IRoleData[];
  setRoleData?: (data: IRoleData[]) => void;
  remittanceChecks: IRemittanceChecks[];
  setRemittanceChecks?: (data: IRemittanceChecks[]) => void;
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
    notifyOffice: (comment: string) => Promise<void>;
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
  index: number;
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
  deal_type: string;
  saveData: IDataToConText;
}

export interface IDataToConText {
  next: boolean;
  updateFlag: (flag: boolean) => void;
}
