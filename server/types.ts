export interface envType {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: string;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
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
  role_id: string;
  legal_full_name: string;
  role: string;
  share_percent: number;
  share_value: number;
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
