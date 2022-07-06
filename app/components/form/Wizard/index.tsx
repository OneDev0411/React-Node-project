import React from '@libs/react'
import StartQuestion from '../steps/StartQuestion'
import ComformRoleQuestion from '../steps/ConfirmRoleQuestion'
import FinanceTransQuestion from '../steps/FinanceTransQuestion'
import FinanceProgQuestion from '../steps/FinanceProgQuestion'
// import ListingInfoQuestion from '../steps/ListingInfoQuestion'
import GrossCommissionQuestion from '../steps/GrossCommissionQuestion'
import GCI2DEQuestion from '../steps/GCI2DEQuestion'
import GCISplitQuestion from '../steps/GCISplitQuestion'
import RemittanceQuestion from '../steps/RemittanceQuestion'
import PaymentQuestionInside from '../steps/PaymentQuestion/Inside'
import PaymentQuestionOutside from '../steps/PaymentQuestion/Outside'
import LastQuestion from '../steps/LastQuestion'
import { IQuestionProps } from '../../../models/type'

export const FormWizard:React.FC<IQuestionProps> = (props) => {
  const { Wizard, models } = props;
  const ender_type = models.deal.context.ender_type;
  return (
    <Wizard.QuestionWizard onFinish={() => console.log('done')}>
      <StartQuestion {...props} />
      <ComformRoleQuestion {...props} roleType="Seller" />
      <ComformRoleQuestion {...props} roleType="Buyer" />
      <ComformRoleQuestion {...props} roleType="BuyerLawyer" />
      <ComformRoleQuestion {...props} roleType="SellerLawyer" />
      <FinanceTransQuestion {...props} />
      <FinanceProgQuestion {...props} />
      {/* <ListingInfoQuestion {...props} /> */}
      <GrossCommissionQuestion {...props} />
      <GCI2DEQuestion {...props} />
      <GCISplitQuestion {...props} />
      <RemittanceQuestion {...props} />
      { ender_type == undefined &&  <PaymentQuestionInside {...props} />}
      <PaymentQuestionOutside {...props} />
      <LastQuestion {...props} />
    </Wizard.QuestionWizard>
  )
}
