import React from '@libs/react'
import Ui from '@libs/material-ui'
import UserInfoCard from './UserInfoCard'
import { DefaultFormData, DetailStatus, IStepProps } from '../models/type'
// import useRole from '../hooks/useRole'

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
    const [currentRole, setCurrentRole] = useState<IDealRole | null>(null);

    const sellerRoles = roles.filter((role: IDealRole) => role.role === "Seller"); 
    // console.log('sellerRoles:', sellerRoles);

    // mockup loading
    useEffect(() => {
        setTimeout(() => {
            if (sellerRoles.length) {
                setStatus('Showing');
            } 
            // if there isn't any roles, show role form
            else {
                setStatus('Editing');
            }
        }, 100);  // TEST_CODE
    }, []);

    // const cardData: CardData = {
    //     userName: "Mark Bloom",
    //     role: "Seller",
    //     phone: "(123)456 - 7890",
    //     email: "mbloom@gmail.com"
    // }

    // const defaultFormData: DefaultFormData = {
    //     role: 0,
    //     firstName: "Mark",
    //     lastName: "Bloom",
    //     email: "mbloom@gmail.com",
    //     phone: "(123)456 - 7890",
    //     companyTrust: "",
    //     currentAddress: "2972 Westheimer Rd. Santa Ana, Illinois 85486"
    // }

    // const handleOnUpsertRole = (e: any) => {
    //     e.preventDefault();
    // }

    // const handleOnClose = (e: any) => {
    //     e.preventDefault();
    // }

    // const handleClickFormButton = () => {

    // }

    const handleCloseRoleForm = () => {
        setStatus('Showing');
        setCurrentRole(null);
    }

    const updateRole = (currentRole: IDealRole) => {
        setStatus('Editing');
        setCurrentRole(currentRole);
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
                {status === "Editing" && (
                    <RoleForm
                        isOpen
                        deal={deal}
                        onClose={() => handleCloseRoleForm()}
                        // onUpsertRole={() => updateStep({ subStep: 2 })} 
                        title=" "
                        form={currentRole !== null ? (
                            { ...currentRole, role: "Seller" }
                        ) : (
                            { role: "Seller" }
                        )}
                    />
                )}
                {status === "Showing" && (
                    <>
                        {/* Map function */}
                        {sellerRoles.map((role: IDealRole, index: number) =>
                            <UserInfoCard
                                roleData={role}
                                step={2}
                                updateRole={updateRole}
                            />
                        )}
                        <Grid container className="UserInfo-Card">
                            <Grid item xs={12} style={{ textAlign: 'right' }} >
                                <Button onClick={() => setStatus('Editing')} style={{ color: 'black !important', border: 'solid #dbdbdb 1px', borderRadius: 5, marginRight: 10 }}>
                                    Add Another Seller
                                </Button>
                                {step <= 2 && (
                                    <Button variant="contained" onClick={() => updateStep({ step: 3, subStep: 0 })} style={{ backgroundColor: '#0fb78d', color: 'white' }}>
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