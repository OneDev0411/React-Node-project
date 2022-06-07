declare interface ContactRolesProps {
  source?: 'MLS' | 'CRM'
  placeholder: string
  onSelectRole: (role: Partial<IDealFormRole>) => void
}
