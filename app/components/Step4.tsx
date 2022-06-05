import React from '@libs/react'
import Ui from '@libs/material-ui'
import UserInfoCard from './UserInfoCard';
import { IStepProps, MockupContactData } from '../models/type'

const Step4: React.FC<IStepProps> = ({ 
    subStep, 
    step,
    updateStep, 
    Components,
    models,
}) => {
    const { useEffect, useState } = React;
    const { Grid, CircularProgress, FormControl, InputLabel, Select, MenuItem, Button, Input, TextField } = Ui;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;
    const { RoleForm } = Components;
    const { deal } = models;

    const [selectValue, setSelectValue] = useState<number>(-1);
    const [filterText, setFilterText] = useState<string>("");

    useEffect(() => {
        setTimeout(() => {
            updateStep({ subStep: 1 }); 
        }, 1000);
    }, []);

    const cardData: MockupContactData = {
        userName: "Alisa Edmond",
        role: "Buyer's Attorney",
        phone: "(123)456 - 7890",
        email: "aedmond@gmail.com"
    };

    const cardDataList: MockupContactData[] = [
        {
            userName: "Eli Eric",
            role: "Buyer's Attorney",
            phone: "(123)456 - 7890",
            email: "aedmond@gmail.com"
        },
        {
            userName: "Eli Eric and Caprice Doe (Partner/Spouse)",
            role: "",
            phone: "(123)456 - 7890",
            email: "aedmond@gmail.com"
        },
        {
            userName: "Elissa Rich",
            role: "Buyer's Attorney",
            phone: "(123)456 - 7890",
            email: "aedmond@gmail.com"
        },
        {
            userName: "Eli Seay",
            role: "Buyer's Attorney",
            phone: "(123)456 - 7890",
            email: "aedmond@gmail.com"
        },
        {
            userName: "Elina Beckham",
            role: "Buyer's Attorney",
            phone: "(123)456 - 7890",
            email: "aedmond@gmail.com"
        },
    ]

    const handleClickCreateNewButton = () => {
        updateStep({ subStep: 2 })
    }

    const handleChangeInput = (event: any) => {
        setFilterText(event.target.value);
    }

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            Please enter buyer's attorney's details:
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            <Grid item xs={12}>
                {(step == 4 && subStep == 0) && <CircularProgress />}
                {(step == 4 && subStep == 1) && (
                    <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                        <Grid item xs={6} />
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectValue}
                                    label="Seller"
                                    MenuProps={{ autoFocus: false }}
                                >
                                    <TextField 
                                        autoFocus
                                        value={filterText}
                                        style={{ width: '100%', paddingLeft: 15, paddingRight: 15 }} 
                                        onChange={handleChangeInput} 
                                        placeholder="Alisa Edmond"
                                    />
                                    {cardDataList.filter((cardData: MockupContactData) => cardData.userName.indexOf(filterText) >= 0).map((cardData: MockupContactData, index: number) => 
                                        <MenuItem value={index} style={{ padding: 0 }}>
                                            {/* <UserInfoCard
                                                cardData={cardData}
                                                step={4}
                                            /> */}
                                        </MenuItem>
                                    )}
                                    <label className="pointable" style={{ float: 'left', color: '#0fb78d', fontWeight: 300, paddingLeft: 15, paddingTop: 5, paddingBottom: 5 }} onClick={handleClickCreateNewButton}>
                                        + Create New Contract: <strong>'{filterText}'</strong>
                                    </label>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: 'right' }}>
                            <Button style={{ color: 'black !important', borderColor: '#dbdbdb !important', marginRight: 10 }}>
                                Skip
                            </Button>
                        </Grid>
                    </Grid>
                )}
                {(step == 4 && subStep == 2) && (
                    // <UserInfoForm 
                    //     handleClickButton={() => updateStep({ step: 5, subStep: 0 })} 
                    //     defaultFormData={{
                    //         role: 3,
                    //         firstName: "Alisa",
                    //         lastName: "Edmond",
                    //         email: "aedmond@gmail.com",
                    //         phone: "",
                    //         companyTrust: "",
                    //         currentAddress: "2972 Westheimer Rd. Santa Ana, Illinois 85486"
                    //     }}
                    //     {...BaseProps}
                    // />
                    <RoleForm isOpen deal={deal} onClose={() => updateStep({ step: 5, subStep: 0 })} /> 
                )}
                {(step >= 5) && (
                    <>
                        {/* <UserInfoCard 
                            cardData={cardData}
                            step={4}
                        /> */}
                        <Grid container className="UserInfo-Card">
                            <Grid item xs={12} style={{ textAlign: 'right' }} >
                            {(step == 4) && (
                                <Button style={{ color: 'black !important', borderColor: '#dbdbdb !important', marginRight: 10 }}>
                                    Add Another Seller
                                </Button>
                            )}
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
        </Grid>
    )
}

export default Step4;