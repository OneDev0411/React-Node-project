import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IPaymentQuestionDataType } from '../../../../models/type';
import { PaymentType } from "../../../../models/type"
import { paymentTypeData } from '../../../../util'
import PaidByCard from './PaidByCard';

const paymentQuestionComponent : React.FC<IPaymentQuestionDataType> = ({ role }) => {
    const { Grid, Select, MenuItem, ListSubheader,  TextField, InputAdornment, Box, Button, FormControlLabel, Checkbox, Divider } = Ui;
    const { useState } = React;

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

    return (
        <>
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
            {
                role == "seller" &&
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
            }
        </>
    )
}
export default paymentQuestionComponent;