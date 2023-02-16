import React from "@libs/react"
import useApp from "../../../../hooks/useApp"
import { IQuestionProps, AppContextApi } from "../../../../models/type"
import Ui from "@libs/material-ui"
import { APP_URL } from "../../../../util"
import axios from "axios"

const StartQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  utils,
  hooks: { useWizardContext, useSectionContext },
  api: { getDealContext, notifyOffice },
  models: { deal },
  isNevada,
  isFlorida,
  isNYC
}) => {
  const { useEffect } = React
  const { QuestionSection, QuestionTitle } = Wizard
  const wizard = useWizardContext()
  const { currentStep, setCurrentStep, submitted, setSubmitted, transCoordinator, dealNumber } = useApp()
  const isBackOffice = utils.isBackOffice
  const { Box, Button } = Ui
  const total_data: AppContextApi = useApp()
  const {step} = useSectionContext()

  const financingContextValue = deal.property_type.is_lease ? '' : getDealContext('financing')?.text
  const financingProgramContextValue = deal.property_type.is_lease ? '' : getDealContext('financing_program')?.text
  const transCoordinatorValue = transCoordinator.trans_coordinator

  // mockup loading, need to remove after the backend is implemented
  useEffect(() => {
    if (currentStep > step +1) {
      wizard.goto(currentStep+2)
    } else {
      wizard.next()
    }
  }, [])

  const handleSubmit = async () => {
    wizard.setLoading(true)
    const res = await axios.post(
      `${APP_URL}/rechat-commission-app-data-save`,
      {
        data: total_data,
      }
    )
    utils.isReview = true
    if (setSubmitted !== undefined)
      setSubmitted(1)
    if (res.data.message === "successful")
    wizard.setLoading(false)
  }

  return (
    <QuestionSection>
      <QuestionTitle>
          Awesome🎉 let's get a few questions answered and get you paid.
      </QuestionTitle>
      {isBackOffice && (
        <Box style={{ textAlign: "right" }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            style={{
              backgroundColor: "#0fb78d",
              color: "white",
            }}
          >
            Review
          </Button>
        </Box>
      )}
    </QuestionSection>
  )
}

export default StartQuestion
