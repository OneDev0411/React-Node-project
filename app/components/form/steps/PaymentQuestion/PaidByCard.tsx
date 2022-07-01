import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IPaidByCardProps } from '../../../../models/type';

const PaidByCard : React.FC<IPaidByCardProps> = ({ name, cost }) => {
    const { Grid, TextField, InputAdornment, Box, FormControlLabel, Checkbox, RadioGroup, Radio } = Ui;

    const [selectedValue, setSelectedValue] = React.useState('a');

    const handleChange = (event: any) => {
        setSelectedValue(event.target.value);
    };

    return (
        <Box style={{ marginBottom: 20, marginTop: 0, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 4, padding: 10 }}>
            <Box style={{ alignSelf:'center', textAlign:"left" }}>
                <Checkbox size='small' style={{ marginBottom: 3 }} />
                <label>{name}</label>
            </Box>
            <Grid container spacing={1} style={{ padding: 0 }}>
                <Grid item xs={5} style={{ display: 'inherit', marginRight: 10 }}>
                    <Radio
                        checked={selectedValue === 'a'}
                        onChange={handleChange}
                        value="a"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'A' }}
                        size="small"
                    />
                    <TextField
                        size='small'
                        // value={checkData.amount}
                        // onChange={(e: any) => updateCheckDataList(index, "amount", e.target.value)}
                        type="number"
                        style={{ paddingTop: 3 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    %
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={1} style={{ alignSelf: "center" }}>
                    OR
                </Grid>
                <Grid item xs={5} style={{ display: 'inherit' }}>
                    <Radio
                        checked={selectedValue === 'b'}
                        onChange={handleChange}
                        value="b"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'B' }}
                        size="small"
                    />
                    <TextField
                        size='small'
                        // value={checkData.amount}
                        // onChange={(e: any) => updateCheckDataList(index, "amount", e.target.value)}
                        type="number"
                        style={{ paddingTop: 3 }}
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
            <Grid container spacing={1} style={{ paddingLeft: 10 }}>
                <Grid item xs={5} style={{ maxWidth: "max-content", alignSelf: "center", marginTop: 2 }}>
                    Calculated from:
                </Grid>
                <Grid item xs={7}>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel value="my gci" style={{ marginRight: 20 }} control={<Radio size='small' style={{ marginBottom: 3 }} />} label="My GCI" />
                        <FormControlLabel value="my net" style={{ marginRight: 0 }} control={<Radio size='small' style={{ marginBottom: 3 }} />} label="My NET" />
                    </RadioGroup>
                </Grid>
            </Grid>
            <Box style={{ padding: 10, paddingTop: 0 }}>
                <label style={{ marginRight:"5px" }}>Notes:</label>
                <span style={{ color: "inherit", marginTop: 2 }}>REFERRAL FEE APID OFF THE TOP PER SCOTT DURKIN</span>
            </Box>
        </Box>
    )
}
export default PaidByCard;