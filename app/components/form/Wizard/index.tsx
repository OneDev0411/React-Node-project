import StartQuestion from "../steps/StartQuestion"
import ComformRoleQuestion from "../steps/ConfirmRoleQuestion"
import FinanceTransQuestion from "../steps/FinanceTransQuestion"
import FinanceProgQuestion from "../steps/FinanceProgQuestion"
import GCISplitQuestion from "../steps/GCISplitQuestion"
import RemittanceQuestion from "../steps/RemittanceQuestion"
import PaymentQuestionInside from "../steps/PaymentQuestion/Inside"
import PaymentQuestionOutside from "../steps/PaymentQuestion/Outside"
import ReviewQuestion from "../steps/ReviewQuestion"
import LastQuestion from "../steps/LastQuestion"
import { IQuestionProps } from "../../../models/type"

export const FormWizard: React.FC<IQuestionProps> = (props) => {
  const { Wizard, utils, models } = props
  const { deal } = models
  const isReveiew = utils.isReview

  if (!isReveiew) {
    return (
      <Wizard.QuestionWizard onFinish={() => console.log("done")}>
        <StartQuestion {...props} />
        <ComformRoleQuestion {...props} roleType={deal.property_type.is_lease ? "Landlord" : "Seller"} />
        <ComformRoleQuestion {...props} roleType={deal.property_type.is_lease ? "Tenant" : "Buyer"} />
        <ComformRoleQuestion {...props} roleType={deal.property_type.is_lease ? "TenantPowerOfAttorney" : "BuyerLawyer"} />
        <ComformRoleQuestion {...props} roleType={deal.property_type.is_lease ? "LandlordPowerOfAttorney" : "SellerLawyer"} />
        {!deal.property_type.is_lease && <FinanceTransQuestion {...props} />}
        {!deal.property_type.is_lease && <FinanceProgQuestion {...props} />}
        <GCISplitQuestion {...props} />
        <RemittanceQuestion {...props} />
        <PaymentQuestionInside {...props} />
        <PaymentQuestionOutside {...props} />
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
