import React from '@libs/react'
import Ui from '@libs/material-ui'
import UserInfoCard from './UserInfoCard'
import { DetailStatus, IStepProps } from '../models/type'

const BuyerDetail: React.FC<IStepProps> = ({ 
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

    const buyerRoles = roles.filter((role: IDealRole) => role.role === "Buyer"); 

    // mockup loading
    useEffect(() => {
        setTimeout(() => {
            if (buyerRoles.length) {
                setStatus('Showing');
            } 
            // if there isn't any roles, show role form
            else {
                setStatus('Editing');
            }
        }, 1000);  // TEST_CODE
    }, []);

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
                    title=" "
                    form={currentRole !== null ? (
                        { ...currentRole, role: "Buyer" }
                    ) : (
                        { role: "Buyer" }
                    )}
                />
                )}
                {status === "Showing" && (
                    <>
                        {/* Map function */}
                        {buyerRoles.map((role: IDealRole, index: number) =>
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
                            {step <= 3 && (
                                <Button variant="contained" onClick={() => updateStep({ step: 4, subStep: 0 })} style={{ backgroundColor: '#0fb78d', color: 'white' }}>
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

export default BuyerDetail;