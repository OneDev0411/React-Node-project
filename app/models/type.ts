import React from 'react'
import * as Ui from '@material-ui/core'

export type ConfirmContactStatus = 'Validating' | 'Listing' | 'Upserting' | 'Selecting' | 'Skipped'

export type AttorneyDetailStatus = 'Loading' | 'Selecting' | 'Updating' | 'Inserting' | 'Done' | 'Skipped'

export type RoleType = "Buyer" | "Seller" | "BuyerPowerOfAttorney" | "SellerPowerOfAttorney"

export interface SelectData {
    label: string,
    value: string,
}

export interface IStepProps {
    // models: IEntryModel
    models: {
        deal: IDeal
        user: IUser
        roles: IDealRole[]
        attributeDefs: IAttributeDefs
    }
    Components: CoreComponents
    notify: (data: NotificationData) => void
    subStep: number
    step: number
    updateStep: (updateData: StepData) => void
    roleType?: RoleType
    api: {
        getDealContext: (filed: string) => IDealContext
        updateDealContext: (field: string, value: unknown) => Promise<void>
    }
    GCIUnit?: string
    setGCIUnit?: (value: string) => void
}

export interface ISelectFromTwo {
    // models: IEntryModel
    models: {
        deal: IDeal
        user: IUser
        roles: IDealRole[]
        attributeDefs: IAttributeDefs
    }
    Components: CoreComponents
    notify: (data: NotificationData) => void
    subStep: number
    step: number
    api: {
        getDealContext: (filed: string) => IDealContext
        updateDealContext: (field: string, value: unknown) => Promise<void>
    }
    updateStep: (updateData: StepData) => void
}

export interface IStep1Props {
    Components: CoreComponents
    step: number
}

export interface IUserInfoCardProps {
    roleData: IDealRole
    index: number
    step: 2 | 3 | 4 | 5
    handleClickEditButton: (index: number) => void
    showEditButton?: boolean
}

export interface IContactCardProps {
    contactData: IDealRole
    index: number
    onClickCard: (index: number) => void
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

export interface IUserInfoFormProps {
    Ui: typeof Ui
    React: typeof React
    handleClickButton: () => void
    defaultFormData: DefaultFormData
}

export interface StepData {
    step?: number
    subStep?: number
}

export interface IDropdownSelectProps {
    onSelect: (contactData: IDealRole) => void
    onInsert: (inputStr: string) => void
    roleType: RoleType
}

export interface DefaultFormData {
    role: number
    firstName: string
    lastName: string
    email: string
    phone: string
    companyTrust: string
    currentAddress: string
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




