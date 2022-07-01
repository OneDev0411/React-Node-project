import React from '@libs/react'
import Ui from '@libs/material-ui'
import { DatePicker } from "../../../DatePicker"
import { CheckData, IQuestionProps, RemittanceStatus } from "../../../../models/type"
import useApp from '../../../../hooks/useApp'
import { stylizeNumber } from '../../../../util'

const defaultCheckData: CheckData = {
    number: 0,
    date: new Date(),
    receiveDate: new Date(),
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
    const { GCIValue, agentDataList } = useApp();

    const showBoth = true;
    // const shouwBoth = deal.context.ender_type.text === "AgentDoubleEnder" || deal.context.ender_type.text === "OfficeDoubleEnder";
    const showBuy = showBoth || deal.deal_type === "Buying";

    // state
    const [status, setStatus] = useState<RemittanceStatus>(showBuy ? 'ShowBuy' : 'ShowSell');
    const [selectValue, setSelectValue] = useState<number>(-1);
    const [checkDataList, setCheckDataList] = useState<Array<CheckData>>([{ ...defaultCheckData }]);
    const [amount, setAmount] = useState<number>(0);
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
                    {checkDataList.map((checkData: CheckData, index: number) => 
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
                                                value={checkData.number}
                                                style={{ width: '100%' }}
                                                onChange={(e: any) => updateCheckDataList(index, "number", e.target.value)}
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
                                                value={checkData.date}
                                                setValue={(value: Date) => updateCheckDataList(index, "date", value)}
                                                label="Date on check"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <DatePicker
                                                Picker={DayPicker} 
                                                value={checkData.receiveDate}
                                                setValue={(value: Date) => updateCheckDataList(index, "receiveDate", value)}
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
                        {checkDataList.length > 1 && (
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
                    <Box style={{ marginBottom: 10 }}>
                        <TextField
                            size='small'
                            value={amount}
                            style={{ width: '100%' }}
                            onChange={(e: any) => setAmount(e.target.value)}
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