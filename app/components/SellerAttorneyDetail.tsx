import React from '@libs/react'
import Ui from '@libs/material-ui'
import UserInfoCard from './UserInfoCard';
import { AttorneyDetailStatus, IStepProps } from '../models/type'

const SellerAttorneyDetail: React.FC<IStepProps> = ({
    updateStep,
    Components,
    models,
}) => {
    const { useEffect, useState } = React;
    const { Grid, CircularProgress, FormControl, InputLabel, Select, Button, TextField } = Ui;
    const { RoleForm } = Components;
    const { deal, roles } = models;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    const [status, setStatus] = useState<AttorneyDetailStatus>('Loading');
    const [selectValue, setSelectValue] = useState<number>(-1);
    const [filterText, setFilterText] = useState<string>("");

    const sellerAttorneyRoles = roles.filter((role: IDealRole) => role.role === "SellerPowerOfAttorney");

    console.log('sellerAttorneyRoles:', sellerAttorneyRoles);

    useEffect(() => {
        setTimeout(() => {
            setStatus("Selecting");
        }, 1000);
    }, []);

    const handleClickEditButton = () => {
        setStatus('Updating');
    }

    const handleClickCreateNewButton = () => {
        setStatus('Inserting');
    }

    const handleChangeInput = (event: any) => {
        setFilterText(event.target.value);
    }

    const handleCloseRoleForm = () => {
        setStatus('Done');
        updateStep({ step: 6 });
    }

    const handleClickAddButton = () => {
        setStatus('Inserting');
    }

    const handleClickSkipButton = () => {
        setStatus('Skipped');
        updateStep({ step: 6 });
    }

    const getNameObject = () => {
        if (filterText === "") {
            return {};
        } else if (filterText.split(" ").length === 1) {
            return { legal_first_name: filterText }
        } else {
            return { legal_first_name: filterText.split(' ')[0], legal_last_name: filterText.split(' ')[1] }
        }
    }

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            Please enter seller's attorney's details:
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            <Grid item xs={12}>
                {status === "Loading" && <CircularProgress />}
                {status === "Selecting" && (
                    <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                        <Grid item xs={4} />
                        <Grid item xs={8}>
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
                                    {roles.map((role: IDealRole, index: number) =>
                                        <UserInfoCard
                                            roleData={role}
                                            index={index}
                                            step={4}
                                            handleClickEditButton={handleClickEditButton}
                                        />
                                    )}
                                    <label className="pointable" style={{ float: 'left', color: '#0fb78d', fontWeight: 300, paddingLeft: 15, paddingTop: 5, paddingBottom: 5 }} onClick={handleClickCreateNewButton}>
                                        + Create New Contract: <strong>'{filterText}'</strong>
                                    </label>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: 'right' }}>
                            <Button style={{ color: 'black !important', borderColor: '#dbdbdb !important', marginRight: 10 }} onClick={handleClickSkipButton}>
                                Skip
                            </Button>
                        </Grid>
                    </Grid>
                )}
                {(status === "Updating" || status === "Inserting") && (
                    <RoleForm
                        isOpen
                        deal={deal}
                        onClose={() => handleCloseRoleForm()}
                        title=" "
                        form={status === "Inserting" ? (
                            { role: "SellerPowerOfAttorney", ...getNameObject() }
                        ) : (
                            sellerAttorneyRoles[0]
                        )}
                    />
                )}
                {status === "Done" && (
                    <UserInfoCard
                        roleData={sellerAttorneyRoles[0]}
                        index={0}
                        step={4}
                        handleClickEditButton={handleClickEditButton}
                    />
                )}
                {status === "Skipped" && (
                    <Grid item xs={12} style={{ textAlign: 'right' }}>
                        <Button variant="text" style={{ marginRight: 10, color: 'black !important' }}>
                            Skipped
                        </Button>
                        <Button variant="text" className="green-button" style={{ marginRight: 10 }} onClick={handleClickAddButton}>
                            Add Info
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Grid>
    )
}

export default SellerAttorneyDetail;