declare interface IDealChecklist extends IModel<'deal_checklist'> {
  deactivated_at: string | null
  title: string
  deal: UUID
  order: number
  origin: UUID
  terminated_at: string | null
  faired_at: string | null
  is_deactivated: boolean
  is_terminated: boolean
  tasks: UUID[]
  is_deactivatable: boolean
  is_terminatable: boolean
  tab_name: string | null
  checklist_type: string
  is_active_offer: boolean
}
