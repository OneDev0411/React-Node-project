import React from '@libs/react'
import Ui from '@libs/material-ui'
import { ConfirmRoleStatus, IQuestionProps } from '../../../../models/type'
import { roleText } from '../../../../util'

const ConfirmContactInfo: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    models: { deal, roles },
    Components: { RoleForm, RoleCard, ContactRoles },
    roleType = "Seller",
}) => {
    const { useEffect, useState } = React;
    const { Button, Divider, Box } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext()

    // state
    const [status, setStatus] = useState<ConfirmRoleStatus>('Validating');
    const [upsertingIndex, setUpsertingIndex] = useState<number>(0); // last upserting role index
    const [currentRole, setCurrentObject] = useState<Partial<IDealFormRole> | IDealRole | null>(null); // data from dropdown select, can be IDealRole object or nameObject

    // component variables
    const matchRoles = roles.filter((role: IDealRole) => role.role === roleType);

    const matchRoleElements = matchRoles.map((role: IDealRole, index: number) => {
        return (
            <RoleCard
                role={role}
                key={index}
                readonly
                onClickEdit={() => handleClickEditButton(role)}
                // onClickRemove={handleClickEraseButton}
            />
        )
    });

    // mockup loading
    useEffect(() => {
        // wizard.setLoading(true);
        // setTimeout(() => {
            // wizard.setLoading(false);
        if (matchRoles.length) {
            setStatus('Validating');
        } else {
            setStatus("Upserting");
            setUpsertingIndex(-1);
        }
        // }, 7000);
    }, []);

    const handleNext = () => {
        console.log('called:');
        // console.log('step:', step);
        wizard.next();
        // wizard.goto(step + 1);
        // setTimeout(() => {
        //     wizard.goto(8);
        // }, 10);
        // wizard.goto(wizard.currentStep);
    }

    const handleClickEditButton = (role: IDealRole) => {
        setCurrentObject(role);
        setStatus('Upserting');
    }

    const handleClickAddAnotherButton = () => {
        setStatus('Selecting');
        setUpsertingIndex(-1);
        // wizard.goto(3);
    }

    const handleClickNextButton = () => {
        console.log('next#########################:');
        handleNext();
    }

    const handleClickSkipButton = () => {
        setStatus('Skipped');
        handleNext();
    }

    const handleSelectContact = (contact: Partial<IDealFormRole>) => {
        setCurrentObject(contact);
        setStatus("Upserting");
    }

    const handleClickCancelAddButton = () => {
        setStatus("Listing");
    }

    const handleUpsertValidatingRole = (upsertingRole: IDealRole) => {
        // in case of showing match role for validating
        if (upsertingRole.id === matchRoles[upsertingIndex].id) {  
            // in case of save button of role form which is shown not last is clicked
            if (upsertingIndex < matchRoles.length - 1) {  
                setUpsertingIndex(upsertingIndex + 1);
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
            handleNext();
        } 
        // regular cancel action
        else {
            setStatus("Listing");
            setCurrentObject(null);
        }
    }

    return (
        <QuestionSection>
            <QuestionTitle>
                Please confirm {roleText[roleType]}'s details.
            </QuestionTitle>
            <QuestionForm>
                {status === "Validating" && (
                    <>
                        {matchRoles.slice(0, upsertingIndex + 1).map((roleData: IDealRole, index: number) =>
                            <RoleForm
                                isOpen
                                deal={deal}
                                onUpsertRole={handleUpsertValidatingRole}
                                // onClose={handleCloseValidatingRoleForm}
                                title=" "
                                form={{ ...roleData, role: roleType }}
                                key={index}
                            />
                        )}
                        {!(roleType === "Buyer" || roleType === "Seller") && (
                            <Button variant="outlined" style={{ color: 'black !important', borderColor: '#dbdbdb !important', marginRight: 135, marginTop: -60 }} onClick={handleClickSkipButton}>
                                Skip
                            </Button>
                        )}
                    </>
                )}
                {status === "Upserting" && (
                    <RoleForm
                        isOpen
                        deal={deal}
                        onClose={handleCloseRoleForm}
                        title=" "
                        form={currentRole === null ? (upsertingIndex >= 0 ? { ...matchRoles[upsertingIndex], role: roleType } : { role: roleType })
                            : { ...currentRole, role: roleType }}
                    />
                )}
                {status === "Listing" && roleType !== undefined && (
                    <>
                        {matchRoleElements}
                        <Box style={{ textAlign: 'right' }}>
                            <Button onClick={handleClickAddAnotherButton} style={{ color: 'black !important', border: 'solid #dbdbdb 1px', borderRadius: 5 }}>
                                Add Another {roleText[roleType]}
                            </Button>
                            {wizard.lastVisitedStep <= step && (
                                <Button variant="contained" onClick={handleClickNextButton} style={{ backgroundColor: '#0fb78d', color: 'white', marginLeft: 10 }}>
                                    Looks Good, Next
                                </Button>
                            )}
                        </Box>
                    </>
                )}
                {status === "Selecting" && (
                    <>
                        {matchRoleElements}
                        <ContactRoles
                            placeholder={`Enter ${roleText[roleType]}'s names`}
                            onSelectRole={handleSelectContact}
                        />
                        <Box style={{ textAlign: 'right' }}>
                            <Button onClick={handleClickCancelAddButton} style={{ color: 'black !important', border: 'solid #dbdbdb 1px', borderRadius: 5 }}>
                                Cancel
                            </Button>
                        </Box>
                    </>
                )}
                {status === "Skipped" && (
                    <Box style={{ display: "flex", flexDirection: "row-reverse", textAlign: 'right', alignItems: "revert" }}>
                        <Button variant="text" className="green-button" style={{ marginRight: 10, marginLeft: 10 }} onClick={handleClickAddAnotherButton}>
                            Add Info
                        </Button>
                        <Divider orientation="vertical" flexItem />
                        <Button variant="text" style={{ marginRight: 10, color: 'black !important' }}>
                            Skipped
                        </Button>
                    </Box>
                )}
                {/* <Button variant="contained" onClick={() => { wizard.goto(2) }} style={{ backgroundColor: '#0fb78d', color: 'white', marginLeft: 10 }}>
                    Test
                </Button> */}
            </QuestionForm>
        </QuestionSection>
    )
}

export default ConfirmContactInfo;