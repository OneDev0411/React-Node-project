import React from "@libs/react";
import StartQuestion from "../steps/StartQuestion";
import ComformRoleQuestion from "../steps/ConfirmRoleQuestion";
import FinanceTransQuestion from "../steps/FinanceTransQuestion";
import FinanceProgQuestion from "../steps/FinanceProgQuestion";
import GCISplitQuestion from "../steps/GCISplitQuestion";
import RemittanceQuestion from "../steps/RemittanceQuestion";
import PaymentQuestionInside from "../steps/PaymentQuestion/Inside";
import PaymentQuestionOutside from "../steps/PaymentQuestion/Outside";
import ReviewQuestion from "../steps/ReviewQuestion";
import LastQuestion from "../steps/LastQuestion";
import { IQuestionProps } from "../../../models/type";

export const FormWizard: React.FC<IQuestionProps> = (props) => {
  const { Wizard, models, utils } = props;
  const ender_type = models.deal.context.ender_type;
  const isBackOffice = utils.isBackOffice;

  if (!isBackOffice) {
    return (
      <Wizard.QuestionWizard onFinish={() => console.log("done")}>
        <StartQuestion {...props} />
        <ComformRoleQuestion {...props} roleType="Seller" />
        <ComformRoleQuestion {...props} roleType="Buyer" />
        <ComformRoleQuestion {...props} roleType="BuyerLawyer" />
        <ComformRoleQuestion {...props} roleType="SellerLawyer" />
        <FinanceTransQuestion {...props} />
        <FinanceProgQuestion {...props} />
        <GCISplitQuestion {...props} />
        <RemittanceQuestion {...props} />
        {ender_type == undefined && <PaymentQuestionInside {...props} />}
        <PaymentQuestionOutside {...props} />
        <LastQuestion {...props} />
      </Wizard.QuestionWizard> 
    );
  }
  else {
    return (
      <Wizard.QuestionWizard onFinish={() => console.log("done")}>
        <ReviewQuestion {...props} />
      </Wizard.QuestionWizard> 
    );
  }
};
