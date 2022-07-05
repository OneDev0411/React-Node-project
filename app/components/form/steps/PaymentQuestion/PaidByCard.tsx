import React from '@libs/react'
import { IPaidByCardProps, RolePaymentsType } from '../../../../models/type';
import useApp from '../../../../hooks/useApp';


const defaultValue : RolePaymentsType = {
    role_id: "",
    unit_type: 0,
    calculated_from: 0,
}

const PaidByCard : React.FC<IPaidByCardProps> = ({ ui, name, range, cost, index }) => {
    const { Grid, TextField, InputAdornment, Box, FormControlLabel, Checkbox, RadioGroup, Radio } = ui;
    const {rolePaymentsDataInside, setRolePaymentsDataInside, rolePaymentsDataOutside, setRolePaymentsDataOutside, agentDataList} = useApp()
    
    const [rolePayments, setRolePayments] = React.useState<RolePaymentsType>(defaultValue);
    const [checkedAgent, setCheckedAgent] = React.useState(false);
    const [unitType, setUnitType] = React.useState(0);    

    const [calcSelectedValue, setCalcSelectedValue] = React.useState(0);
  
    const handleSelectedChange = (e: any, key: string) => {
        let value = Number(e.target.value);
        let updateValue = JSON.parse(JSON.stringify(rolePayments));
        updateValue[key] = value;
        setRolePayments(updateValue);
        console.log('updateValue', updateValue);
        if(range == "inside") {
            let temp = JSON.parse(JSON.stringify(rolePaymentsDataInside));
            let roleIndex = rolePaymentsDataInside.findIndex((item : RolePaymentsType) => {
                return item.role_id == updateValue.role_id;
            });
            if(roleIndex != -1)  temp[roleIndex][key] = value;
            if(setRolePaymentsDataInside !== undefined) setRolePaymentsDataInside(temp);
        }
        else {
            let temp = JSON.parse(JSON.stringify(rolePaymentsDataOutside));
            let roleIndex = rolePaymentsDataOutside.findIndex((item : RolePaymentsType) => {
                return item.role_id == updateValue.role_id;
            });
            if(roleIndex != -1)  temp[roleIndex][key] = value;
            if(setRolePaymentsDataOutside !== undefined) setRolePaymentsDataOutside(temp);
        }
        console.log('rolePayment', rolePaymentsDataInside, rolePaymentsDataOutside);
    }

    const handleCheckedValue = (e: any) => {
        console.log('handleCheckedValue', e.target.checked);
        let value = e.target.checked;
        setCheckedAgent(value);
        if(range == 'inside') {
            let temp = JSON.parse(JSON.stringify(rolePaymentsDataInside));
            if(value) {
                temp.push({...rolePayments, role_id: agentDataList[index].id})
                setRolePayments({...rolePayments, role_id: agentDataList[index].id});

                if(setRolePaymentsDataInside !== undefined) setRolePaymentsDataInside(temp);
                
            }
            else {
                setRolePayments(defaultValue);
                temp.splice(temp.findIndex((item: RolePaymentsType) => {
                    return item.role_id == agentDataList[index].id;
                }), 1);
                if(setRolePaymentsDataInside !== undefined) setRolePaymentsDataInside(temp);
            }
            
        }
        else {
            let temp = JSON.parse(JSON.stringify(rolePaymentsDataOutside));
            if(value) {
                temp.push({...rolePayments, role_id: agentDataList[index].id});
                setRolePayments({...rolePayments, role_id: agentDataList[index].id});
                if(setRolePaymentsDataOutside !== undefined) setRolePaymentsDataOutside(temp);
            }
            else {
                setRolePayments(defaultValue);
                temp.splice(temp.findIndex((item: RolePaymentsType) => {
                    return item.role_id == agentDataList[index].id;
                }), 1);
                if(setRolePaymentsDataOutside !== undefined) setRolePaymentsDataOutside(temp);
            }
        }
        console.log('rolePayment', rolePaymentsDataInside, rolePaymentsDataOutside);
    }

    React.useEffect(() => {
        if(range == "inside") {
            let temp = rolePaymentsDataInside.find((item : RolePaymentsType) => {
                return item.role_id == agentDataList[index].id;
            });
            if(temp !== undefined) {
                setRolePayments(temp);
                setCheckedAgent(true);
            }
            console.log('rolePayment', range, temp);
        }
        else {
            let temp = rolePaymentsDataOutside.find((item : RolePaymentsType) => {
                return item.role_id == agentDataList[index].id;
            });
            if(temp !== undefined) {
                setRolePayments(temp);
                setCheckedAgent(true);
            }
            console.log('rolePayment', range, temp);
        }

    }, [])

    return (
        <Box style={{ marginBottom: 20, marginTop: 0, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 4, padding: 10 }}>
            <Box style={{ alignSelf:'center', textAlign:"left" }}>
                <Checkbox size='small' style={{ marginBottom: 3 }} checked={checkedAgent} onChange={handleCheckedValue}/>
                <label>{name}</label>
            </Box>
            <Grid container spacing={1} style={{ padding: 0 }}>
                <Grid item xs={5} style={{ display: 'inherit', marginRight: 10 }}>
                    <Radio
                        checked={rolePayments.unit_type == 0}
                        onChange={(e) => handleSelectedChange(e, "unit_type")}
                        value={0}
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'A' }}
                        size="small"
                        disabled={!checkedAgent}
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
                        disabled={checkedAgent && rolePayments.unit_type == 0? false: true}
                    />
                </Grid>
                <Grid item xs={1} style={{ alignSelf: "center" }}>
                    OR
                </Grid>
                <Grid item xs={5} style={{ display: 'inherit' }}>
                    <Radio
                        checked={rolePayments.unit_type == 1}
                        onChange={(e) => handleSelectedChange(e, "unit_type")}
                        value={1}
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'B' }}
                        size="small"
                        disabled={!checkedAgent}
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
                        disabled={ checkedAgent && rolePayments.unit_type == 1? false: true}
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
                        value={rolePayments.calculated_from}
                        onChange={(e) => handleSelectedChange(e, "calculated_from")}
                        
                    >
                        <FormControlLabel value={0} style={{ marginRight: 20 }} control={<Radio size='small' style={{ marginBottom: 3 }} disabled={!checkedAgent}/>} label="My GCI" />
                        <FormControlLabel value={1} style={{ marginRight: 0 }} control={<Radio size='small' style={{ marginBottom: 3 }} disabled={!checkedAgent}/>} label="My NET" />
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