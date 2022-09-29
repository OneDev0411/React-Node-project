import React from '@libs/react'
import Ui from '@libs/material-ui'
import { ConfirmRoleStatus, IQuestionProps } from '../../../../models/type'
import { roleText } from '../../../../util'
import useApp from "../../../../hooks/useApp";

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
    const { submitted } = useApp();
    const { step } = useSectionContext();

    // state
    const [status, setStatus] = useState<ConfirmRoleStatus>('Validating');
    const [upsertingIndex, setUpsertingIndex] = useState<number>(0); // last upserting role index
    const [currentRole, setCurrentObject] = useState<Partial<IDealFormRole> | IDealRole | null>(null); // data from dropdown select, can be IDealRole object or nameObject
    const [showButton, setShowButton] = useState<boolean>(true);

    // component variables
    const _matchRoles = roles.filter((role: IDealRole) => role.role === roleType);
    const [matchRoles, setMatchRoles] = useState<IDealRole[]>(_matchRoles);

    const _matchRoleElements = matchRoles.map((role: IDealRole, index: number) => {
        return (
            <RoleCard
                role={role}
                key={index}
                readonly
                onClickEdit={() => handleClickEditButton(role)}
            />
        )
    });
    const [matchRoleElements, setMatchRoleElements] = useState(_matchRoleElements);

    // mockup loading
    useEffect(() => {
        if (matchRoles.length) {
            setStatus('Validating');
        } else {
            setStatus("Upserting");
            setUpsertingIndex(0);
        }
        if (submitted === 1)
            setShowButton(false);
        else
            setShowButton(true);
    }, []);

    const handleNext = () => {
        if (wizard.currentStep < step + 1) {
            setTimeout(() => {
                wizard.next();
            }, 80);
        }
    }

    const handleClickEditButton = (role: IDealRole) => {
        setCurrentObject(role);
        setStatus('Upserting');
    }

    const handleClickAddAnotherButton = () => {
        setStatus('Selecting');
        setUpsertingIndex(matchRoles.length);
    }

    const handleClickNextButton = () => {
        handleNext();
        setShowButton(false);
    }

    const handleClickSkipButton = () => {
        setShowButton(false);
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

    const handleCloseValidatingRoleForm = () => {
        setStatus("Listing");
    }

    const handleUpsertRoleForm = (agentRole: IDealRole) => {
        let temp = JSON.parse(JSON.stringify(matchRoles));
        temp.push(agentRole);
        setMatchRoles(temp);
        temp = matchRoleElements;
        temp.push(
            <RoleCard
                role={agentRole}
                key={matchRoles.length}
                readonly
                onClickEdit={() => handleClickEditButton(agentRole)}
            />
        );
        setMatchRoleElements(temp);
    }

    // this logic is updating 
    const handleCloseRoleForm = () => {
        // in case of no match role, ignore cancel action
        if (matchRoles.length === 0) {
            return;
        }
        // click save or save & add to my contacts button
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
            <QuestionForm width='60%'>
                {status === "Validating" && (
                    <>
                        {matchRoles.map((roleData: IDealRole, index: number) =>
                            <RoleForm
                                isOpen
                                deal={deal}
                                onClose={handleCloseValidatingRoleForm}
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
                        <Box style={{ height: 20 }} />
                    </>
                )}
                {status === "Upserting" && (
                    <Box className='adding-role-form-box'>
                        <RoleForm
                            isOpen
                            deal={deal}
                            onUpsertRole={handleUpsertRoleForm}
                            onClose={handleCloseRoleForm}
                            title=" "
                            form={currentRole === null ? (upsertingIndex >= 0 ? { ...matchRoles[upsertingIndex], role: roleType } : { role: roleType })
                            : { ...currentRole, role: roleType }}
                        />
                    </Box>
                )}
                {status === "Listing" && roleType !== undefined && (
                    <>
                        {matchRoleElements}
                        <Box style={{ textAlign: 'right' }}>
                            <Button onClick={handleClickAddAnotherButton} style={{ color: 'black !important', border: 'solid #dbdbdb 1px', borderRadius: 5 }}>
                                Add Another {roleText[roleType]}
                            </Button>
                            {showButton && (
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
                            placeholder={`Enter ${roleText[roleType]}'s name`}
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
                        <label style={{ marginRight: 15, color: 'black !important', fontSize: 14, paddingTop: 5 }}>
                            Skipped
                        </label>
                    </Box>
                )}
            </QuestionForm>
        </QuestionSection>
    )
}

export default ConfirmContactInfo;