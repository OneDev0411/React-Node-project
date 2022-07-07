import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IPaymentQuestionDataType } from '../../../../models/type';
import { PaymentType, IRoleData } from "../../../../models/type"
import { paymentTypeData } from '../../../../util'
import PaidByCard from './PaidByCard';
import useApp from '../../../../hooks/useApp'
import { useEffect } from 'react';

const paymentQuestionComponent : React.FC<IPaymentQuestionDataType> = ({ range, next, deal_type, updateFlag }) => {
    const { Grid, Select, MenuItem, ListSubheader,  TextField, InputAdornment, Box, Button, FormControlLabel, Checkbox, Divider } = Ui;
    const { useState } = React;

    const {dealData, setDealData, roleData, setRoleData} = useApp();
    
    const [_dealData, _setDealData] = React.useState({...dealData});
    // buffer to get all data in paidByCards
    const buffer = React.useRef<IRoleData[]>([]);

    const displayData = paymentTypeData.reduce((result: any, data: PaymentType) => {
        result.push(<ListSubheader>{data.groupName}</ListSubheader>);
        data.member.map((value: string, index: number) => {
            result.push(<MenuItem value={value}>{value}</MenuItem>);
        });
        return result;
    }, []);


    const handleChangeText = (value: string, key: string) => {
        
        updateFlag(true);
        let temp =  JSON.parse(JSON.stringify(_dealData));
        temp[key] = value;
        _setDealData(temp);
        console.log('handleChangeText', temp, );
       
    }

    const getData = (data: IRoleData) => {
        let dataIndex = roleData.findIndex((item) => {
            return item.role_id == data.role_id;
        });
        roleData[dataIndex] = data;
        let temp = JSON.parse(JSON.stringify(roleData));
        if(setRoleData !== undefined) setRoleData(temp);
        console.log('payment temp', temp);
    }

    React.useEffect(() => {
        // save data
        console.log('_deal_data', _dealData);
        if(next) {
            if(setDealData !== undefined) setDealData(_dealData);
        }
    }, [next]);

    React.useEffect(() => {
        console.log('payment component', dealData);
        _setDealData(dealData);
    }, [dealData]);
        
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
                            value={range=="inside" ? _dealData.inside_de_payment_type: _dealData.outside_de_payment_type}
                            onChange={(e) => handleChangeText(e.target.value as string, range == "inside" ? "inside_de_payment_type": "outside_de_payment_type")}
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
                        value={range=="inside" ? _dealData.inside_de_paid_to: _dealData.outside_de_paid_to}
                        onChange={(e) => handleChangeText(e.target.value, range == "inside" ? "inside_de_paid_to" : "outside_de_paid_to")}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <label style={{ marginTop: 5 }}>Paid By</label>
                </Grid>
                <Grid item xs={9}>
                    {
                        roleData.map((agent: IRoleData, id: number) => 
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
                    <TextField label="Company" variant="standard" style={{width: "100%"}} value={_dealData.outside_de_payment_company} onChange={(e) => handleChangeText(e.target.value, "outside_de_payment_company")}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Company Address" variant="standard" style={{width: "100%"}} value={_dealData.outside_de_payment_company_address} onChange={(e) => handleChangeText(e.target.value, "outside_de_payment_company_address")}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField label="Office #" variant="standard" style={{width: "100%"}} value={_dealData.outside_de_payment_office} onChange={(e) => handleChangeText(e.target.value, "outside_de_payment_office")}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField label="Cell #" variant="standard" style={{width: "100%"}} value={_dealData.outside_de_payment_cell} onChange={(e) => handleChangeText(e.target.value, "outside_de_payment_cell")}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField label="Fax#" variant="standard" style={{width: "100%"}} value={_dealData.outside_de_payment_fax} onChange={(e) => handleChangeText(e.target.value, "outside_de_payment_fax")}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Tax ID" variant="standard" style={{width: "100%"}} value={_dealData.outside_de_payment_tax_id} onChange={(e) => handleChangeText(e.target.value, "outside_de_payment_tax_id")}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Email" variant="standard" style={{width: "100%"}} value={_dealData.outside_de_payment_mail} onChange={(e) => handleChangeText(e.target.value, "outside_de_payment_mail")}/>
                </Grid>
                </Grid>
            }
        </>
    )
}
export default paymentQuestionComponent;