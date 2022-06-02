declare interface Window {
  libs: Record<'React' | 'MaterialUi', any>
}
declare interface CoreComponents {
  Logo: React.FC<LogoProps>
  RoleForm: React.FC<RoleFormProps>
  Wizard: {
    QuestionWizard: React.FC<QuestionWizardProps>
    QuestionSection: React.FC<QuestionSectionProps>
    QuestionTitle: React.FC<QuestionTitleProps>
    QuestionForm: React.FC<QuestionFormProps>
  }
}

declare interface EntryProps {
  models: {
    deal: IDeal
    user: IUser
    attributeDefs: IAttributeDefs
  }
  utils: {
    notify: (data: NotificationData) => void
  }
  api: {
    getDealContext: (filed: string) => IDealContext
    updateDealContext: (field: string, value: unknown) => Promise<void>
  }
  Components: CoreComponents
}
