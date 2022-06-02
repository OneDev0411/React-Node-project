import { IStep1Props } from "../models/type";

const Step1: React.FC<IStep1Props> = ({
    Ui: { Grid, CircularProgress },
    Components,
    step
}) => {
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            Awesome let's get a few questions answered and get you paid.
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            {step == 1 && (
                <Grid item xs={12}>
                    <CircularProgress />
                </Grid>
            )}
        </Grid>
    )
}

export default Step1;