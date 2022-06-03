import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IStepProps, ItemData } from "../models/type"
import GCIInfoItem from "./GCIInfoItem"

const Step11: React.FC<IStepProps> = ({
    subStep,
    step,
    updateStep,
    Components,
}) => {
    const { useEffect } = React;
    const { Grid, CircularProgress, Button, Box } = Ui;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    const dataList: ItemData[] = [
        {
            name: 'John Smith',
            role: 'Seller - DE',
            share: '5%',
            share2: '$10,000'
        },
        {
            name: 'Jim Doe',
            role: 'Buyer - Rechat',
            share: '5%',
            share2: '$10,000'
        },
        {
            name: 'Peter Parker',
            role: "Seller's Attorney",
            share: '5%',
            share2: '$10,000'
        },
        {
            name: 'John Smith',
            role: "Steve Palmer",
            share: '5%',
            share2: '$10,000'
        },
    ]

    useEffect(() => {
        setTimeout(() => {
            updateStep({ subStep: 1 }); 
        }, 1000);
    }, []);

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard>
                    <QuestionSection>
                        <QuestionTitle>
                            Great, here are your GCI share befoer splits:
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            {(step == 11 && subStep == 0) && (
                <Grid item xs={12}>
                    <CircularProgress />
                </Grid>
            )}
            {((step == 11 && subStep == 1) || step > 11) && (
                <>
                    <Grid item xs={12}>
                        {dataList.map((item: ItemData, id: number) => 
                            <GCIInfoItem Ui={Ui} key={id} itemData={item} />
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Button style={{ color: 'black !important', borderColor: '#dbdbdb !important', marginRight: 10 }}>
                            + Add More Agents
                        </Button>
                    </Grid>
                    <Box style={{ width: 600, paddingLeft: 20 }}>
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={7} />
                            <Grid item xs={2}>
                                <label style={{ fontWeight: 300 }}>
                                    Total: <strong>20%</strong>
                                </label>
                            </Grid>
                            <Grid item xs={3}>
                                <label style={{ fontWeight: 300 }}>
                                    Total: <strong>$40,000</strong>
                                </label>
                            </Grid>
                        </Grid>
                    </Box>
                    <Grid item xs={12}>
                        <QuestionWizard styles={{ marginBottom: -20 }}>
                            <QuestionSection>
                                <QuestionTitle>
                                    Awesome! Let's submit this for the review, and get you paid!
                                </QuestionTitle>
                            </QuestionSection>
                        </QuestionWizard>
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: 'right' }}>
                        <Button variant="contained" style={{ backgroundColor: '#0fb78d', color: 'white' }}>
                            Submit for Review
                        </Button>
                    </Grid>
                </>
            )}
        </Grid>
    )
}

export default Step11;