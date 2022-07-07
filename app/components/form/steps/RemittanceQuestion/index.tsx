import React from '@libs/react'
import Ui from '@libs/material-ui'
import { DatePicker } from "../../../DatePicker"
import { CheckData, IDealData, IQuestionProps, IRemittanceChecks, RemittanceStatus } from "../../../../models/type"
import useApp from '../../../../hooks/useApp'
import { stylizeNumber, defaultRemittanceChecks } from '../../../../util'

const defaultCheckData: IRemittanceChecks = {
    deal_id: "",
    check_id: 0,
    check_num: 0,
    check_date: new Date(),
    check_receive_date: new Date(),
    amount: 0,
}

const RemittanceQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    models: { deal, roles },
    Components: { DatePicker: DayPicker },
}) => {
    const { useState } = React;
    const { Grid, Select, MenuItem, TextField, InputAdornment, Box, Button } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    const { dealData, setDealData, remittanceChecks, setRemittanceChecks, roleData } = useApp();
    const showBoth = deal.context.ender_type !== undefined;
    // const shouwBoth = deal.context.ender_type.text === "AgentDoubleEnder" || deal.context.ender_type.text === "OfficeDoubleEnder";
    const showBuy = showBoth || deal.deal_type === "Buying";

    // state
    const [_remittanceChecks, _setRemittanceChecks] = useState<IRemittanceChecks[]>(remittanceChecks.length > 0 ? remittanceChecks: defaultRemittanceChecks);
    const [status, setStatus] = useState<RemittanceStatus>(showBuy ? 'ShowBuy' : 'ShowSell');
    const [selectValue, setSelectValue] = useState<number>(-1);
    const [_dealData, _setDealData] = useState<IDealData>(dealData);
    const [showButton, setShowButton] = useState<boolean>(true);
    // const [showBuy, setShowBuy] = useState<boolean>(showBoth || deal.deal_type === "Buying");
    // const [showSell, setShowSell] = useState<boolean>(deal.deal_type === "Selling");

    const handleSelectChange = (event: any) => {
        if(!showButton) setShowButton(true);
        setSelectValue(event.target.value);
    }

    const handleClickAddAnotherCheckButton = (event: any) => {
        if(!showButton) setShowButton(true);
        let temp = _remittanceChecks.slice();
        temp.push({ ...defaultCheckData, deal_id: deal.id });
        _setRemittanceChecks(temp);
    }

    const handleClickRemoveButton = (event: any) => {
        if(!showButton) setShowButton(true);
        let temp = _remittanceChecks.slice();
        temp.pop();
        _setRemittanceChecks(temp);
    }

    const updateCheckDataList = (index: number, key: keyof IRemittanceChecks, value: any ) => {
        if(!showButton) setShowButton(true);
        let temp = _remittanceChecks.slice();
        if(key == "check_id") temp[index][key] = value;
        if(key == "check_num") temp[index][key] = value;
        if(key == "check_date") temp[index][key] = value;
        if(key == "check_receive_date") temp[index][key] = value;
        _setRemittanceChecks(temp);
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
        saveData();
        setShowButton(false);
        
        setTimeout(() => {
            wizard.next();
        }, 1000);
    }

    const saveData = () => {
        if(setRemittanceChecks !== undefined) setRemittanceChecks(_remittanceChecks);
        if(setDealData !== undefined) {
            dealData.remittance_bank_wire_amount = _dealData.remittance_bank_wire_amount
            dealData.stage_cost = _dealData.stage_cost;
            let temp = JSON.parse(JSON.stringify(dealData));
            setDealData(temp);
        }
        console.log('remittance step', dealData, roleData);
        
    }

    const handleValueChange = (value: any, key: string) => {
        if(!showButton) setShowButton(true);
        if ((Number(value) + "") === "NaN" || (value + "").length > 16 ) {
            return;
        }
        
        value = Number(value);
        let temp = JSON.parse(JSON.stringify(_dealData));
        temp[key] = value;
        _setDealData(temp);

    }

    // variables
    // const showBuy =  showBoth || deal.deal_type === "Buying";
    // const showSell =  deal.deal_type === "Selling"; // if showBoth is ture, enables true when cliking button

    return (
        <QuestionSection>
            <QuestionTitle>
                Please input remittance info.
            </QuestionTitle>
            <QuestionForm>
            {(status === "ShowBuy" || showBoth) && (
                <>
                    <Grid container spacing={2} style={{ marginBottom: 10 }}>
                        <Grid item xs={4}>
                            <label>
                                Form of Remittance
                            </label>
                        </Grid>
                        <Grid item xs={8}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={0}
                                // value={selectValue}
                                label="Seller"
                                MenuProps={{ autoFocus: false }}
                                // onChange={handleSelectChange}
                                style={{ width: '100%' }}
                            >
                                <MenuItem value={-1}>Select...</MenuItem>
                                <MenuItem value={0}>Check(s)</MenuItem>
                                <MenuItem value={1}>Bank Wire</MenuItem>
                            </Select> 
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <label>
                                Deal side
                                {/* Deal side(s) for this check */}
                            </label>
                        </Grid>
                        <Grid item xs={8}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={-1}
                                label="Seller"
                                MenuProps={{ autoFocus: false }}
                                style={{ width: '100%' }}
                            >
                                <MenuItem value={-1}>Buy Side</MenuItem>
                                <MenuItem value={0}>Listing Side</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                    {_remittanceChecks.map((checkData: IRemittanceChecks, index: number) => 
                        <Box style={{ marginTop: 20 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <label>{`Check - ${index + 1}`}</label>
                                </Grid>
                                <Grid item xs={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                size='small'
                                                value={checkData.check_num}
                                                style={{ width: '100%' }}
                                                onChange={(e: any) => updateCheckDataList(index, "check_num", e.target.value)}
                                                type="number"
                                                label="Check #"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                size='small'
                                                value={checkData.amount}
                                                style={{ width: '100%' }}
                                                onChange={(e: any) => updateCheckDataList(index, "amount", e.target.value)}
                                                type="number"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            $
                                                        </InputAdornment>
                                                    )
                                                }}
                                                label="Amount"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <DatePicker
                                                Picker={DayPicker} 
                                                value={checkData.check_date}
                                                setValue={(value: Date) => updateCheckDataList(index, "check_date", value)}
                                                label="Date on check"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <DatePicker
                                                Picker={DayPicker} 
                                                value={checkData.check_receive_date}
                                                setValue={(value: Date) => updateCheckDataList(index, "check_receive_date", value)}
                                                label="Date check received"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    <Box style={{ marginTop: 20 }}>
                        {/* <Button variant="contained" onClick={handleClickAddAnotherCheckButton} style={{ backgroundColor: '#0fb78d', color: 'white', paddingBottom: 2, paddingTop: 2 }}> */}
                            {/* + Add another check */}
                        {/* </Button> */}
                        <Button variant="outlined" onClick={handleClickAddAnotherCheckButton} style={{ color: 'black !important', borderColor: '#dbdbdb !important', paddingBottom: 2, paddingTop: 2, marginLeft: 10 }}>
                            + Add another check
                        </Button>
                        {_remittanceChecks.length > 1 && (
                            <Button variant="outlined" onClick={handleClickRemoveButton} style={{ color: 'black !important', borderColor: '#dbdbdb !important', paddingBottom: 2, paddingTop: 2, marginLeft: 10 }}>
                                Remove one
                            </Button>
                        )}
                    </Box>
                </>
            )}
            {status === "ShowSell" && (
                <Box style={{ marginTop: 40 }}>
                    <Grid container spacing={2} style={{ marginBottom: 10 }}>
                        <Grid item xs={4}>
                            <label>
                                Form of Remittance
                            </label>
                        </Grid>
                        <Grid item xs={8}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={1}
                                // value={selectValue}
                                label="Seller"
                                MenuProps={{ autoFocus: false }}
                                // onChange={handleSelectChange}
                                style={{ width: '100%' }}
                            >
                                <MenuItem value={-1}>Select...</MenuItem>
                                <MenuItem value={0}>Check(s)</MenuItem>
                                <MenuItem value={1}>Bank Wire</MenuItem>
                            </Select> 
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <label>
                                Deal side
                            </label>
                        </Grid>
                        <Grid item xs={8}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={0}
                                label="Seller"
                                MenuProps={{ autoFocus: false }}
                                style={{ width: '100%' }}
                            >
                                <MenuItem value={-1}>Buy Side</MenuItem>
                                <MenuItem value={0}>Listing Side</MenuItem>
                            </Select> 
                        </Grid>
                    </Grid>
                    <Box style={{ marginBottom: 10, marginTop: 20 }}>
                        <TextField
                            size='small'
                            value={_dealData.remittance_bank_wire_amount}
                            style={{ width: '100%' }}
                            onChange={(e: any) => handleValueChange(e.target.value, "remittance_bank_wire_amount")}
                            type="text"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        $
                                    </InputAdornment>
                                )
                            }}
                            label="Brokerage Commission"
                        />
                    </Box>
                    <Box style={{ marginBottom: 10 }}>
                        <TextField
                            size='small'
                            value={_dealData.stage_cost}
                            onChange={(e: any) => handleValueChange(Number(e.target.value), "stage_cost")}
                            style={{ width: '100%' }}
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        $
                                    </InputAdornment>
                                )
                            }}
                            label="Staging Costs Due to DE"
                        />
                    </Box>
                    <Box style={{ marginBottom: 10 }}>
                        <TextField
                            size='small'
                            value={_dealData.remittance_bank_wire_amount + _dealData.stage_cost}
                            style={{ width: '100%' }}
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        $
                                    </InputAdornment>
                                )
                            }}
                            label="Total Due at Closing"
                        />
                        
                    </Box>
                </Box>
            )}
            {showButton && (
                <Box style={{ textAlign: 'right' }}>
                    <Button variant="contained" onClick={handleClickNextButton} style={{ marginBottom: 20, backgroundColor: '#0fb78d', color: 'white' }}>
                        Looks good, Next
                    </Button>
                </Box>
            )}
            </QuestionForm>
        </QuestionSection>
    )
}

export default RemittanceQuestion;