import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IStepProps } from "../models/type"

const ListingInfo: React.FC<IStepProps> = ({
    subStep,
    step,
    updateStep,
    Components,
    api: { updateDealContext, getDealContext }
}) => {
    const { useEffect, useState } = React;
    const { Grid, CircularProgress, TextField, Button, InputAdornment } = Ui;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    const [listPrice, setListPrice] = useState<number>(0);
    const [listDate, setListDate] = useState<string>("Apr 22, 2022");  // NEED_TO_UPDATE_THIS_CODE
    const [closingDate, setClosingDate] = useState<string>("Apr 22, 2022");  // NEED_TO_UPDATE_THIS_CODE

    useEffect(() => {
        setTimeout(() => {
            updateStep({ subStep: 1 }); 
        }, 1000);
    }, []);

    const handleClickButton = async () => {
        await updateDealContext("list_price", Number(listPrice));
        await updateDealContext("list_date", listDate);
        await updateDealContext("closing_date", closingDate);

        updateStep({ step: 9, subStep: 0 })
    };

    const handleChangeInput = (key: string, event: any) => {
        switch(key) {
            case "listPrice":
                setListPrice(event.target.value);
                break;
            case "listDate":
                setListDate(event.target.value);
                break;
            case "closingDate":
                setClosingDate(event.target.value);
                break;
        }
    }

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
                                    value={listPrice}
                                    onChange={(event: any) => handleChangeInput("listPrice", event)}
                                    style={{ width: '100%' }}
                                    type={"number"}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                $
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={6} />
                            <Grid item xs={6}>
                                <TextField
                                    size='small'
                                    label="Original Listing Date"
                                    onChange={(event: any) => handleChangeInput("listDate", event)}
                                    value={listDate}
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
                                    onChange={(event: any) => handleChangeInput("closingDate", event)}
                                    value={closingDate}
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

export default ListingInfo;