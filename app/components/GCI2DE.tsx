import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IStepProps } from "../models/type"
import { stylizeNumber } from '../util'

const GCI2DE: React.FC<IStepProps> = ({
    subStep,
    step,
    updateStep,
    Components,
    GCIUnit,
    api: { getDealContext },
}) => {
    const { useEffect, useState } = React;
    const { Grid, CircularProgress, TextField, Button, InputAdornment } = Ui;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    const [inputValue, setInputValue] = useState<string | number>("");

    useEffect(() => {
        setTimeout(() => {
            updateStep({ subStep: 1 });  
        }, 1000);
    }, []);

    const handleClickButton = () => {
        updateStep({ step: 11, subStep: 0 })
    };

    const handleChangeTextField = (event: any) => {
        setInputValue(event.target.value);
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
                                    value={inputValue}
                                    style={{ width: '100%' }}
                                    onChange={handleChangeTextField}
                                    placeholder="Enter GCI"
                                    type="number"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {GCIUnit}
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {(inputValue !== "" && GCIUnit === "%") && (
                            <Grid item xs={12} style={{ textAlign: 'right', paddingBottom: 30 }}>
                                <strong>$1,000,000</strong>
                                {/* <strong>{`$${stylizeNumber(Number(listPrice))}`}</strong>  // NEED_TO_UPDATE_THIS_CODE */}
                                {`(Listing Price) * ${inputValue}% (GCI) = `}
                                {/* <strong>{`$${stylizeNumber(Number(listPrice) / 100 * Number(inputValue))}`}</strong> // NEED_TO_UPDATE_THIS_CODE */}  
                                <strong>$50,000</strong>
                            </Grid>
                        )}
                        {(inputValue !== "" && step == 10 && subStep == 1) && (
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

export default GCI2DE;