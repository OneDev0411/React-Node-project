import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps, SelectData } from "../../../../models/type"
import { commissionSelectDataList } from '../../../../util'

const GrossCommissionQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    GCIUnit,
    setGCIUnit,
}) => {
    // const { useEffect } = React;
    const { RadioGroup, FormControlLabel, Radio } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();

    // state
    // useEffect(() => {
    //     console.log("contextData:", getDealContext("list_price")?.text);
    //     setTimeout(() => {
    //         updateStep({ subStep: 1 });
    //     }, 1000);
    // }, []);

    const handleClickRadioButton = (event: any) => {
        if (setGCIUnit !== undefined) {
            setGCIUnit(event.target.value);
        }
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
                    value={GCIUnit}
                    name="radio-buttons-group"
                >
                    {commissionSelectDataList.map((data: SelectData, index: number) => 
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

export default GrossCommissionQuestion;