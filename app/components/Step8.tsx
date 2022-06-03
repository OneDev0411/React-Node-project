import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IStepProps } from "../models/type"

const Step8: React.FC<IStepProps> = ({
    subStep,
    step,
    updateStep,
    Components,
}) => {
    const { useEffect } = React;
    const { Grid, CircularProgress, TextField, Button, } = Ui;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    useEffect(() => {
        setTimeout(() => {
            updateStep({ subStep: 1 }); 
        }, 1000);
    }, []);

    const handleClickButton = () => {
        updateStep({ step: 9, subStep: 0 })
    };

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            Please confirm or update the following:
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            <Grid item xs={12}>
                {(step == 8 && subStep == 0) && <CircularProgress />}
                {((step == 8 && subStep == 1) || step > 8) && (
                    <>
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={6} />
                            <Grid item xs={6}>
                                <TextField
                                    size='small'
                                    label="Original Listing Price"
                                    defaultValue="$1,000,000"
                                    style={{ width: '100%' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={6} />
                            <Grid item xs={6}>
                                <TextField
                                    size='small'
                                    label="Original Listing Date"
                                    defaultValue="Apr 22, 2022"
                                    style={{ width: '100%' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={6} />
                            <Grid item xs={6}>
                                <TextField
                                    size='small'
                                    label="Projected Closing Date"
                                    defaultValue="Apr 22, 2022"
                                    style={{ width: '100%' }}
                                />
                            </Grid>
                        </Grid>
                        {(step == 8 && subStep == 1) && (
                            <Grid item xs={12} style={{ textAlign: 'right' }}>
                                <Button variant="contained" onClick={handleClickButton} style={{ backgroundColor: '#0fb78d', color: 'white' }}>
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

export default Step8;