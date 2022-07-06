import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IPaymentQuestionDataType, RolePaymentsType } from '../../../../models/type';
import { PaymentType, AgentData } from "../../../../models/type"
import { paymentTypeData } from '../../../../util'
import PaidByCard from './PaidByCard';
import useApp from '../../../../hooks/useApp'
import { useEffect } from 'react';

const paymentQuestionComponent : React.FC<IPaymentQuestionDataType> = ({ range, next, deal_type, updateFlag }) => {
    const { Grid, Select, MenuItem, ListSubheader,  TextField, InputAdornment, Box, Button, FormControlLabel, Checkbox, Divider } = Ui;
    const { useState } = React;

    const {paymentsDataInside, setPaymentsDataInside, paymentsDataOutside, setPaymentsDataOutside, rolePaymentsDataInside, setRolePaymentsDataInside, rolePaymentsDataOutside, setRolePaymentsDataOutside, agentDataList} = useApp();
    const [_paymentsDataInside, _setPaymentsDataInside] = React.useState(paymentsDataInside);
    const [_paymentsDataOutside, _setPaymentsDataOutside] = React.useState(paymentsDataOutside);
    
    // buffer to get all data in paidByCards
    const buffer = React.useRef<RolePaymentsType []>([]);

    const displayData = paymentTypeData.reduce((result: any, data: PaymentType) => {
        result.push(<ListSubheader>{data.groupName}</ListSubheader>);
        data.member.map((value: string, index: number) => {
            result.push(<MenuItem value={value}>{value}</MenuItem>);
        });
        return result;
    }, []);


    const handleChangeText = (text: string, key: string) => {
        
        updateFlag(true);
        if(range == "inside") {
            let temp =  JSON.parse(JSON.stringify(_paymentsDataInside));
            temp[key] = text;
            _setPaymentsDataInside(temp);
        }
        else {
            let temp =  JSON.parse(JSON.stringify(_paymentsDataOutside));
            temp[key] = text;
            _setPaymentsDataOutside(temp);
        }
        
        console.log('paymentsData', _paymentsDataInside, _paymentsDataOutside);
    }

    const getData = (data: RolePaymentsType) => {
        let dataIndex = buffer.current.findIndex((item) => {
            return item.role_id == data.role_id;
        });
        if(dataIndex != -1) buffer.current.splice(dataIndex, 1);
        buffer.current.push(data);
        console.log('data', range, data, buffer.current);
        
        if(range == "inside") {
            if(setRolePaymentsDataInside !== undefined) setRolePaymentsDataInside(buffer.current);
        }
        else {
            if(setRolePaymentsDataOutside !== undefined) setRolePaymentsDataOutside(buffer.current);
        }
    }

    React.useEffect(() => {
        // save data
        console.log('deal_type', )
        if(next) {
            if(range == "inside" && setPaymentsDataInside !== undefined) setPaymentsDataInside(_paymentsDataInside);
            if(range == "outside" && setPaymentsDataOutside !== undefined) setPaymentsDataOutside(_paymentsDataOutside);
        }
    }, [next]);
        
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
                            value={range=="inside" ? _paymentsDataInside.payment_type: _paymentsDataOutside.payment_type}
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
                        value={range=="inside" ? _paymentsDataInside.paid_to: _paymentsDataOutside.paid_to}
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
                        <>
                            {
                                (range == "inside" && deal_type == "Selling" && agent.role == "BuyerAgent") && <PaidByCard key={id} index={id} ui={Ui} name={agent.legal_full_name} range={range} note={agent.note} next={next} getData={getData} updateFlag={updateFlag}/>
                            }   
                            {
                                (range == "outside" && deal_type == "Selling" && agent.role == "SellerAgent") && <PaidByCard key={id} index={id} ui={Ui} name={agent.legal_full_name} range={range} note={agent.note} next={next} getData={getData} updateFlag={updateFlag}/>
                            }
                            {
                                (range == "inside" && deal_type == "Buying" && agent.role == "SellerAgent") && <PaidByCard key={id} index={id} ui={Ui} name={agent.legal_full_name} range={range} note={agent.note} next={next} getData={getData} updateFlag={updateFlag}/>
                            }   
                            {
                                (range == "outside" && deal_type == "Buying" && agent.role == "BuyerAgent") && <PaidByCard key={id} index={id} ui={Ui} name={agent.legal_full_name} range={range} note={agent.note} next={next} getData={getData} updateFlag={updateFlag}/>
                            }
                            {
                                (range == "outside" && deal_type == "Both" && agent.role == "BuyerAgent" || agent.role == "SellerAgent") && <PaidByCard key={id} index={id} ui={Ui} name={agent.legal_full_name} range={range} note={agent.note} next={next} getData={getData} updateFlag={updateFlag}/>
                            }
                        </>
                        
                        )
                    }
                    
                </Grid>
            </Grid>
            {
                range == "outside" &&
                <Grid container spacing={1}> 
                <Grid item xs={12}>
                    <TextField label="Company" variant="standard" style={{width: "100%"}} value={_paymentsDataOutside.company} onChange={(e) => handleChangeText(e.target.value, "company")}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Company Address" variant="standard" style={{width: "100%"}} value={_paymentsDataOutside.company_address} onChange={(e) => handleChangeText(e.target.value, "company_address")}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField label="Office #" variant="standard" style={{width: "100%"}} value={_paymentsDataOutside.office} onChange={(e) => handleChangeText(e.target.value, "office")}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField label="Cell #" variant="standard" style={{width: "100%"}} value={_paymentsDataOutside.cell} onChange={(e) => handleChangeText(e.target.value, "cell")}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField label="Fax#" variant="standard" style={{width: "100%"}} value={_paymentsDataOutside.fax} onChange={(e) => handleChangeText(e.target.value, "fax")}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Tax ID" variant="standard" style={{width: "100%"}} value={_paymentsDataOutside.tax_id} onChange={(e) => handleChangeText(e.target.value, "tax_id")}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Email" variant="standard" style={{width: "100%"}} value={_paymentsDataOutside.mail} onChange={(e) => handleChangeText(e.target.value, "mail")}/>
                </Grid>
                </Grid>
            }
        </>
    )
}
export default paymentQuestionComponent;