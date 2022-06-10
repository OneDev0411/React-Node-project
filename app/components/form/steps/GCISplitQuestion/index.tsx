import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps, ItemData } from "../../../../models/type"
import GCIInfoItem from "./item"
import { GCI2DEDataList } from '../../../../util'

const GCISplitQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
}) => {
    const { useEffect } = React;
    const { Grid, Button } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    
    useEffect(() => {
        // when the component is shown
        if (wizard.currentStep === step) {
            setTimeout(() => {
                wizard.next();
            }, 1000);
        }
    }, [wizard.currentStep]);
    
    return (
        <QuestionSection>
            <QuestionTitle>
                Great, here are your GCI share before splits:
            </QuestionTitle>
            <QuestionForm>
                {GCI2DEDataList.map((item: ItemData, id: number) => 
                    <GCIInfoItem Ui={Ui} key={id} itemData={item} />
                )}
                <Button variant="outlined" style={{ color: 'black !important', borderColor: '#dbdbdb !important', paddingBottom: 2, paddingTop: 2, marginLeft: -10, marginTop: 10 }}>
                    + Add More Agents
                </Button>
                <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                    <Grid item xs={6} />
                    <Grid item xs={3}>
                        <label style={{ fontWeight: 300 }}>
                            Total: <strong>20%</strong>
                        </label>
                    </Grid>
                    <Grid item xs={3}>
                        <label style={{ fontWeight: 300 }}>
                            Total: <strong>$40,000</strong>
                        </label>
                    </Grid>
                </Grid>
            </QuestionForm>
        </QuestionSection>
    )
}

export default GCISplitQuestion;