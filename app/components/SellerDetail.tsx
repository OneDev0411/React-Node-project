import React from '@libs/react'
import Ui from '@libs/material-ui'
import UserInfoCard from './UserInfoCard'
import { DetailStatus, IStepProps } from '../models/type'

const SellerDetail: React.FC<IStepProps> = ({
    step,
    updateStep,
    Components,
    models,
}) => {
    const { useEffect, useState } = React;

    const { Grid, CircularProgress, Button } = Ui;
    const { RoleForm } = Components;
    const { deal, roles } = models;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    const [status, setStatus] = useState<DetailStatus>('Loading');
    const [upsertingIndex, setUpsertingIndex] = useState<number>(0); // last upserting role index

    const sellerRoles = roles.filter((role: IDealRole) => role.role === "Seller");
    console.log('sellerRoles:', sellerRoles);

    // mockup loading
    useEffect(() => {
        setTimeout(() => {
            if (sellerRoles.length) {
                setStatus('Validating');
            } else {
                setStatus("Upserting");
                setUpsertingIndex(-1);
            }
        }, 100);  // TEST_CODE
    }, []);

    const handleUpsertValidatingRole = async (upsertingRole: IDealRole) => {
        console.log('upsertingRole:', upsertingRole);

        if(upsertingRole.id === sellerRoles[upsertingIndex].id) {  // clicking save button of last displayed role form
            if (upsertingIndex < sellerRoles.length - 1) {   // if it's not the role form of last seller/buyer 
                setUpsertingIndex(upsertingIndex + 1);
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                setStatus('Listing');
            }
        }
    }

    const handleCloseRoleForm = () => {
        if (status === "Upserting") {
            setStatus("Listing");
        }
    }

    const handleClickEditButton = (index: number) => {
        console.log('datea');
        setStatus('Upserting');
        setUpsertingIndex(index);
    }

    const handleClickAddAnotherButton = () => {
        setStatus('Upserting');
        setUpsertingIndex(-1);
    }

    const handleClickNextButton = () => {
        updateStep({ step: 3, subStep: 0 });
    }

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            Please confirm seller's details.
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            <Grid item xs={12}>
                {status === "Loading" && <CircularProgress />}
                {status === "Validating" && (sellerRoles.slice(0, upsertingIndex + 1).map((sellerRole: IDealRole, index: number) => 
                <RoleForm
                    isOpen
                    deal={deal}
                    onUpsertRole={handleUpsertValidatingRole}
                    onClose={handleCloseRoleForm}
                    title=" "
                    form={{ ...sellerRole, role: "Seller" }}
                />
                ))}
                {status === "Upserting" && (
                    <RoleForm
                        isOpen
                        deal={deal}
                        onClose={handleCloseRoleForm}
                        title=" "
                        form={upsertingIndex >= 0 ? { ...sellerRoles[upsertingIndex], role: "Seller" } : { role: "Seller" }}
                    />
                )}
                {status === "Listing" && (
                    <>
                        {sellerRoles.map((role: IDealRole, index: number) =>
                            <UserInfoCard
                                roleData={role}
                                index={index}
                                step={2}
                                handleClickEditButton={handleClickEditButton}
                                key={index}
                            />
                        )}
                        <Grid container className="UserInfo-Card">
                            <Grid item xs={12} style={{ textAlign: 'right' }} >
                                <Button onClick={handleClickAddAnotherButton} style={{ color: 'black !important', border: 'solid #dbdbdb 1px', borderRadius: 5 }}>
                                    Add Another Seller
                                </Button>
                                {step <= 2 && (
                                    <Button variant="contained" onClick={handleClickNextButton} style={{ backgroundColor: '#0fb78d', color: 'white', marginLeft: 10 }}>
                                        Looks Good, Next
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

export default SellerDetail;