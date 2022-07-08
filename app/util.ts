import { SelectData, PaymentType, CheckData, IDealData, IRoleData, IRemittanceChecks } from "./models/type"

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
    user_type: 'Agent',
    first_name: null,
    last_name: null,
    display_name: '',
    email: '',
    phone_number: null,
    is_shadow: false,
    profile_image_url: null,
    cover_image_url: null,
    email_signature: null,
    access_token: '',
    refresh_token: '',
    facebook: undefined,
    twitter: undefined,
    linkedin: undefined,
    youtube: undefined,
    instagram: undefined,
    type: 'user',
    created_at: 0,
    updated_at: 0
}

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
    created_at: Number((new Date()).getTime()),
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
    role_type: 'Person',
    type: "",
    updated_at: Number((new Date()).getTime()),
    user: defaultUser,
    brand: null,
}

export const roleText: { [key: string]: string } = {
    Seller: "Seller",
    Buyer: "Buyer",
    BuyerLawyer: "Buyer's attorney",
    SellerLawyer: "Seller's attorney",
}

export const financeSelectDataList: SelectData[] = [
    {
        label: "Cash Deal",
        value: "Cash Deal",
    },
    {
        label: "Mortgage",
        value: "Mortgage",
    },
]

export const commissionSelectDataList: SelectData[] = [
    {
        label: "By %",
        value: "%",
    },
    {
        label: "By $",
        value: "$",
    },
]

export const stylizeNumber = (data: number): string => {
    return data.toLocaleString("en-US");
}

export const paymentTypeData:PaymentType[] = [
        {
            groupName : "DE Referral Fee",
            member: [

                "Team Member", 
                "DE Agent", 
                "DE Relocation",
                "Corporate Referral",
                "Referral Director",
                "Other Fees(inside DE)"
            ] 
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
                "Other Fees(Outside DE)"
            ]
        },
        {
            groupName: "Co-Broke",
            member: [
                "Outside Co-Broke"
            ]
        }
    ]

// export const defaultPaymentsDataInside: PaymentsType = {
//     payment_type: "Team Member",
//     paid_to: ""
    
// }
// export const defaultPaymentsDataOutside: PaymentsType = {
//     payment_type: "Outside Referral Broker",
//     paid_to: ""
    
// }

export const defaultRemittanceChecks: IRemittanceChecks[] =[
    {
        deal_id: "",
        check_id: 0,
        check_num: 0,
        check_date: new Date(),
        check_receive_date: new Date(),
        amount: 0,
    }
]

export const defaultDealData: IDealData ={
    deal_id: "",
    gci_calculate_type: 0,
    gci_de_value: 0,
    gci_reason_select: -1,
    gci_reason: "",
    stage_cost: 0,
    remittance_bank_wire_amount: 0,
    inside_de_payment_type: "Team Member",
    inside_de_paid_to: "",
    outside_de_payment_type: "Outside Referral Broker",
    outside_de_paid_to: "",
    outside_de_payment_company: "",
    outside_de_payment_company_address: "",
    outside_de_payment_office: "",
    outside_de_payment_cell:"",
    outside_de_payment_fax: "",
    outside_de_payment_tax_id: "",
    outside_de_payment_mail: ""
}


