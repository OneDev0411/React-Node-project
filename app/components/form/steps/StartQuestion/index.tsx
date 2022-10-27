import React from "@libs/react"
import useApp from "../../../../hooks/useApp"
import { IQuestionProps } from "../../../../models/type"

const StartQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  hooks: { useWizardContext },
  api: { getDealContext },
  models: { roles },
}) => {
  const { useEffect } = React
  const { QuestionSection, QuestionTitle } = Wizard
  const wizard = useWizardContext()
  const { currentStep, submitted } = useApp()
  
  const seller = roles.filter((role: IDealRole) => role.role === "Seller")
  const buyer = roles.filter((role: IDealRole) => role.role === "Buyer")
  const buyerLawyer = roles.filter((role: IDealRole) => role.role === "BuyerLawyer")
  const sellerLawyer = roles.filter((role: IDealRole) => role.role === "SellerLawyer")
  const financingContextValue = getDealContext('financing')?.text
  const financingProgramContextValue = getDealContext('financing_program')?.text

  // mockup loading, need to remove after the backend is implemented
  useEffect(() => {
    if (!seller.length)
      wizard.goto(2)
    else if (!buyer.length)
      wizard.goto(3)
    else if (!buyerLawyer.length)
      wizard.goto(4)
    else if (!sellerLawyer.length)
      wizard.goto(5)
    else if (financingContextValue === undefined)
      wizard.goto(6)
    else if (financingContextValue === "Mortgage" && financingProgramContextValue === undefined)
      wizard.goto(7)
    else {
      if (submitted === -1) {
        wizard.goto(currentStep)
      } else {
        wizard.goto(12)
      }
    }
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
