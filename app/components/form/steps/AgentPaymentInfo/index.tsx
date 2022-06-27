import React from '@libs/react'
import Ui from '@libs/material-ui'
import { DatePicker } from "../../../DatePicker"
import { AgentData, GCISplitStatus, IQuestionProps } from "../../../../models/type"
import useApp from '../../../../hooks/useApp'
import { stylizeNumber } from '../../../../util'

const AgentPaymentInfo: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    models: { deal, roles },
    Components: { DatePicker: DayPicker },
}) => {
    const { useEffect, useState } = React;
    const { Grid, Select, MenuItem, TextField, InputAdornment, Box } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    const { GCIValue, agentDataList } = useApp();

    // state
    const [selectValue, setSelectValue] = useState<number>(-1);
    const [checkValue, setCheckValue] = useState<number>(0);
    const [checkDate, setCheckDate] = useState<Date>(new Date());
    const [checkReceivedDate, setCheckReceivedDate] = useState<Date>(new Date());
    const [amount, setAmount] = useState<number>(0);

    const handleSelectChange = (event: any) => {
        console.log('value:', event.target.value);
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
                    <Box style={{ marginBottom: 10 }}>
                        <TextField
                            size='small'
                            value={checkValue}
                            style={{ width: '100%' }}
                            onChange={(e: any) => setCheckValue(e.target.value)}
                            type="number"
                            label="Check #"
                        />
                    </Box>
                    <Box style={{ marginBottom: 10 }}>
                        <DatePicker
                            Picker={DayPicker} 
                            value={checkDate}
                            setValue={setCheckDate}
                            label="Date on check"
                        />
                    </Box>
                    <Box style={{ marginBottom: 10 }}>
                        <DatePicker
                            Picker={DayPicker} 
                            value={checkReceivedDate}
                            setValue={setCheckReceivedDate}
                            label="Date check received"
                        />
                    </Box>
                    <Box style={{ marginBottom: 10 }}>
                        <TextField
                            size='small'
                            value={amount}
                            style={{ width: '100%' }}
                            onChange={(e: any) => setAmount(e.target.value)}
                            // type="number"
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
                            // type="number"
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