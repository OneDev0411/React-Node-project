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
  const { dealData, setDealData, financing, setCurrentStep, transCoordinator, setTransCoordinator } = useApp()
  const { step } = useSectionContext()
  // state
  const [text, setText] = useState<string>(transCoordinator.email_address)
  const [showButton, setShowButton] = useState<boolean>(false)

  useDebounce(
    () => {
      if (text !== "") {
        setShowButton(true)
        updateDealContext("financing_program", text)
      }
    },
    500,
    [text]
  )

  const handleChange = (event: any) => {
    setText(event.target.value)
    let _defaultTransData = JSON.parse(JSON.stringify(transCoordinator))
    _defaultTransData.email_address = event.target.value
    if (setTransCoordinator !== undefined) {
      setTransCoordinator(_defaultTransData)
    }
  }

  const handleClickNext = () => {
    setShowButton(false)
    if (wizard.currentStep < step + 1) {
      setTimeout(() => {
        wizard.next()
      }, 80)
    }
  }

  useEffect(() => {
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
