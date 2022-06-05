import React from 'react'
import * as Ui from '@material-ui/core'

// export interface RoleContextApi {
//     roles: IDealRole[],
//     // remove: (id: string) => void,
//     add?: (role: IDealRole) => void,
//     test?: () => void,
//     // update: (role: IDealRole) => void,
// }

export type DetailStatus = 'Loading' | 'Validating' | 'Listing' | 'Upserting' | 'Selecting'

export type AttorneyDetailStatus = 'Loading' | 'Selecting' | 'Updating' | 'Inserting' | 'Done' | 'Skipped'

export interface IStepProps {
    models: IEntryModel
    Components: CoreComponents
    notify: (data: NotificationData) => void
    subStep: number
    step: number
    updateStep: (updateData: StepData) => void
    roleType?: "Buyer" | "Seller"
}

export interface IStep1Props {
    Components: CoreComponents
    step: number
}

export interface IUserInfoCardProps {
    roleData: IDealRole
    index: number
    step: 2 | 3 | 4
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

// export interface MockupContactData {
//     userName: string
//     role: string
//     phone: string
//     email: string
// }

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
    roleType: "Buyer" | "Seller"
}

// export interface CardData {
//     userName: string
//     role: string
//     phone: string
//     email: string
// }

export interface DefaultFormData {
    role: number
    firstName: string
    lastName: string
    email: string
    phone: string
    companyTrust: string
    currentAddress: string
}




