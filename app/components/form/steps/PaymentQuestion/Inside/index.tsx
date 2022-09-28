import React from "@libs/react";
import Ui from "@libs/material-ui";
import { IQuestionProps } from "../../../../../models/type";
import PaymentQuestionComponent from "../component";
import useApp from "../../../../../hooks/useApp";

const PaymentQuestionInside: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  models: { deal },
  Components,
}) => {
  const { useState, useEffect } = React;
  const { Box, Button } = Ui;
  const wizard = useWizardContext();
  const { step } = useSectionContext();
  const enderType = deal.context.ender_type?.text;
  const dealType = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? "Both" : deal.deal_type;
  const { dealData, setDealData, submitted, currentStep, setCurrentStep } = useApp();

  const [showButton, setShowButton] = useState<boolean>(true);

  useEffect(() => {
    if (submitted === 1 || currentStep > step)
        setShowButton(false);
    else
        setShowButton(true);
  }, []);

  const handleClickNextButton = () => {
    setShowButton(false);
    let temp = JSON.parse(JSON.stringify(dealData));
    temp.current_step = step + 1;
    if (setDealData !== undefined)
      setDealData(temp);
    setTimeout(() => {
      if (wizard.currentStep < step + 1) {
        wizard.next();
        if (setCurrentStep !== undefined) {
          setCurrentStep(step+1);
        }
      }
    }, 80);
  };

  // enable "Looks good, Next" button
  const updateFlag = (flag: boolean) => {
    if (submitted !== 1 && wizard.currentStep < step + 1) {
      setShowButton(flag);
    }
  };

  return (
    <QuestionSection>
      <QuestionTitle>
        Please input Inside Douglas Elliman Payments info.
      </QuestionTitle>
      <QuestionForm width="60%">
        <PaymentQuestionComponent
          range="inside"
          dealType={dealType}
          dealId={deal.id}
          saveData={{ updateFlag }}
          components={Components}
        />
        {showButton && (
          <Box
            style={{
              textAlign: "right",
              marginTop: "20px",
              paddingBottom: "20px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleClickNextButton}
              style={{
                marginBottom: 20,
                backgroundColor: "#0fb78d",
                color: "white",
              }}
            >
              Looks good, Next
            </Button>
          </Box>
        )}
      </QuestionForm>
    </QuestionSection>
  );
};

export default PaymentQuestionInside;
