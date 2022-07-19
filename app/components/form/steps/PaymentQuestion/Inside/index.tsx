import React from "@libs/react";
import Ui from "@libs/material-ui";
import { IQuestionProps } from "../../../../../models/type";
import PaymentQuestionComponent from "../component";

const PaymentQuestionInside: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  models: { deal },
}) => {
  const { useState } = React;
  const { Box, Button } = Ui;
  const wizard = useWizardContext();
  const deal_type = deal.deal_type;

  // state
  const [next, setNext] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(true);

  const handleClickNextButton = () => {
    setNext(true);
    gotoNext();
  };

  const gotoNext = () => {
    setShowButton(false);
    setTimeout(() => {
      wizard.next();
      setNext(false);
    }, 80);
  };

  // this function enable Next button.
  const updateFlag = (flag: boolean) => {
    if (!showButton) {
      setShowButton(flag);
    }
  };

  return (
    <QuestionSection>
      <QuestionTitle>
        Please input Inside Douglas Elliman Payments info.
      </QuestionTitle>
      <QuestionForm>
        <PaymentQuestionComponent
          range="inside"
          deal_type={deal_type}
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

export default PaymentQuestionInside;
