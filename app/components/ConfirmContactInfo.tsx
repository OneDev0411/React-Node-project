import React from '@libs/react'
import Ui from '@libs/material-ui'
import { ConfirmContactStatus, IStepProps } from '../models/type'
import { roleStep, roleText } from '../util'

const ConfirmContactInfo: React.FC<IStepProps> = ({
    step,
    updateStep,
    Components,
    models,
    roleType = "Seller",  // buyer | seller | buyer's attorney | seller's attorney
}) => {
    const { useEffect, useState } = React;

    const { Grid, CircularProgress, Button, Divider, Box } = Ui;
    const { RoleForm, RoleCard, ContactRoles } = Components;
    const { deal, roles } = models;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    const [status, setStatus] = useState<ConfirmContactStatus>('Loading');
    const [upsertingIndex, setUpsertingIndex] = useState<number>(0); // last upserting role index
    const [fromSelectObject, setFromSelectObject] = useState<any>(null); // data from dropdown select, can be IDealRole object or nameObject

    const matchRoles = roles.filter((role: IDealRole) => role.role === roleType);

    // mockup loading
    useEffect(() => {
        setTimeout(() => {
            if (matchRoles.length) {
                setStatus('Validating');
            } else {
                setStatus("Upserting");
                setUpsertingIndex(-1);
            }
        }, 100);  // TEST_CODE
    }, []);

    const handleUpsertValidatingRole = (upsertingRole: IDealRole) => {
        // in case of showing match role for validating
        if (upsertingRole.id === matchRoles[upsertingIndex].id) {  
            // in case of save button of role form which is shown not last is clicked
            if (upsertingIndex < matchRoles.length - 1) {  
                setUpsertingIndex(upsertingIndex + 1);
                window.scrollTo({  // NEED_TO_UPDATE_THIS_CODE
                    top: 0,
                    behavior: 'smooth'
                });
            }
            // in case of last shown role form's save button is clicked
            else {
                setStatus('Listing');
            }
        }
        // in case of showing match role for inserting or updating
        // ...
    }

    const handleCloseRoleForm = () => {
        // in case of no match role, ignore cancel action
        if (matchRoles.length === 0) {
            return;
        }
        // in case of buyer/seller attorney, click cancel button when no match roles, skip
        if (roleType.indexOf("Attorney") > 0 && matchRoles.length === 0) {
            setStatus("Skipped");   
            updateStep({ step: roleStep[roleType] + 1, subStep: 0 });
        } 
        // regular cancel action
        else {
            setStatus("Listing");
            setFromSelectObject(null);
        }
    }

    const handleClickEditButton = (role: IDealRole) => {
        setFromSelectObject(role);
        setStatus('Upserting');
    }

    const handleClickAddAnotherButton = () => {
        setStatus('Selecting');
        setUpsertingIndex(-1);
    }

    const handleClickNextButton = () => {
        updateStep({ step: roleStep[roleType] + 1, subStep: 0 });
    }

    const handleClickSkipButton = () => {
        setStatus('Skipped');
        updateStep({ step: roleStep[roleType] + 1, subStep: 0 });
    }

    const handleSelectContact = (contact: Partial<IDealFormRole>) => {
        setFromSelectObject(contact);
        setStatus("Upserting");
    }

    const handleClickCancelAddButton = () => {
        setStatus("Listing");
    }

    const matchRoleElements = matchRoles.map((role: IDealRole, index: number) =>
        <Grid container className="UserInfo-Card">
            <Grid item xs={7} />
            <Grid item xs={5}>
                <RoleCard 
                    role={role}
                    key={index}
                    readonly
                    onClickEdit={() => handleClickEditButton(role)}
                    // onClickRemove={handleClickEraseButton}
                />
            </Grid>
        </Grid>
    );

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            Please confirm {roleText[roleType]}'s details.
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            <Grid item xs={12}>
                {status === "Loading" && <CircularProgress />}
                {status === "Validating" && (
                    <>
                        {matchRoles.slice(0, upsertingIndex + 1).map((roleData: IDealRole, index: number) =>
                            <Grid container className="UserInfo-Card">
                                <Grid item xs={4} />
                                <Grid item xs={8}>
                                    <RoleForm
                                        isOpen
                                        deal={deal}
                                        onUpsertRole={handleUpsertValidatingRole}
                                        title=" "
                                        form={{ ...roleData, role: roleType }}
                                        key={index}
                                    />
                                </Grid>
                            </Grid>
                        )}
                        {!(roleType === "Buyer" || roleType === "Seller") && (
                            <Grid item xs={12} style={{ textAlign: 'right' }}>
                                <Button variant="outlined" style={{ color: 'black !important', borderColor: '#dbdbdb !important', marginRight: 135, marginTop: -60 }} onClick={handleClickSkipButton}>
                                    Skip
                                </Button>
                            </Grid>
                        )}
                    </>
                )}
                {status === "Upserting" && (
                    <Grid container className="UserInfo-Card">
                        <Grid item xs={4} />
                        <Grid item xs={8}>
                            <RoleForm
                                isOpen
                                deal={deal}
                                onClose={handleCloseRoleForm}
                                title=" "
                                form={fromSelectObject === null ? (upsertingIndex >= 0 ? { ...matchRoles[upsertingIndex], role: roleType } : { role: roleType })
                                    : { ...fromSelectObject, role: roleType }}
                            />
                        </Grid>
                    </Grid>
                )}
                {status === "Listing" && roleType !== undefined && (
                    <>
                        {matchRoleElements}
                        <Grid container className="UserInfo-Card">
                            <Grid item xs={12} style={{ textAlign: 'right' }} >
                                <Button onClick={handleClickAddAnotherButton} style={{ color: 'black !important', border: 'solid #dbdbdb 1px', borderRadius: 5 }}>
                                    Add Another {roleType}
                                </Button>
                                {step <= roleStep[roleType] && (
                                    <Button variant="contained" onClick={handleClickNextButton} style={{ backgroundColor: '#0fb78d', color: 'white', marginLeft: 10 }}>
                                        Looks Good, Next
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    </>
                )}
                {status === "Selecting" && (
                    <>
                        {matchRoleElements}
                        <Grid container className="UserInfo-Card">
                            <Grid item xs={7} />
                            <Grid item xs={5} style={{ textAlign: 'right' }}>
                                <ContactRoles
                                    placeholder={`Enter ${roleText[roleType]}'s names`}
                                    onSelectRole={handleSelectContact}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: 'right' }}>
                            <Button onClick={handleClickCancelAddButton} style={{ color: 'black !important', border: 'solid #dbdbdb 1px', borderRadius: 5 }}>
                                Cancel
                            </Button>
                        </Grid>
                    </>
                )}
                {status === "Skipped" && (
                    <Grid item xs={12}>
                        <Box style={{ display: "flex", flexDirection: "row-reverse", textAlign: 'right', alignItems: "revert" }}>
                            <Button variant="text" className="green-button" style={{ marginRight: 10, marginLeft: 10 }} onClick={handleClickAddAnotherButton}>
                                Add Info
                            </Button>
                            <Divider orientation="vertical" flexItem />
                            <Button variant="text" style={{ marginRight: 10, color: 'black !important' }}>
                                Skipped
                            </Button>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Grid>
    )
}

export default ConfirmContactInfo;