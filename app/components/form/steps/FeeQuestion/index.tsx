import React from "@libs/react"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { IQuestionProps } from "../../../../models/type"
import FeeQuestionComponent from "./item"

const FeeQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  models: { deal },
}) => {
  const { useState, useEffect } = React
  const { Box, Button } = Ui
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { dealData, setDealData, submitted, currentStep, setCurrentStep, feeData } = useApp()

  const [showButton, setShowButton] = useState<boolean>(true)

  useEffect(() => {
    if (submitted === 1 || currentStep > step)
      setShowButton(false)
    else
      setShowButton(true)
  }, [])

  const handleClickNextButton = () => {
    setShowButton(false)
    let temp = JSON.parse(JSON.stringify(dealData))
    temp.current_step = step + 1
    if (setDealData !== undefined)
      setDealData(temp)
    setTimeout(() => {
      if (wizard.currentStep < step + 1) {
        wizard.next()
        if (setCurrentStep !== undefined) {
          setCurrentStep(step+1)
        }
      }
    }, 80)
  }

  const updateFlag = (flag: boolean) => {
    setShowButton(flag)
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        Please input Fee info.
      </QuestionTitle>
      <QuestionForm width="60%">
        <FeeQuestionComponent
          feeData={feeData}
          deal={deal.id}
          saveData={{ updateFlag }}
        />
        {showButton && (
          <Box
            style={{
              textAlign: "right",
              marginTop: "20px",
              paddingBottom: "20px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleClickNextButton}
              style={{
                marginBottom: 20,
                backgroundColor: "#0fb78d",
                color: "white",
              }}
            >
              Looks good, Next
            </Button>
          </Box>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

export default FeeQuestion
