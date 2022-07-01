import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IPaidByCardProps } from '../../../../models/type';
import { Input } from '@material-ui/core';

const PaidByCard : React.FC<IPaidByCardProps> = ({name, cost}) => {
    const { Grid, Select, MenuItem, ListSubheader,  TextField, InputAdornment, Box, Button, FormControlLabel, Checkbox, RadioGroup, Radio } = Ui;

    const [selectedValue, setSelectedValue] = React.useState('a');

    const handleChange = (event: any) => {
        setSelectedValue(event.target.value);
    };

    return (
        <Box style={{marginBottom: "10px", marginTop:"10px"}}>
            <Grid container spacing={1}>
                <Grid item xs={4} style={{alignSelf:'center', textAlign:"left"}}>
                    <label>{name}</label>
                    <Checkbox size='small'/>
                </Grid>
                <Grid item xs={8}>
                    <Box style={{width: "100%", background: "#F0F2F5", borderRadius:"5px", padding:"5px"}}>
                        <Grid container spacing={1}>
                            <Grid item xs={5}>
                                <Grid container spacing={1}>
                                    <Grid item xs={4}>
                                        <Radio
                                            checked={selectedValue === 'a'}
                                            onChange={handleChange}
                                            value="a"
                                            name="radio-buttons"
                                            inputProps={{ 'aria-label': 'A' }}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            size='small'
                                            // value={checkData.amount}
                                            
                                            // onChange={(e: any) => updateCheckDataList(index, "amount", e.target.value)}
                                            type="number"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        %
                                                    </InputAdornment>
                                                )
                                            }}
                                            
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={1} style={{alignSelf: "center"}}>
                                OR
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container spacing={1}>
                                    <Grid item xs={4}>
                                        <Radio
                                            checked={selectedValue === 'b'}
                                            onChange={handleChange}
                                            value="b"
                                            name="radio-buttons"
                                            inputProps={{ 'aria-label': 'B' }}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            size='small'
                                            // value={checkData.amount}
                                            
                                            // onChange={(e: any) => updateCheckDataList(index, "amount", e.target.value)}
                                            type="number"
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
                            </Grid>
                            
                            
                        </Grid>
                    </Box>
                </Grid>
                
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={5} style={{alignSelf:"center", textAlign:"right"}}>
                    Calculated from:
                </Grid>
                <Grid item xs={7}>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel value="my gci" control={<Radio size='small'/>} label="My GCI" />
                        <FormControlLabel value="my net" control={<Radio size='small'/>} label="My NET" />
                    </RadioGroup>
                </Grid>
            </Grid>
            <Box style={{ textAlign:"right"}}>
                <label style={{marginRight:"5px"}}>Notes:</label>
                <span style={{ color: "inherit"}}>REFERRAL FEE APID OFF THE TOP PER SCOTT DURKIN</span>
            </Box>
            
        </Box>
    )
}
export default PaidByCard;