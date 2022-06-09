import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps, SelectData } from "../../../../models/type"
import { financeSelectDataList } from '../../../../util'

const FinanceTransQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    api: { updateDealContext },
}) => {
    const { useState } = React;
    const { RadioGroup, FormControlLabel, Radio } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();

    // state
    const [curSelect, setCurSelect] = useState<number>(-1);

    const handleClickRadioButton = (event: any) => {
        setCurSelect(event.target.value);
        updateDealContext("financing", event.target.value);
        if (wizard.currentStep < step + 1) {
            wizard.next();
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
            </QuestionForm>
        </QuestionSection>
    )
}

export default FinanceTransQuestion;