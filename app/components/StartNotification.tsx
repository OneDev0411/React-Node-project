import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IStep1Props } from "../models/type"

const StartNotification: React.FC<IStep1Props> = ({
    Components,
    step
}) => {
    const { Grid, CircularProgress } = Ui;
    const { QuestionWizard, QuestionForm, QuestionSection, QuestionTitle } = Components.Wizard;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            Awesome let's get a few questions answered and get you paid.
                        </QuestionTitle>
                        {step == 1 && (
                            <Grid item xs={12}>
                                <CircularProgress />
                            </Grid>
                        )}
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
        </Grid>
    )
}

export default StartNotification;