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
import DealNumberQuestion from "../steps/DealNumberQuestion"
import CommissionInstruction from "../steps/CommissionInstruction"
import DocumentUpLoadedCheck from "../steps/DocumentUpLoadedCheck"
import TransCoordinatorQuestion from "../steps/TransactionCoordinatorQuestion"
import TransCoordinatorEmail from "../steps/TransCoordinatorEmail"

export const FormWizard: React.FC<IQuestionProps> = (props) => {
  const { Wizard, utils, models, isNYC, isNevada, isFlorida } = props
  const { deal } = models
  const isReveiew = utils.isReview
  const isBackOffice = utils.isBackOffice

  if (!isReveiew) {
    return (
      <Wizard.QuestionWizard onFinish={() => console.log("done")}>
        <StartQuestion {...props} />
        {isNevada && <TransCoordinatorQuestion {...props} />}
        {isNevada && <TransCoordinatorEmail {...props} />}
        {(deal.property_type.label === "Referral" && isNevada) && <DocumentUpLoadedCheck {...props}/>}
        {isFlorida && <DealNumberQuestion {...props} />}
        {!deal.property_type.is_lease && <FinanceTransQuestion {...props} />}
        {!deal.property_type.is_lease && <FinanceProgQuestion {...props} />}
        <GCISplitQuestion {...props} />
        <RemittanceQuestion {...props} />
        <PaymentQuestionInside {...props} />
        <PaymentQuestionOutside {...props} />
        {isBackOffice && !isNYC && (
          <FeeQuestion {...props} />
        )}
        {isBackOffice && <CommissionInstruction {...props} />}
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
