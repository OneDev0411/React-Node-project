import * as Ui from '@material-ui/core'

export type ConfirmRoleStatus = 'Validating' | 'Listing' | 'Upserting' | 'Selecting' | 'Skipped'

export type RoleType = "Buyer" | "Seller" | "BuyerLawyer" | "SellerLawyer"

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
}

export interface AppContextApi {
    GCIUnit: GCIUnit
    setGCIUnit?: (GCIUnit: GCIUnit) => void
    // roles: IDealRole[],
    // remove: (id: string) => void,
    // add?: () => void | Promise<void>,
    // test?: () => void,
    // testData: string,
    // update: (role: IDealRole) => void,
}

export interface IQuestionProps {
    hooks: EntryProps['hooks']['wizard']
    models: EntryProps['models']
    api: EntryProps['api']
    Components: EntryProps['Components']
    Wizard: CoreComponents['Wizard']
    roleType?: RoleType
    agentShareInfoList?: Array<any>
    setAgentShareInfoList?: (value: Array<any>) => void
    GCIUnit?: "%" | "$" | ""
    setGCIUnit?: (value: "%" | "$" | "") => void
    GCIValue?: Number,
    setGCIValue?: (value: Number) => void
    utils: {
        notify: (data: NotificationData) => void
        notifyOffice: (comment: string) => Promise<void>
    }
}

export interface IDatePickerProps {
    Picker: CoreComponents['DatePicker']
    value: Date
    setValue: (date: Date) => void
    label: string
}


