import StartQuestion from "../steps/StartQuestion"
import FinanceTransQuestion from "../steps/FinanceTransQuestion"
import FinanceProgQuestion from "../steps/FinanceProgQuestion"
import GCISplitQuestion from "../steps/GCISplitQuestion"
import RemittanceQuestion from "../steps/RemittanceQuestion"
import PaymentQuestionInside from "../steps/PaymentQuestion/Inside"
import PaymentQuestionOutside from "../steps/PaymentQuestion/Outside"
import ReviewQuestion from "../steps/ReviewQuestion"
import LastQuestion from "../steps/LastQuestion"
import FeeQuestion from "../steps/FeeQuestion"
import { IQuestionProps } from "../../../models/type"
import React from "@libs/react"

export const FormWizard: React.FC<IQuestionProps> = (props) => {
  const { useState, useEffect } = React
  const { Wizard, utils, models } = props
  const { deal } = models
  const isReveiew = utils.isReview
  const isBackOffice = utils.isBackOffice

  const [isNYC, setIsNYC] = useState<boolean>(false)

  useEffect(() => {
    let brand = deal.brand
    do {
      if (brand.name === "New York City") {
        setIsNYC(true)
        break
      }
      brand = brand.parent
    } while (brand.parent)
  }, [])

  if (!isReveiew) {
    return (
      <Wizard.QuestionWizard onFinish={() => console.log("done")}>
        <StartQuestion {...props} />
        {!deal.property_type.is_lease && <FinanceTransQuestion {...props} />}
        {!deal.property_type.is_lease && <FinanceProgQuestion {...props} />}
        <GCISplitQuestion {...props} />
        <RemittanceQuestion {...props} />
        <PaymentQuestionInside {...props} />
        <PaymentQuestionOutside {...props} />
        {isBackOffice && !isNYC && (
          <FeeQuestion {...props} />
        )}
        <LastQuestion {...props} />
      </Wizard.QuestionWizard> 
    )
  }
  else {
    return (
      <Wizard.QuestionWizard onFinish={() => console.log("done")}>
        <ReviewQuestion {...props} />
      </Wizard.QuestionWizard> 
    )
  }
}
