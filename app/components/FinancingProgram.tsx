import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IStepProps } from "../models/type"

const FinancingProgram: React.FC<IStepProps> = ({
    subStep,
    step,
    updateStep,
    Components,
    api: { updateDealContext }
}) => {
    const { useEffect, useState } = React;
    const { Grid, CircularProgress, TextField, Button } = Ui;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    const [text, setText] = useState<string>("");

    useEffect(() => {
        setTimeout(() => {
            updateStep({ subStep: 1 }); 
        }, 1000);
    }, []);

    const handleClickButton = () => {
        updateDealContext("financing_program", text);
        updateStep({ step: 8, subStep: 0 })
    };

    const handleOnTextFieldChange = (event: any) => {
        setText(event.target.value);
    }

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            What is the financing program?
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            <Grid item xs={12}>
                {(step == 7 && subStep == 0) && <CircularProgress />}
                {((step == 7 && subStep == 1) || step > 7) && (
                    <>
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={6} />
                            <Grid item xs={6}>
                                <TextField
                                    size='small'
                                    label="Financing Program"
                                    style={{ width: '100%' }}
                                    onChange={handleOnTextFieldChange}
                                    value={text}
                                />
                            </Grid>
                        </Grid>
                        {(step == 7 && subStep == 1) && (
                            <Grid item xs={12} style={{ textAlign: 'right' }}>
                                <Button variant="contained" disabled={!text.length} onClick={handleClickButton} style={text.length ? { backgroundColor: '#0fb78d', color: 'white' } : {}}>
                                    Looks good, Next
                                </Button>
                            </Grid>
                        )}
                    </>
                )}
            </Grid>
        </Grid>
    )
}

export default FinancingProgram;