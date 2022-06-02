import React from 'react'
import * as Ui from '@material-ui/core'

export interface RoleContextApi {
    roles: IDealRole[],
    // remove: (id: string) => void,
    add?: (role: IDealRole) => void,
    test?: () => void,
    // update: (role: IDealRole) => void,
}

export type DetailStatus = 'Loading' | 'Editing' | 'Showing'

export interface IStepProps {
    React: typeof React
    Ui: typeof Ui
    models: {
        deal: IDeal
        user: IUser
        attributeDefs: IAttributeDefs
    }
    Components: CoreComponents
    notify: (data: NotificationData) => void
    subStep: number
    step: number
    updateStep: (updateData: StepData) => void
}

export interface IStep1Props {
    Ui: typeof Ui
    Components: CoreComponents
    step: number
}

export interface IUserInfoCardProps {
    Ui: typeof Ui
    cardData: CardData
    step: 2 | 3 | 4
}

export interface IGCIInfoItemProps {
    Ui: typeof Ui
    itemData: ItemData
}

export interface ItemData {
    name: string;
    role: string;
    share: string;
    share2: string;
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

export interface CardData {
    userName: string
    role: string
    phone: string
    email: string
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




