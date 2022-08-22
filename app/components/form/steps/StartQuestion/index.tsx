import React from "@libs/react";
import { IQuestionProps } from "../../../../models/type";
import useApp from "../../../../hooks/useApp";

const StartQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  hooks: { useWizardContext },
}) => {
  const { useEffect } = React;
  const { QuestionSection, QuestionTitle } = Wizard;
  const wizard = useWizardContext();
  const { submitted } = useApp();

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // mockup loading, need to remove after the backend is implemented
  useEffect(() => {
    if (submitted === -1) {
      wizard.goto(8);
    }
    if (submitted === 1) {
      wizard.goto(14);
    }
  }, []);

  return (
    <QuestionSection>
      <QuestionTitle>
          Awesome🎉 let's get a few questions answered and get you paid.
      </QuestionTitle>
    </QuestionSection>
  );
};

export default StartQuestion;
