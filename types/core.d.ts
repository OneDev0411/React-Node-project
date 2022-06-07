declare interface Window {
  libs: Record<'React' | 'MaterialUi', any>
}
declare interface CoreComponents {
  Logo: React.FC<LogoProps>
  RoleForm: React.FC<RoleFormProps>
  RoleCard: React.FC<RoleCardProps>
  ContactRoles: React.FC<ContactRolesProps>
  Wizard: {
    QuestionWizard: React.FC<QuestionWizardProps>
    QuestionSection: React.FC<QuestionSectionProps>
    QuestionTitle: React.FC<QuestionTitleProps>
    QuestionForm: React.FC<QuestionFormProps>
  }
}

declare interface IEntryModel {
  deal: IDeal
  user: IUser
  roles: IDealRole[]
  attributeDefs: IAttributeDefs
}

declare interface EntryProps {
  models: IEntryModel
  utils: {
    notify: (data: NotificationData) => void
  }
  api: {
    getDealContext: (filed: string) => IDealContext
    updateDealContext: (field: string, value: unknown) => Promise<void>
  }
  Components: CoreComponents
}
