import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps, SelectData } from "../../../../models/type"
import { financeSelectDataList } from '../../../../util'
import useApp from "../../../../hooks/useApp";

const FinanceTransQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  api: { updateDealContext, getDealContext },
}) => {
  const { useState } = React;
  const { RadioGroup, FormControlLabel, Radio, Box } = Ui;
  const wizard = useWizardContext();
  const { step } = useSectionContext();
  const { setFinancing } = useApp();

  const financingContextValue = getDealContext('financing')?.text;
  const financingProgramContextValue = getDealContext('financing_program')?.text;

  // state
  const [curSelect, setCurSelect] = useState<string>(financingContextValue);
  const [showBox, setShowBox] = useState<boolean>(true);

  const handleClickRadioButton = async (event: any) => {
    setShowBox(false);
    updateDealContext("financing", event.target.value);
    setCurSelect(event.target.value);
    if (setFinancing !== undefined)
      setFinancing(event.target.value);
    if (wizard.currentStep < step + 1) {
      setTimeout(() => {
        if (event.target.value == "Cash Deal" && financingProgramContextValue != "")
          wizard.goto(step + 2);
        else
          wizard.next();
      }, 10);
    }
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        How is this transaction being financed?
      </QuestionTitle>
      <QuestionForm>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={curSelect}
          name="radio-buttons-group"
        >
          {financeSelectDataList.map((data: SelectData, index: number) => 
            <FormControlLabel 
              style={{ border: '1px solid #bfbfbf', borderRadius: 5 }} 
              onClick={handleClickRadioButton} 
              value={data.value} 
              control={<Radio />} 
              label={data.label} 
              key={index}
            />
          )}
        </RadioGroup>
        {showBox && (
          <Box style={{ height: 40 }} />
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

export default FinanceTransQuestion;