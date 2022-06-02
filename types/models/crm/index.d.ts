declare interface IContactAttributeDef {
  id: UUID
  name: string | null
  label: string
  data_type: 'number' | 'text' | 'date'
  section: string
  global: boolean
  show: boolean
  editable: boolean
  singular: boolean
  searchable: boolean
  required: boolean
  has_label: boolean
  labels: string[] | null
  enum_values: string[] | null
  user: UUID | null
  brand: UUID | null
}

declare interface IAttributeDefs {
  byId: Record<UUID, IContactAttributeDef>
  byName: Record<string, UUID>
  bySection: Record<string, UUID[]>
}