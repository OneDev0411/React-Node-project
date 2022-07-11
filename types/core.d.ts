declare type Optional<T> = T | undefined;
declare interface Window {
  libs: Record<"React" | "MaterialUi", any>;
}
declare interface CoreComponents {
  Logo: React.FC<LogoProps>;
  RoleForm: React.FC<RoleFormProps>;
  RoleCard: React.FC<RoleCardProps>;
  ContactRoles: React.FC<ContactRolesProps>;
  DatePicker: React.FC<DatePickerProps>;
  Wizard: {
    QuestionWizard: React.FC<QuestionWizardProps>;
    QuestionSection: React.FC<QuestionSectionProps>;
    QuestionTitle: React.FC<QuestionTitleProps>;
    QuestionForm: React.FC<QuestionFormProps>;
  };
}

declare interface EntryProps {
  models: {
    deal: IDeal;
    user: IUser;
    roles: IDealRole[];
    attributeDefs: IAttributeDefs;
  };
  utils: {
    notify: (data: NotificationData) => void;
    notifyOffice: (comment: string) => Promise<void>;
  };
  api: {
    getDealContext: (field: string) => IDealContext;
    updateDealContext: (field: string, value: unknown) => Promise<void>;
    deleteRole: (roleModel: IDealRole) => Promise<void>;
  };
  hooks: {
    wizard: {
      useSectionContext: () => IWizardSectionState;
      useWizardContext: () => IWizardState;
      useSectionErrorContext: () => Optional<string>;
    };
  };
  Components: CoreComponents;
}
