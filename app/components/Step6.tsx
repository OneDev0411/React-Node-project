import { IStepProps } from "../models/type";

const Step6: React.FC<IStepProps> = ({
    subStep,
    step,
    updateStep,
    Ui,
    Components,
    React
}) => {
    const { useEffect, useState } = React;
    const { Grid, CircularProgress, RadioGroup, FormControlLabel, Radio } = Ui;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    const [curSelect, setCurSelect] = useState<number>(-1);

    useEffect(() => {
        setTimeout(() => {
            updateStep({ subStep: 1 }); 
        }, 1000);
    }, []);

    const handleClickRadioButton = (event: any) => {
        setCurSelect(Number(event.target.value));
        updateStep({ step: 7, subStep: 0 })
    }

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            How is the transaction being financed?
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
                                    value={curSelect}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel style={{ border: '1px solid #bfbfbf', borderRadius: 5 }} onClick={handleClickRadioButton} value={0} control={<Radio />} label="Cash Deal" />
                                    <FormControlLabel style={{ border: '1px solid #bfbfbf', borderRadius: 5 }} onClick={handleClickRadioButton} value={1} control={<Radio />} label="Mortgage" />
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
        </Grid>
    )
}

export default Step6;