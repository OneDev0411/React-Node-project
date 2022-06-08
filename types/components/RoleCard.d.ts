declare interface RoleCardProps {
  role: IDealRole | IDealFormRole
  readonly?: boolean
  onClickEdit?: () => void
  onClickRemove?: (() => void) | (() => Promise<void>)
}
