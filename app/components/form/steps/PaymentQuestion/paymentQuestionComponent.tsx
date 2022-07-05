import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IPaymentQuestionDataType } from '../../../../models/type';
import { PaymentType, AgentData } from "../../../../models/type"
import { paymentTypeData } from '../../../../util'
import PaidByCard from './PaidByCard';
import useApp from '../../../../hooks/useApp'
import { useEffect } from 'react';

const paymentQuestionComponent : React.FC<IPaymentQuestionDataType> = ({ role }) => {
    const { Grid, Select, MenuItem, ListSubheader,  TextField, InputAdornment, Box, Button, FormControlLabel, Checkbox, Divider } = Ui;
    const { useState } = React;
    const {paymentsDataInside, setPaymentsDataInside, paymentsDataOutside, setPaymentsDataOutside, agentDataList} = useApp();

    const displayData = paymentTypeData.reduce((result: any, data: PaymentType) => {
        result.push(<ListSubheader>{data.groupName}</ListSubheader>);
        data.member.map((value: string, index: number) => {
            result.push(<MenuItem value={value}>{value}</MenuItem>);
        });
        return result;
    }, []);


    const handleChangeText = (text: string, key: string) => {
        
        
        if(role == "inside") {
            let temp =  JSON.parse(JSON.stringify(paymentsDataInside));
            temp[key] = text;
            if(setPaymentsDataInside !== undefined) setPaymentsDataInside(temp);
        }
        else {
            let temp =  JSON.parse(JSON.stringify(paymentsDataOutside));
            temp[key] = text;
            if(setPaymentsDataOutside !== undefined) setPaymentsDataOutside(temp);
        }
        
        console.log('paymentsData', paymentsDataInside, paymentsDataOutside);
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
                            value={role=="inside" ? paymentsDataInside.payment_type: paymentsDataOutside.payment_type}
                            onChange={(e) => handleChangeText(e.target.value as string, "payment_type")}
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
                        value={role=="inside" ? paymentsDataInside.paid_to: paymentsDataOutside.paid_to}
                        onChange={(e) => handleChangeText(e.target.value, "paid_to")}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <label style={{ marginTop: 5 }}>Paid By</label>
                </Grid>
                <Grid item xs={9}>
                    {
                        agentDataList.map((agent: AgentData, id: number) => 
                            <PaidByCard key={id} index={id} ui={Ui} name={agent.legal_full_name} range={role} cost={2000} />
                        )
                    }
                    
                </Grid>
            </Grid>
            {
                role == "outside" &&
                <Grid container spacing={1}> 
                <Grid item xs={12}>
                    <TextField id="standard-basic" label="Company" variant="standard" style={{width: "100%"}} value={paymentsDataInside.company} onChange={(e) => handleChangeText(e.target.value, "company")}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField id="standard-basic" label="Company Address" variant="standard" style={{width: "100%"}} value={paymentsDataOutside.company_address} onChange={(e) => handleChangeText(e.target.value, "company_address")}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField id="standard-basic" label="Office #" variant="standard" style={{width: "100%"}} value={paymentsDataOutside.office} onChange={(e) => handleChangeText(e.target.value, "office")}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField id="standard-basic" label="Cell #" variant="standard" style={{width: "100%"}} value={paymentsDataOutside.cell} onChange={(e) => handleChangeText(e.target.value, "cell")}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField id="standard-basic" label="Fax#" variant="standard" style={{width: "100%"}} value={paymentsDataOutside.fax} onChange={(e) => handleChangeText(e.target.value, "fax")}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField id="standard-basic" label="Tax ID" variant="standard" style={{width: "100%"}} value={paymentsDataOutside.tax_id} onChange={(e) => handleChangeText(e.target.value, "tax_id")}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField id="standard-basic" label="Email" variant="standard" style={{width: "100%"}} value={paymentsDataOutside.mail} onChange={(e) => handleChangeText(e.target.value, "mail")}/>
                </Grid>
                </Grid>
            }
        </>
    )
}
export default paymentQuestionComponent;