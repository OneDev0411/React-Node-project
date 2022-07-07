import * as Ui from '@material-ui/core'

export type ConfirmRoleStatus = 'Validating' | 'Listing' | 'Upserting' | 'Selecting' | 'Skipped'

export type GCISplitStatus = 'Listing' | 'Inserting' | 'Selecting'

export type RoleType = "Buyer" | "Seller" | "BuyerLawyer" | "SellerLawyer"

export type RemittanceStatus = 'ShowBuy' | 'ShowSell'

export type GCIUnit = "$" | "%" | ""

export type DealType = "Buying" | "Selling" | "Both"

export interface SelectData {
    label: string,
    value: string,
}

export interface IGCIInfoItemProps {
    Ui: typeof Ui
    // itemData: ItemData
    role: IDealRole
    GCIValue: Number
    index: number
    next: boolean
    getData: (data: IRoleData) => void
    updateFlag: (flag: boolean) => void
}

// export interface AgentData {
//     id: IDealRole['id']
//     legal_full_name: IDealRole['legal_full_name']
//     role: IDealRole['role']
//     sharePercent: Number,
//     note: string,
// }

// export interface PaymentsType {
//     payment_type: string
//     paid_to: string
//     company?: string
//     company_address?: string
//     office?: string
//     cell?: string
//     fax?: string
//     tax_id?: string
//     mail?: string
// }

// export interface RolePaymentsType {
//     role_id: string
//     unit_type: number
//     calculated_from: number
//     valuePercent: number
//     value: number
// }

export interface IDealData {
    deal_id: string
    gci_calculate_type: number
    gci_de_value: number
    gci_reason_select: number
    gci_reason: string
    stage_cost: number
    remittance_bank_wire_amount: number
    inside_de_payment_type: string
    inside_de_paid_to: string
    outside_de_payment_type: string
    outside_de_paid_to: string
    outside_de_payment_company: string
    outside_de_payment_company_address: string
    outside_de_payment_office: string
    outside_de_payment_cell:string
    outside_de_payment_fax: string
    outside_de_payment_tax_id: string
    outside_de_payment_mail: string
}

export interface IRoleData {
    deal_id: string
    role_id: IDealRole['id']
    legal_full_name: IDealRole['legal_full_name']
    role: IDealRole['role']
    share_percent: number
    share_value: number
    note: string
    payment_unit_type?: number
    payment_value?: number
    payment_calculated_from?: number
}

export interface IRemittanceChecks {
    deal_id: string
    check_id: number
    check_num: number
    check_date: Date
    check_receive_date: Date
    amount: number
}

export interface AppContextApi {
    dealData: IDealData
    setDealData?: (data: IDealData) => void
    roleData: IRoleData[]
    setRoleData?: (data: IRoleData[]) => void 
    remittanceChecks: IRemittanceChecks[]
    setRemittanceChecks? : (data: IRemittanceChecks[]) => void
}


// export interface AppContextApi {
//     stagingAmount: number 
//     setStagingAmount?: (data: number) => void 
//     remittanceBankWireAmount: number
//     setRemittanceBankWireAmount?: (data: number) => void
//     GCIUnit: GCIUnit
//     setGCIUnit?: (GCIUnit: GCIUnit) => void
//     GCIValue: Number
//     setGCIValue?: (GCIValue: Number) => void
//     agentDataList: AgentData[]
//     setAgentDataList?: (data: AgentData[]) => void
//     testData: string
//     setTestData?: (data: string) => void
//     reasonValue: Number
//     setReasonValue?: (data: Number) => void
//     reasonNote: string
//     setReasonNote?: (data: string) => void
//     checkDataList: CheckData[]
//     setCheckDataList?: (data: CheckData[]) => void
//     paymentsDataInside: PaymentsType
//     setPaymentsDataInside?: (data: PaymentsType) => void
//     paymentsDataOutside: PaymentsType
//     setPaymentsDataOutside?: (data: PaymentsType) => void
//     rolePaymentsDataInside: RolePaymentsType[]
//     setRolePaymentsDataInside?: (data: RolePaymentsType[]) => void
//     rolePaymentsDataOutside: RolePaymentsType[]
//     setRolePaymentsDataOutside?: (data: RolePaymentsType[]) => void
// }

export interface IQuestionProps {
    hooks: EntryProps['hooks']['wizard']
    models: EntryProps['models']
    api: EntryProps['api']
    Components: EntryProps['Components']
    Wizard: CoreComponents['Wizard']
    roleType?: RoleType
    utils: {
        notify: (data: NotificationData) => void
        notifyOffice: (comment: string) => Promise<void>
    }
}

export interface IDatePickerProps {
    Picker: CoreComponents['DatePicker']
    value: Date
    setValue: (date: Date) => void
    label?: string
}

export interface IPaidByCardProps {
    ui: typeof Ui
    name: string
    range: string
    index: number
    note: string
    next: boolean
    getData: (data: IRoleData) => void
    updateFlag: (flag: boolean) => void
}

export interface CheckData {
    number: number
    date: Date
    receiveDate: Date
    amount: number
}

export interface PaymentType {
    groupName: string
    member: string[] 
}

export interface IPaymentQuestionDataType {
    range: string
    next: boolean
    deal_type: string
    updateFlag: (flag: boolean) => void
}
