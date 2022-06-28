import React from '@libs/react'
import Ui from '@libs/material-ui'
import { DatePicker } from "../../../DatePicker"
import { CheckData, IQuestionProps } from "../../../../models/type"
import useApp from '../../../../hooks/useApp'
import { stylizeNumber } from '../../../../util'

const defaultCheckData: CheckData = {
    number: 0,
    date: new Date(),
    receiveDate: new Date(),
    amount: 0,
}

const AgentPaymentInfo: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    models: { deal, roles },
    Components: { DatePicker: DayPicker },
}) => {
    const { useEffect, useState } = React;
    const { Grid, Select, MenuItem, TextField, InputAdornment, Box, Button } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    const { GCIValue, agentDataList } = useApp();

    // state
    const [selectValue, setSelectValue] = useState<number>(-1);
    const [checkDataList, setCheckDataList] = useState<Array<CheckData>>([{ ...defaultCheckData }]);
    
    const [amount, setAmount] = useState<number>(0);

    const handleSelectChange = (event: any) => {
        setSelectValue(event.target.value);    
    }

    useEffect(() => {
        // when the component is shown
        if (wizard.currentStep === step) {
            setTimeout(() => {
                wizard.next();
            }, 1000);
        }
    }, [wizard.currentStep]);

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

    return (
        <QuestionSection>
            <QuestionTitle>
                Please input agent's payment info.
            </QuestionTitle>
            <QuestionForm>
            <Grid container spacing={2} style={{ marginBottom: 10 }}>
                <Grid item xs={6}>
                    <label>
                        Form of Remittance
                    </label>
                </Grid>
                <Grid item xs={6}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectValue}
                        label="Seller"
                        MenuProps={{ autoFocus: false }}
                        onChange={handleSelectChange}
                        style={{ width: '100%' }}
                    >
                        <MenuItem value={-1}>Select...</MenuItem>
                        <MenuItem value={0}>Check(s)</MenuItem>
                        <MenuItem value={1}>Bank Wire</MenuItem>
                    </Select> 
                </Grid>
            </Grid>
            {selectValue === 0 && (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <label>
                                Deal side(s) for this check
                            </label>
                        </Grid>
                        <Grid item xs={6}>
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
                        </Box>
                    )}
                    <Box style={{ marginTop: 20 }}>
                        <Button variant="contained" onClick={handleClickAddAnotherCheckButton} style={{ backgroundColor: '#0fb78d', color: 'white', paddingBottom: 2, paddingTop: 2 }}>
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
            {selectValue === 1 && (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <label>
                                Deal side
                            </label>
                        </Grid>
                        <Grid item xs={6}>
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
                </>
            )}
            </QuestionForm>
        </QuestionSection>
    )
}

export default AgentPaymentInfo;