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
import PaymentQuestion from '../steps/PaymentQuestion'
import LastQuestion from '../steps/LastQuestion'
import CollectPaymentAndFee from '../steps/CollectPaymentAndFee'
import { IQuestionProps } from '../../../models/type'

export const FormWizard:React.FC<IQuestionProps> = (props) => {
  const { useState } = React;
  const { Wizard, models } = props;
  const { roles } = models;

  // should be removed after context logic is implemented
  // let agentRole = roles.filter((role: IDealRole) => role.role === "BuyerAgent" || role.role === "SellerAgent" || role.role === "CoBuyerAgent" || role.role === "CoSellerAgent");
  // let initialAgentShareInfoList = agentRole.map((agent: IDealRole) => {
    // return {
      // sharePercent: 5,
      // roleID: agent.id
    // }
  // });

  // const [GCIUnit, setGCIUnit] = useState<"%" | "$" | "">("");
  // const [GCIValue, setGCIValue] = useState<Number>(0);
  // const [agentShareInfoList, setAgentShareInfoList] = useState<Array<any>>(initialAgentShareInfoList);

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
      <PaymentQuestion {...props} />
      <CollectPaymentAndFee {...props}/>
      <LastQuestion {...props} />
    </Wizard.QuestionWizard>
  )
}
