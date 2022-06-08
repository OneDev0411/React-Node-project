import Ui from '@libs/material-ui'
import React from '@libs/react'

interface Props {
  hooks: EntryProps['hooks']['wizard']
  Wizard: CoreComponents['Wizard']
}

export function AgeQuestion({
  Wizard,
  hooks: { useWizardContext, useSectionContext }
}: Props) {
  const [age, setAge] = React.useState('')
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const isActiveStep = wizard.currentStep === step

  const handleNext = () => {
    wizard.next()
  }

  return (
    <Wizard.QuestionSection>
      <Wizard.QuestionTitle>What's your age?</Wizard.QuestionTitle>
      <Wizard.QuestionForm>
        <Ui.TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your age"
          value={age}
          onChange={e => setAge(e.target.value)}
        />

        <Ui.Box display="flex" justifyContent="flex-end" my={2}>
          {isActiveStep && (
            <Ui.Button
              variant="contained"
              color="primary"
              disabled={age.trim().length === 0}
              onClick={handleNext}
            >
              Continue
            </Ui.Button>
          )}
        </Ui.Box>
      </Wizard.QuestionForm>
    </Wizard.QuestionSection>
  )
}
