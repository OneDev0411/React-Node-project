import {
  SelectData,
  IPaymentData,
  IDealData,
  IRemittanceChecks,
  IPayment,
  IFeeData,
  IFeeType,
} from "./models/type";

export const defaultUser: IUser = {
  last_seen_at: null,
  cover_image_thumbnail_url: null,
  brand: null,
  id: null,
  email_confirmed: true,
  phone_confirmed: true,
  timezone: "",
  active_brand: null,
  agents: null,
  personal_room: null,
  user_type: "Agent",
  first_name: null,
  last_name: null,
  display_name: "",
  email: "",
  phone_number: null,
  is_shadow: false,
  profile_image_url: null,
  cover_image_url: null,
  email_signature: null,
  access_token: "",
  refresh_token: "",
  facebook: undefined,
  twitter: undefined,
  linkedin: undefined,
  youtube: undefined,
  instagram: undefined,
  type: "user",
  created_at: 0,
  updated_at: 0,
};

export const defaultRole: IDealRole = {
  agent: null,
  agent_brokerwolf_id: null,
  brokerwolf_contact_type: null,
  brokerwolf_id: null,
  brokerwolf_row_version: null,
  checklist: [],
  commission_dollar: null,
  commission_percentage: null,
  company_title: "",
  created_at: Number(new Date().getTime()),
  created_by: null,
  deal: "",
  deleted_at: null,
  current_address: null,
  email: "",
  id: null,
  legal_first_name: "",
  legal_full_name: "",
  legal_last_name: "",
  legal_middle_name: null,
  legal_prefix: "",
  mlsid: null,
  phone_number: "",
  role: "Seller",
  role_type: "Person",
  type: "",
  updated_at: Number(new Date().getTime()),
  user: defaultUser,
  brand: null,
};

export const roleText: { [key: string]: string } = {
  Seller: "Seller",
  Buyer: "Buyer",
  BuyerLawyer: "Buyer's attorney",
  SellerLawyer: "Seller's attorney",
  Landlord: "Landlord",
  Tenant: "Tenant",
  TenantPowerOfAttorney: "Tenant Power Of Attorney",
  LandlordPowerOfAttorney: "Landlord Power Of Attorney",
};

export const sortRole = {
  BuyerAgent: 1,
  CoBuyerAgent: 2,
  BuyerReferral: 3,
  SellerAgent: 4,
  CoSellerAgent: 5,
  SellerReferral: 6,
};

export const commissionReason = {
  Approved: 'Approved Commission Reduction',
  CoBroke: 'Co-broke Commission Offered',
  Other: 'Other'
};


export const financeSelectDataList: SelectData[] = [
  {
    label: "Cash Deal",
    value: "Cash Deal",
  },
  {
    label: "Mortgage",
    value: "Mortgage",
  },
];

export const commissionSelectDataList: SelectData[] = [
  {
    label: "By %",
    value: "%",
  },
  {
    label: "By $",
    value: "$",
  },
];

export const stylizeNumber = (data: number): string => {
  return data.toLocaleString("en-US");
};

export const paymentTypeData: IPaymentData[] = [
  {
    groupName: "DE Referral Fee",
    member: [
      "Team Member",
      "DE Agent",
      "DE Relocation",
      "Corporate Referral",
      "Referral Director",
      "Other Fees(inside DE)",
    ],
  },
  {
    groupName: "Outside DE Referral Fee",
    member: [
      "DE Property Management",
      "DE eTeam",
      "Attorney",
      "City Realty",
      "Relocation Company",
      "Outside Referral Broker",
      "Zillow/StreetEasy",
      "Other Fees(Outside DE)",
    ],
  },
  {
    groupName: "Co-Broke",
    member: ["Outside Co-Broke"],
  },
];

export const feeTypeData: IFeeType = {
  feeName: [
    "CORPERATE / ADMIN FEE",
    "MLS FEE",
    "TRANSACTION FEE",
    "OTHER FEE",
    "MTF Fees",
    "BUSINESS",
    "G1- Tax fee",
    "SkyTC fee",
    "Credit given by Agent",
    "Garnishments",
    "Agent incentives"
  ]
}

export const defaultFeeData: IFeeData[] = [
  {
    id: 0,
    deal: "",
    fee_type: "",
    fee_amount: "",
    fee_amount_percentage: "",
    fee_unit: 0,
    fee_method: 0
  }
];

export const defaultRemittanceChecks: IRemittanceChecks[] = [
  {
    id: null,
    deal: "",
    check_num: 0,
    check_date: new Date(),
    check_receive_date: new Date(),
    amount: 0,
    deal_side: "",
  },
];

export const defaultPayment: IPayment[] = [{
  id: null,
  deal: "",
  de_payment_type: "",
  de_paid_to: "",
  de_paid_to_deUserId: "",
  de_paid_by: [],
  de_payment_company: "",
  de_payment_company_address: "",
  de_payment_office: "",
  de_payment_cell: "",
  de_payment_fax: "",
  de_payment_tax_id: "",
  de_payment_mail: "",
  payment_side: "",
  keyIndex: 0,
  de_office_address: ""
}];

export const defaultDealData: IDealData = {
  deal: null,
  gci_de_value: 0,
  gci_reason_select: -1,
  gci_reason: "",
  brokerage_commission: 0,
  stage_cost: 0,
  remittance_buy_side_bank_wire_amount: null,
  remittance_listing_side_bank_wire_amount: null,
  approval_request_date: "",
  status: "",
  submitted: 0,
  current_step: 6,
};

export const APP_URL = "https://apps-de-commission-slip-wahuot5mja-uc.a.run.app";
