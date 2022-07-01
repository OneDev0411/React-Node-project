import React from '@libs/react'
import Ui from '@libs/material-ui'
import { DatePicker } from "../../../DatePicker"
import { CheckData, IQuestionProps, RemittanceStatus, PaymentType } from "../../../../models/type"
import useApp from '../../../../hooks/useApp'
import { stylizeNumber, paymentTypeData } from '../../../../util'
import PaidByCard from './PaidByCard';


const defaultCheckData: CheckData = {
    number: 0,
    date: new Date(),
    receiveDate: new Date(),
    amount: 0,
}

const PaymentQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    models: { deal, roles },
    Components: { DatePicker: DayPicker },
}) => {
    const { useState } = React;
    const { Grid, Select, MenuItem, ListSubheader,  TextField, InputAdornment, Box, Button, FormControlLabel, Checkbox, Divider } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    const { GCIValue, agentDataList } = useApp();

    const showBoth = true;
    // const shouwBoth = deal.context.ender_type.text === "AgentDoubleEnder" || deal.context.ender_type.text === "OfficeDoubleEnder";
    const showBuy = showBoth || deal.deal_type === "Buying";

    // state
    const [status, setStatus] = useState<RemittanceStatus>(showBuy ? 'ShowBuy' : 'ShowSell');
    const [selectValue, setSelectValue] = useState<number>(-1);
    const [checkDataList, setCheckDataList] = useState<Array<CheckData>>([{ ...defaultCheckData }]);
    
    const [showButton, setShowButton] = useState<boolean>(true);
    // const [showBuy, setShowBuy] = useState<boolean>(showBoth || deal.deal_type === "Buying");
    // const [showSell, setShowSell] = useState<boolean>(deal.deal_type === "Selling");

    const handleSelectChange = (event: any) => {
        setSelectValue(event.target.value);    
    }

    const handleClickAddAnotherCheckButton = (event: any) => {
        let _checkDataList = checkDataList.slice();
        _checkDataList.push({ ...defaultCheckData });
        setCheckDataList(_checkDataList);
    }

    const handleClickRemoveButton = (event: any) => {
        let _checkDataList = checkDataList.slice();
        _checkDataList.pop();
        setCheckDataList(_checkDataList);
    }

    const updateCheckDataList = (index: number, key: keyof CheckData, value: any) => {
        let _checkDataList: CheckData[] = checkDataList.slice();
        _checkDataList[index][key] = value;
        setCheckDataList(_checkDataList);
    }

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
        if (status === "ShowBuy") { 
            if (showBoth) { // shows sell part
                setStatus("ShowSell");
            } else {
                gotoNext();
            }
        } else {
            gotoNext();
        }
    }
    
    const gotoNext = () => {
        setShowButton(false);
        setTimeout(() => {
            wizard.next();
        }, 80);
    }

    // variables
    // const showBuy =  showBoth || deal.deal_type === "Buying";
    // const showSell =  deal.deal_type === "Selling"; // if showBoth is ture, enables true when cliking button

    return (
        <QuestionSection>
            <QuestionTitle>
                Please input agent's payment info.
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
                       <TextField 
                            variant="standard" 
                            style={{width: "100%"}} 
                            defaultValue="Preston Maguire (575 Madison Ave)"
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <label style={{ marginTop: 5 }}>Paid By</label>
                    </Grid>
                    <Grid item xs={9}>
                        <PaidByCard name='Jeff Adler' cost={2000} />
                        <PaidByCard name='Marie Espinal' cost={2000} />
                    </Grid>
                </Grid>
                <Grid container spacing={1}> 
                    <Grid item xs={12}>
                       <TextField id="standard-basic" label="Company" variant="standard" style={{width: "100%"}} />
                    </Grid>
                    <Grid item xs={12}>
                       <TextField id="standard-basic" label="Company Address" variant="standard" style={{width: "100%"}} />
                    </Grid>
                    <Grid item xs={4}>
                       <TextField id="standard-basic" label="Office #" variant="standard" style={{width: "100%"}} />
                    </Grid>
                    <Grid item xs={4}>
                       <TextField id="standard-basic" label="Cell #" variant="standard" style={{width: "100%"}} />
                    </Grid>
                    <Grid item xs={4}>
                       <TextField id="standard-basic" label="Fax#" variant="standard" style={{width: "100%"}} />
                    </Grid>
                    <Grid item xs={6}>
                       <TextField id="standard-basic" label="Tax ID" variant="standard" style={{width: "100%"}} />
                    </Grid>
                    <Grid item xs={6}>
                       <TextField id="standard-basic" label="Email" variant="standard" style={{width: "100%"}} />
                    </Grid>
                </Grid>
            {showButton && (
                <Box style={{ textAlign: 'right', marginTop:"20px", paddingBottom:"20px" }}>
                    <Button variant="contained" onClick={handleClickNextButton} style={{ marginBottom: 20, backgroundColor: '#0fb78d', color: 'white' }}>
                        Looks good, Next
                    </Button>
                </Box>
            )}
            </QuestionForm>
        </QuestionSection>
    )
}

export default PaymentQuestion;