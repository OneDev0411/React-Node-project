declare type IContextSection = 'Listing' | 'CDA' | 'Dates' | null
declare type IContextSource = 'Provided' | 'MLS' | null
declare type IContextDataType = 'Text' | 'Date' | 'Number' | null
declare type IContextFormat = 'Currency' | null
declare type IContextCondition = IDealType | IDealPropertyType

declare interface IDealBrandContext extends IModel<'brand_context'> {
  brand: UUID
  data_type: 'Number' | 'Date' | 'Text'
  default_value: Nullable<string | number>
  exports: boolean
  format: Nullable<string>
  key: string
  label: string
  needs_approval: boolean
  order: number
  preffered_source: 'Provided' | 'MLS' | null
  section: string
  short_label: string
  triggers_brokerwolf: boolean
}

declare interface IDealBrandContextChecklist {
  checklist: UUID
  is_required: boolean | null
}

declare interface IDealContext extends IModel<'deal_context_item'> {
  approved_at: string | null
  approved_by: UUID | null
  checklist: UUID
  created_by: UUID
  data_type: string
  date: number | null
  deal: UUID
  definition: UUID
  id: UUID
  key: string
  number: number
  searchable: string
  source: string
  text: string
}
