import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps, PaymentType } from '../../../../models/type';
import { paymentTypeData } from '../../../../util';
import PaidByCard from './PaidByCard';
import { Divider } from '@material-ui/core';


const CollectPaymentAndFee: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    utils: { notifyOffice },
}) => {
    const { useEffect, useState } = React;
    const { Grid, Select, MenuItem, ListSubheader,  TextField, InputAdornment, Box, Button, FormControlLabel, Checkbox, Divider } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();

    // state
    const [checked, setChecked] = useState(true);
    const [showButton, setShowButton] = useState<boolean>(true);

    const displayData = paymentTypeData.reduce((result: any, data: PaymentType) => {
        result.push(<ListSubheader>{data.groupName}</ListSubheader>);
        data.member.map((value: string, index: number) => {
            result.push(<MenuItem value={value}>{value}</MenuItem>);
        });
        return result;
    }, []);

    const [paymentTypeValue, setPaymentTypeValue] = useState<string>("Team Member");

    const handleSelected = (event: any) => {
        setPaymentTypeValue(event.target.value);
    }

    const handleClickNextButton = () => {
            gotoNext();
    }
    
    const gotoNext = () => {
        setShowButton(false);
        setTimeout(() => {
            wizard.next();
        }, 80);
    }

    const handleCheckBoxChange = (event: any) => {
        setChecked(event.target.checked);
    };

    useEffect(() => {
        // when the component is shown
        if (wizard.currentStep === step) {
            setTimeout(() => {
                wizard.next();
            }, 1000);
        }
    }, [wizard.currentStep]);

    return (
        <QuestionSection>
            <QuestionTitle>
                Please, Collect payments and fee. 
            </QuestionTitle>
            <QuestionForm>
                <Grid container spacing={2} style={{marginBottom: 10}}>
                    <Grid item xs={3}>
                        <label>Payment Type</label>

                    </Grid>
                    <Grid item xs={9}>
                        <Select 
                            defaultValue="" 
                            id="grouped-select" 
                            label="Grouping"
                            style={{width: "100%"}}
                            value={paymentTypeValue}
                            onChange={handleSelected} 
                        >
                            {displayData}
                            
                        </Select>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{marginBottom: 10}}>
                    <Grid item xs={3}>
                        <label>Paid To</label>

                    </Grid>
                    <Grid item xs={9}>
                        <Select 
                            defaultValue="" 
                            id="grouped-select" 
                            label="Grouping"
                            style={{width: "100%"}}
                            value={paymentTypeValue}
                            onChange={handleSelected} 
                        >
                            {displayData}
                            
                        </Select>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <label>Paid By: </label>
                    </Grid>
                    <Grid item xs={12}>
                        <PaidByCard name='Jeff Adler' cost={2000}/>
                        <Divider/>
                        <PaidByCard name='Marie Espinal' cost={2000}/>
                    </Grid>
                </Grid>
                <Box style={{ textAlign: "right" }}>

                    {showButton && (
                        <Box style={{ textAlign: 'right' }}>
                            <Button variant="contained" onClick={handleClickNextButton} style={{ marginBottom: 20, backgroundColor: '#0fb78d', color: 'white' }}>
                                Looks good, Next
                            </Button>
                        </Box>
                    )}
                </Box>
            </QuestionForm>
        </QuestionSection>
    )
}

export default CollectPaymentAndFee;