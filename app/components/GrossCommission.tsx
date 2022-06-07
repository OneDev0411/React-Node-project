import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IStepProps } from "../models/type"

const FinancingTransaction: React.FC<IStepProps> = ({
    subStep,
    step,
    updateStep,
    Components,
    GCIUnit,
    setGCIUnit,
    api: { getDealContext },
}) => {
    const { useEffect } = React;
    const { Grid, CircularProgress, RadioGroup, FormControlLabel, Radio } = Ui;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    useEffect(() => {
        console.log("contextData:", getDealContext("list_price")?.text);
        setTimeout(() => {
            updateStep({ subStep: 1 });
        }, 1000);
    }, []);

    const handleClickRadioButton = (event: any) => {
        if (setGCIUnit !== undefined) {
            setGCIUnit(event.target.value);
        }
        updateStep({ step: 10, subStep: 0 })
    }

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            How is this transaction being financed?
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            <Grid item xs={12}>
                {(step == 6 && subStep == 0) && <CircularProgress />}
                {((step == 6 && subStep == 1) || step > 6) && (
                    <>
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={6} />
                            <Grid item xs={6}>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={GCIUnit}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel 
                                        style={{ border: '1px solid #bfbfbf', borderRadius: 5 }} 
                                        onClick={handleClickRadioButton} 
                                        value="%" 
                                        control={<Radio />} 
                                        label="By %" 
                                    />
                                    <FormControlLabel 
                                        style={{ border: '1px solid #bfbfbf', borderRadius: 5 }} 
                                        onClick={handleClickRadioButton} 
                                        value="$" 
                                        control={<Radio />} 
                                        label="By $" 
                                    />
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
        </Grid>
    )
}

export default FinancingTransaction;