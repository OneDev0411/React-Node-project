import React from "@libs/react";
import Ui from "@libs/material-ui";
import { IQuestionProps } from "../../../../../models/type";
import useApp from "../../../../../hooks/useApp";

import PaymentQuestionComponent from "../component";

const PaymentQuestionOutside: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  models: { deal },
}) => {
  const { useState, useEffect } = React;
  const { Box, Button } = Ui;
  const wizard = useWizardContext();
  const { step } = useSectionContext();
  const enderType = deal.context.ender_type?.text;
  const dealType = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? "Both" : deal.deal_type;
  const { dealData, setDealData, submitted, currentStep, setCurrentStep } = useApp();

  // state
  const [next, setNext] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(true);

  useEffect(() => {
    if (submitted === 1 || currentStep > step)
        setShowButton(false);
    else
        setShowButton(true);
  }, []);

  const handleClickNextButton = () => {
    setNext(true);
    gotoNext();
  };

  const gotoNext = () => {
    setShowButton(false);
    dealData.current_step = step;
    let temp = JSON.parse(JSON.stringify(dealData));
    if (setDealData !== undefined)
      setDealData(temp);
    setTimeout(() => {
      if (wizard.currentStep < step + 1) {
        wizard.next();
        if (setCurrentStep !== undefined) {
          setCurrentStep(step);
        }
      }
      setNext(false);
    }, 80);
  };

  // this enable Next button
  const updateFlag = (flag: boolean) => {
    if (!showButton) {
      setShowButton(flag);
    }
  };

  return (
    <QuestionSection>
      <QuestionTitle>
        Please input Outside Douglas Elliman Payments info.
      </QuestionTitle>
      <QuestionForm>
        <PaymentQuestionComponent
          range="outside"
          dealType={dealType}
          saveData={{ next, updateFlag }}
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

export default PaymentQuestionOutside;
