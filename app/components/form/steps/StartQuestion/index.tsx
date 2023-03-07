import React from "@libs/react"
import useApp from "../../../../hooks/useApp"
import { IQuestionProps, AppContextApi } from "../../../../models/type"
import Ui from "@libs/material-ui"
import { APP_URL } from "../../../../util"
import axios from "axios"

const StartQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  utils,
  hooks: { useWizardContext },
  models: { deal },
  isFlorida
}) => {
  const { useEffect } = React
  const { QuestionSection, QuestionTitle } = Wizard
  const wizard = useWizardContext()
  const { currentStep, setSubmitted, dealNumber, setDealNumber } = useApp()
  const total_data: AppContextApi = useApp()

  // mockup loading, need to remove after the backend is implemented
  useEffect(() => {
    if (dealNumber.deal === "") {
      let temp = JSON.parse(JSON.stringify(dealNumber))
      temp.deal = deal.id
      if (setDealNumber !== undefined) {
        setDealNumber(temp)
      }
    }
    setTimeout(() => {
      wizard.goto(currentStep)
    }, 80)
  }, [])

  return (
    <QuestionSection>
      <QuestionTitle>
        Awesome🎉 let's get a few questions answered and get you paid.
      </QuestionTitle>
    </QuestionSection>
  )
}

export default StartQuestion
