import * as Ui from '@material-ui/core'

export type ConfirmRoleStatus = 'Validating' | 'Listing' | 'Upserting' | 'Selecting' | 'Skipped'

export type RoleType = "Buyer" | "Seller" | "BuyerPowerOfAttorney" | "SellerPowerOfAttorney"

export interface SelectData {
    label: string,
    value: string,
}

export interface IGCIInfoItemProps {
    Ui: typeof Ui
    itemData: ItemData
}

export interface ItemData {
    name: string
    role: string
    share: string
    share2: string
}

export interface IQuestionProps {
    hooks: EntryProps['hooks']['wizard']
    models: EntryProps['models']
    api: EntryProps['api']
    Components: EntryProps['Components']
    Wizard: CoreComponents['Wizard']
    roleType?: RoleType
    GCIUnit?: string
    setGCIUnit?: (value: string) => void
}

export interface IDatePickerProps {
    Picker: CoreComponents['DatePicker']
    value: Date
    setValue: (date: Date) => void
    label: string
}


