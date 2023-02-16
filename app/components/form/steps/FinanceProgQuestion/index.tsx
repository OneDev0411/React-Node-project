import React from '@libs/react'
import ReactUse from '@libs/react-use'
import Ui from '@libs/material-ui'
import useApp from "../../../../hooks/useApp"
import { IQuestionProps } from "../../../../models/type"

const FinanceProgQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  api: { updateDealContext, getDealContext },
}) => {
  const { useState, useEffect } = React
  const { useDebounce } = ReactUse
  const { TextField, Button, Box } = Ui
  const wizard = useWizardContext()
  const { dealData, setDealData, financing, currentStep, setCurrentStep } = useApp()
  const { step } = useSectionContext()

  const financingProgramContextValue = getDealContext('financing_program')?.text

  // state
  const [text, setText] = useState<string>(financingProgramContextValue)
  const [showButton, setShowButton] = useState<boolean>(financingProgramContextValue === undefined ? true : false)

  const handleChange = (event: any) => {
    setShowButton(true)
    setText(event.target.value)
  }

  const handleClickNext = () => {
    updateDealContext("financing_program", text)
    setShowButton(false)
    if (wizard.currentStep < step + 1) {
      setTimeout(() => {
        wizard.next()
        let temp = JSON.parse(JSON.stringify(dealData))
        temp.current_step = step + 1
        if (setDealData !== undefined)
          setDealData(temp)
        if (setCurrentStep !== undefined) {
          setCurrentStep(step+1)
        }
      }, 80)
    }
  }

  useEffect(() => {
    if (currentStep > step)
      setShowButton(false)
    else
      setShowButton(true)
  }, [])

  if (financing == "Mortgage") {
    return (
      <QuestionSection>
        <QuestionTitle>
          What is the financing program?
        </QuestionTitle>
        <QuestionForm>
          <TextField
            size='small'
            label="Financing Program"
            style={{ width: '100%' }}
            onChange={handleChange}
            value={text}
          />
          {showButton && (
            <Box style={{ textAlign: 'right', marginTop: 20, paddingBottom: 20 }}>
              <Button variant="contained" disabled={!text?.length} onClick={handleClickNext} style={text?.length ? { backgroundColor: '#0fb78d', color: 'white' } : {}}>
                Looks good, Next
              </Button>
            </Box>
          )}
        </QuestionForm>
      </QuestionSection>
    )
  }
  else {
    return (
      <></>
    )
  }
}

export default FinanceProgQuestion
