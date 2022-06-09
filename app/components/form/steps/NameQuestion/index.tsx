import Ui from '@libs/material-ui'
import React from '@libs/react'

interface Props {
  hooks: EntryProps['hooks']['wizard']
  Wizard: CoreComponents['Wizard']
}

export function NameQuestion({
  Wizard,
  hooks: { useWizardContext, useSectionContext }
}: Props) {
  const [name, setName] = React.useState('')
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const isActiveStep = wizard.currentStep === step

  const handleNext = () => {
    console.log('CALLED!!!!');
    if (!isActiveStep) {
      wizard.goto(step)
  
      return
    }

    wizard.next()
  }

  return (
    <Wizard.QuestionSection>
      <Wizard.QuestionTitle>What's your name?</Wizard.QuestionTitle>
      <Wizard.QuestionForm>
        {/* <Ui.Box> */}
          <Ui.TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <Ui.Box display="flex" justifyContent="flex-end" my={2}>
            <Ui.Button
              variant="contained"
              color="primary"
              disabled={name.trim().length === 0}
              onClick={handleNext}
            >
              {isActiveStep ? 'Continue' : 'Edit'}
            </Ui.Button>
          </Ui.Box>
        {/* </Ui.Box> */}
      </Wizard.QuestionForm>
    </Wizard.QuestionSection>
  )
}
