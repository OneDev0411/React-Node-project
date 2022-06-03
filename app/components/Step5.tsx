import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IStepProps } from "../models/type"

const Step5: React.FC<IStepProps> = ({
    subStep,
    step,
    updateStep,
    Components,
}) => {
    const { useEffect } = React;
    const { Grid, CircularProgress, TextField, Button } = Ui;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    useEffect(() => {
        setTimeout(() => {
            updateStep({ subStep: 1 });  
        }, 1000);
    }, []);

    const handleClickSkipButton = () => {
        updateStep({ step: 6, subStep: 0 })
    };

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            Please enter seller's attorney's details:
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            <Grid item xs={12}>
                {(step == 5 && subStep == 0) && <CircularProgress />}
                {(step == 5 && subStep == 1) && (
                    <>
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={6} />
                            <Grid item xs={6}>
                                <TextField
                                    size='small'
                                    label="Enter buyer attorney's name"
                                    defaultValue={''}
                                    style={{ width: '100%' }}
                                    placeholder="Skip"
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: 'right' }}>
                            <Button onClick={handleClickSkipButton} style={{ color: 'black !important', borderColor: '#dbdbdb !important', marginRight: 10 }}>
                                Skip
                            </Button>
                        </Grid>
                    </>
                )}
                {(step >= 6) && (
                    <Grid item xs={12} style={{ textAlign: 'right' }}>
                        <Button variant="text" style={{ marginRight: 10, color: 'black !important' }}>
                            Skipped
                        </Button>
                        <Button variant="text" className="green-button" style={{ marginRight: 10 }}>
                            Add Info
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Grid>
    )
}

export default Step5;