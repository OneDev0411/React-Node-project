import React from '@libs/react'
import Ui from '@libs/material-ui'
import useApp from "../../../../hooks/useApp"
import { IDealData, IQuestionProps, ITransData } from "../../../../models/type"

const TransCoordinatorEmail: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext }
}) => {
  const { useState, useEffect } = React
  const { TextField, Button, Box } = Ui
  const wizard = useWizardContext()
  const { dealData, setDealData, setCurrentStep, currentStep, transCoordinator, setTransCoordinator } = useApp()
  const { step } = useSectionContext()
  // state
  const [text, setText] = useState<string>(transCoordinator.email_address)
  const [showButton, setShowButton] = useState<boolean>(false)


  const handleChange = (event: any) => {
    setShowButton(true)
    setText(event.target.value)
  }

  const handleClickNext = () => {
    setShowButton(false)
    let updatedTransData: ITransData = transCoordinator
    updatedTransData.email_address = text
    if (setTransCoordinator !== undefined) setTransCoordinator(updatedTransData)
    let updatedDealData: IDealData = dealData
    if (currentStep < step + 1) {}
    setTimeout(() => {
      if (currentStep < step + 1) {
        updatedDealData.current_step = step + 1
        if (setDealData !== undefined) setDealData(updatedDealData)
        if (setCurrentStep !== undefined) setCurrentStep(step + 1)
        wizard.goto(step + 1)
      }
    }, 80);
  }

  useEffect(() => {
    if (transCoordinator.email_address === "") {
      setShowButton(true)
    } else if (transCoordinator.email_address !== "") {
      setShowButton(false)
    }
    setText(transCoordinator.email_address)
  }, [transCoordinator])

  if (transCoordinator.trans_coordinator == "Yes") {
    return (
      <QuestionSection>
        <QuestionTitle>
          Transaction Coordinator Email Address
        </QuestionTitle>
        <QuestionForm>
          <TextField
            size='small'
            label="Transaction Coordinator Email"
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

export default TransCoordinatorEmail
