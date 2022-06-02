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
