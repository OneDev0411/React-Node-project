import * as Ui from '@material-ui/core'

export type ConfirmRoleStatus = 'Validating' | 'Listing' | 'Upserting' | 'Selecting' | 'Skipped'

export type GCISplitStatus = 'Listing' | 'Inserting' | 'Selecting'

export type RoleType = "Buyer" | "Seller" | "BuyerLawyer" | "SellerLawyer"

export type RemittanceStatus = 'ShowBuy' | 'ShowSell'

export type GCIUnit = "$" | "%" | ""

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
}

export interface AgentData {
    id: IDealRole['id']
    legal_full_name: IDealRole['legal_full_name']
    role: IDealRole['role']
    sharePercent: Number,
    note: string,
}

export interface PaymentsType {
    payment_type: string
    paid_to: string
    company?: string
    company_address?: string
    office?: string
    cell?: string
    fax?: string
    tax_id?: string
    mail?: string
}

export interface RolePaymentsType {
    payment_id: number
    role_id: string
    unit_type: number
    calculated_from: number
}


export interface RemittanceBankWiresType {
    amount: number
}

export interface AppContextApi {
    stagingAmount: number 
    setStagingAmount?: (data: number) => void 
    GCIUnit: GCIUnit
    setGCIUnit?: (GCIUnit: GCIUnit) => void
    GCIValue: Number
    setGCIValue?: (GCIValue: Number) => void
    agentDataList: AgentData[]
    setAgentDataList?: (data: AgentData[]) => void
    testData: string
    setTestData?: (data: string) => void
    reasonValue: Number
    setReasonValue?: (data: Number) => void
    reasonNote: string
    setReasonNote?: (data: string) => void
    checkDataList: CheckData[]
    setCheckDataList?: (data: CheckData[]) => void
    paymentsDataInside: PaymentsType
    setPaymentsDataInside?: (data: PaymentsType) => void
    paymentsDataOutside: PaymentsType
    setPaymentsDataOutside?: (data: PaymentsType) => void
    rolePaymentsDataInside: RolePaymentsType[]
    setRolePaymentsDataInside?: (data: RolePaymentsType[]) => void
    rolePaymentsDataOutside: RolePaymentsType[]
    setRolePaymentsDataOutside?: (data: RolePaymentsType[]) => void
}

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
    cost: number
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
    role: string
}
