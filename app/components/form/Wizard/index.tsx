import React from '@libs/react'
import StartQuestion from '../steps/StartQuestion'
import ComformRoleQuestion from '../steps/ConfirmRoleQuestion'
import FinanceTransQuestion from '../steps/FinanceTransQuestion'
import FinanceProgQuestion from '../steps/FinanceProgQuestion'
import ListingInfoQuestion from '../steps/ListingInfoQuestion'
import GrossCommissionQuestion from '../steps/GrossCommissionQuestion'
import GCI2DEQuestion from '../steps/GCI2DEQuestion'
import GCISplitQuestion from '../steps/GCISplitQuestion'
import { IQuestionProps } from '../../../models/type'

export const FormWizard:React.FC<IQuestionProps> = (props) => {
  const { useState } = React;
  const { Wizard } = props;
  
  // should be removed after context logic is implemented
  const [GCIUnit, setGCIUnit] = useState<string>("");

  return (
    <Wizard.QuestionWizard onFinish={() => console.log('done')}>
      <StartQuestion {...props} />
      <ComformRoleQuestion {...props} roleType="Seller" />
      <ComformRoleQuestion {...props} roleType="Buyer" />
      <ComformRoleQuestion {...props} roleType="BuyerLawyer" />
      <ComformRoleQuestion {...props} roleType="SellerLawyer" />
      <FinanceTransQuestion {...props} />
      <FinanceProgQuestion {...props} />
      <ListingInfoQuestion {...props} />
      <GrossCommissionQuestion {...props} GCIUnit={GCIUnit} setGCIUnit={setGCIUnit} />
      <GCI2DEQuestion {...props} GCIUnit={GCIUnit} />
      <GCISplitQuestion {...props} />
    </Wizard.QuestionWizard>
  )
}
