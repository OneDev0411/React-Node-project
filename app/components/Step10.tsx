import { IStepProps } from "../models/type";

const Step10: React.FC<IStepProps> = ({
    subStep,
    step,
    updateStep,
    Ui,
    Components,
    React
}) => {
    const { useEffect, useState } = React;
    const { Grid, CircularProgress, TextField, Button } = Ui;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    const [text, setText] = useState("");
    const [showLabel, setShowLabel] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            updateStep({ subStep: 1 });  
        }, 1000);
    }, []);

    const handleClickButton = () => {
        updateStep({ step: 11, subStep: 0 })
    };

    const handleChangeTextField = (event: any) => {
        setText(`${event.target.value}%`);
        setShowLabel(true);
    }

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            Please verify the GCI to Douglas Elliman?
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            <Grid item xs={12}>
                {(step == 10 && subStep == 0) && <CircularProgress />}
                {((step == 10 && subStep == 1) || step >= 11) && (
                    <>
                        <Grid container spacing={2} style={{ paddingBottom: 10 }}>
                            <Grid item xs={6} />
                            <Grid item xs={6}>
                                <TextField
                                    size='small'
                                    label="GCI to DE"
                                    value={text}
                                    style={{ width: '100%' }}
                                    onChange={handleChangeTextField}
                                    placeholder="5"
                                    />
                            </Grid>
                        </Grid>
                        {showLabel && (
                            <Grid item xs={12} style={{ textAlign: 'right', paddingBottom: 30 }}>
                                <strong>$1,000,000</strong>(Listing Price) * 5% (GCI) = <strong>$50,000</strong>
                            </Grid>
                        )}
                        {(showLabel && step == 10 && subStep == 1) && (
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

export default Step10;