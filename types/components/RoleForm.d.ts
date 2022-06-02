declare interface RoleFormProps {
  isOpen?: boolean
  title?: string
  deal: IDeal
  checklist?: IDealChecklist
  form?: object
  defaultRole?: IDealRole
  allowedRoles?: string[]
  isRoleRemovable?: boolean
  isCommissionRequired?: boolean
  showBrokerageFields?: boolean
  compact?: boolean
  showSaveContactButton?: boolean
  dealSide?: 'Buying' | 'Selling'
  onBeforeUpsert?: () => Promise<void>
  onUpsertRole?: () => Promise<void>
  onDeleteRole?: () => Promise<void>
  onClose?: () => void
}
