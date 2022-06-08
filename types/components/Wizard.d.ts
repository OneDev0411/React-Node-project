declare interface QuestionWizardProps {
  children: boolean | React.ReactNode | React.FC
  defaultStep?: number
  concurrent?: boolean
  useWindowScrollbar?: boolean
  questionPositionOffset?: number
  styles?: React.CSSProperties
  onStepChange?: (step: number) => void
  onFinish?: () => void | Promise<void>
}

declare interface QuestionSectionProps {
  children: React.ReactNode | React.FC
  hidden?: boolean
  error?: string
  displayError?: boolean
}

declare interface QuestionTitleProps {
  children: React.ReactNode | React.FC
  style?: CSSProperties
}

declare interface QuestionFormProps {
  children:
    | React.ReactNode
    | React.FC
    | ((data: { wizard: IWizardState }) => React.ReactNode)
  width?: string
  containerProps?: BoxProps
}

declare interface IWizardState {
  currentStep: number
  lastVisitedStep: number
  totalSteps: number
  isLoading: boolean
  goto: (step: number) => void
  next: (delay?: number) => void
  setStep: (step: number) => void
  setCurrentStep: (step: number) => void
  setLastVisitedStep: (step: number) => void
  setLoading: (status: boolean) => void
  previous: () => void
  first: () => void
  last: () => void
}

declare interface IWizardSectionState {
  step: number
}
