import React from '@libs/react'
import ReactUse from '@libs/react-use'
import Ui from '@libs/material-ui'
import useApp from "../../../../hooks/useApp"
import { IQuestionProps } from "../../../../models/type"
import { defaultTransData } from '../../../../util'

const TransCoordinatorEmail: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  api: { updateDealContext, getDealContext },
}) => {
  const { useState, useEffect } = React
  const { useDebounce } = ReactUse
  const { TextField, Button, Box } = Ui
  const wizard = useWizardContext()
  const { dealData, setDealData, financing, setCurrentStep, currentStep, transCoordinator, setTransCoordinator } = useApp()
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
    let _defaultTransData = JSON.parse(JSON.stringify(transCoordinator))
    _defaultTransData.email_address = text
    if (setTransCoordinator !== undefined) {
      setTransCoordinator(_defaultTransData)
    }
    let temp = JSON.parse(JSON.stringify(dealData))
    temp.current_step = step + 1
    if (setDealData !== undefined)
      setDealData(temp)
    setTimeout(() => {
      if (wizard.currentStep < step + 1) {
        wizard.goto(step + 1)
        if (setCurrentStep !== undefined) {
          setCurrentStep(step+1)
        }
      }
    }, 80)
  }

  useEffect(() => {
    setShowButton(false)
    setTimeout(() => {
      if (transCoordinator.email_address !== "") {
        if (currentStep > step) {
          wizard.goto(step + 2)
        } else if (currentStep < step) {
          setShowButton(true)
        }
      } else {
        setShowButton(true)
      }
    }, 80)    
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
