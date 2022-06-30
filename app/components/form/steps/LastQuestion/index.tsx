import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps } from '../../../../models/type';

const LastQuestion: React.FC<IQuestionProps> = ({
    Wizard,
    utils: { notifyOffice },
}) => {
    const { QuestionSection, QuestionTitle, QuestionForm } = Wizard;
    const { useEffect, useState } = React;
    const { Grid, Select, MenuItem, ListSubheader,  TextField, InputAdornment, Box, Button } = Ui;
    
    // inserted by joys paymentType handle function
    type PaymentType = {
        groupName: string,
        member: string[] 
    }
    type PaymentTypeArray = PaymentType[];
    const mockPaymentTypeData:PaymentTypeArray = [
        {
            groupName : "DE Referral Fee",
            member: [
                
                "Team Member", 
                "DE Agent", 
                "DE Relocation",
                "Corporate Referral",
                "Referral Director",
                "Other Fees(inside DE)"
            ] 
        },
        {
            groupName: "Outside DE Referral Fee",
            member: [
                "DE Property Management",
                "DE eTeam",
                "Attorney",
                "City Realty",
                "Relocation Company",
                "Outside Referral Broker",
                "Zillow/StreetEasy",
                "Other Fees(Outside DE)"
            ]
        },
        {
            groupName: "Co-Broke",
            member: [
                "Outside Co-Broke"
            ]
        }
    ]

    const displayData = mockPaymentTypeData.reduce((result: any, data: PaymentType) => {
        result.push(<ListSubheader>{data.groupName}</ListSubheader>);
        data.member.map((value: string, index: number) => {
            result.push(<MenuItem value={value}>{value}</MenuItem>);
        });
        return result;
    }, []);

    // const [paymentTypeValue, setPaymentTypeValue] = useState<any>(0);
    const [paymentTypeValue, setPaymentTypeValue] = useState<string>("DE eTeam");
    // const [paymentTypeValue, setPaymentTypeValue] = useState<string>(mockPaymentTypeData.length > 0 ? mockPaymentTypeData[0].member[0] : "");
   
    // const handleSelected = (value: string) => {
    const handleSelected = (event: any) => {
        setPaymentTypeValue(event.target.value);
        // setPaymentTypeValue(value);
        // console.log('event', event);
        // console.log('value', event.target.value);

    }
    const handleSubmit = () => {
        notifyOffice("Please review the Commission Slip");
    }

    return (
        <QuestionSection>
            <QuestionTitle>
                Awesome! Let's submit this for the review, and get you paid!
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
                            {/* <MenuItem value="54">
                                1
                            </MenuItem>
                            <MenuItem value="654">
                                13434
                            </MenuItem> */}
                            {/* {
                                mockPaymentTypeData.map((item: PaymentType, id: number) => 
                                    <div key={id}>
                                        <ListSubheader>{item.groupName}</ListSubheader>
                                        {item.member.map((mem: string, index: number) => 
                                            <MenuItem value={mem} key={index} onClick={(e: any) => handleSelected(mem)}>{mem}</MenuItem>
                                        )}
                                    </div>
                                )
                            } */}
                            {/* { */}
                            {/* <>
                                <ListSubheader>DE Referral Fee</ListSubheader>
                                <MenuItem value={"Team Member"}>Team Member</MenuItem>
                                <MenuItem value={"DE Agent"}>DE Agent</MenuItem>
                                <MenuItem value={"DE Relocation"}>DE Relocation</MenuItem>
                            </> */}
                            {/* } */}
                            {/* <ListSubheader>Testtest</ListSubheader>
                            {
                                testData.map((item: string, id: number) => 
                                    <MenuItem key={id} value={item}>{item}</MenuItem>
                                )
                            } */}
                        </Select>
                    </Grid>
                </Grid>

                <Box style={{ textAlign: "right" }}>

                    <Button onClick={handleSubmit} variant="contained" style={{ marginBottom: 20, backgroundColor: '#0fb78d', color: 'white' }}>
                        Submit for Review
                    </Button>
                </Box>
            </QuestionForm>
        </QuestionSection>
    )
}

export default LastQuestion;