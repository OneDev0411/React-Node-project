declare type IDealType = 'Selling' | 'Buying'

declare type IDealVisibility = 'draft' | 'visible'
declare type IDealEnderType = 'AgentDoubleEnder' | 'OfficeDoubleEnder' | null
declare type IDealChecklistType = 'Selling' | 'Buying' | 'Offer'

type IDealAssociations = 'roles' | 'listing' | 'listing_info'

declare interface IDeal<A extends IDealAssociations = ''>
  extends IModel<'deal'> {
  title: string
  deal_type: 'Selling' | 'Buying'
  checklists: IDealChecklist[]
  tasks: IDealTask[]
  roles: A extends 'roles' ? IDealRole[] : UUID[]
  listing: A extends 'listing' ? IListing : UUID
  listing_info: A extends 'listing_info' ? IListing : never
  files: IFile[] | null
  inboxes: string[] | null
  attention_requests: number
  attention_requested_at: number
  has_active_offer: boolean
  is_draft: boolean
  email: string
  created_by: IUsed
  brand: IBrand
  property_type: IDealPropertyType
  faired_at: number
  context: Record<string, IDealContext>
  new_notifications: IChatMessage[] | null
}

declare interface IDealList {
  [key: UUID]: IDeal
}

declare interface IDealForm extends IModel<'form'> {
  brand: UUID | null
  name: string
  fields: null | any // FIXME
  formstack_id: null | string // ?
}

declare interface IDealRole {
  agent: IAgent | null
  agent_brokerwolf_id: string | null
  brokerwolf_contact_type: string | null
  brokerwolf_id: string | null
  brokerwolf_row_version: string | null
  checklist: UUID
  commission_dollar: number | null
  commission_percentage: number | null
  company_title: string
  created_at: number
  created_by: UUID
  deal: UUID
  deleted_at: number | null
  current_address: string | null
  email: string
  id: UUID
  legal_first_name: string
  legal_full_name: string
  legal_last_name: string
  legal_middle_name: string | null
  legal_prefix: string
  mlsid: string | null
  phone_number: string
  role: IDealRoleType
  role_type: 'Person' | 'Company'
  type: string
  office_phone?: string | null
  office_email?: string | null
  office_fax?: string | null
  office_license_number?: string | null
  office_mls_id?: string | null
  office_name?: string | null
  office_address?: string | null
  updated_at: number
  user: IUser
  brand: UUID | null
}

declare type IDealFormRole = IDealRole & {
  id: number | string
  brand?: UUID | null
  agents: Nullable<IAgent[]>
  contact?: IContact
  current_address: Address | string | null
}
