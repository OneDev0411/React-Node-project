import React from '@libs/react'
import Ui from '@libs/material-ui'
import { AgentData, GCISplitStatus, IQuestionProps } from "../../../../models/type"
import GCIInfoItem from "./item"
import useApp from '../../../../hooks/useApp'
import { stylizeNumber } from '../../../../util'

const GCISplitQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    models: { deal, roles },
    Components: { RoleForm, ContactRoles },
}) => {
    const { useEffect, useState } = React;
    const { Grid, Button, Box } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    const { GCIValue, agentDataList } = useApp();

    // state
    const [status, setStatus] = useState<GCISplitStatus>('Listing');
    const [currentRole, setCurrentObject] = useState<Partial<IDealFormRole> | IDealRole | null>(null); // data from dropdown select, can be IDealRole object or nameObject

    useEffect(() => {
        // when the component is shown
        if (wizard.currentStep === step) {
            setTimeout(() => {
                wizard.next();
            }, 1000);
        }
    }, [wizard.currentStep]);

    // this logic is updating 
    const handleCloseRoleForm = () => {
        // // in case of no match role, ignore cancel action
        // if (matchRoles.length === 0) {
        //     return;
        // }
        // regular cancel action
        // else {
        setStatus("Listing");
        setCurrentObject(null);
        // }
    }

    const handleSelectContact = (contact: Partial<IDealFormRole>) => {
        setCurrentObject(contact);
        setStatus("Inserting");
    }

    const handleClickAddAnotherButton = () => {
        setStatus('Selecting');
    }

    // variables
    console.log('roles:', roles);
    const agentRole = roles.filter((role: IDealRole) => role.role === "BuyerAgent" || role.role === "SellerAgent" || role.role === "CoBuyerAgent" || role.role === "CoSellerAgent");

    const totalPercent = agentDataList.reduce((totalPercent: any, agentData: any) => {
        return totalPercent + agentData.sharePercent;
    }, 0);

    return (
        <QuestionSection>
            <QuestionTitle>
                Great, here is your GCI share before splits:
            </QuestionTitle>
            <QuestionForm>
                {status === "Listing" && (
                    <>
                        {agentDataList.map((_: AgentData, id: number) =>
                            <GCIInfoItem Ui={Ui} key={id} index={id} role={agentRole[id]} GCIValue={GCIValue} />
                        )}
                        <Button variant="outlined" onClick={handleClickAddAnotherButton} style={{ color: 'black !important', borderColor: '#dbdbdb !important', paddingBottom: 2, paddingTop: 2, marginLeft: -10, marginTop: 10 }}>
                            + Add More Agents
                        </Button>
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={6} />
                            <Grid item xs={3}>
                                <label style={{ fontWeight: 300 }}>
                                    Total: <strong>{totalPercent}%</strong>
                                </label>
                            </Grid>
                            <Grid item xs={3} style={{ paddingLeft: 0 }}>
                                <label style={{ fontWeight: 300 }}>
                                    Total: <strong>${stylizeNumber(Number(GCIValue) / 100 * totalPercent)}</strong>
                                </label>
                            </Grid>
                        </Grid>
                    </>
                )}
                {status === "Inserting" && (
                    <Box className='adding-role-form-box'>
                        <RoleForm
                            isOpen
                            deal={deal}
                            onClose={handleCloseRoleForm}
                            title=" "
                            form={currentRole === null ? { role: "BuyerAgent" } : { ...currentRole, role: "BuyerAgent" }}
                        />
                    </Box>
                )}
                {status === "Selecting" && (
                    <>
                        {agentDataList.map((_: AgentData, id: number) =>
                            <GCIInfoItem Ui={Ui} key={id} index={id} role={agentRole[id]} GCIValue={GCIValue} />
                        )}
                        <ContactRoles
                            placeholder={`Enter agent's name`}
                            onSelectRole={handleSelectContact}
                        />
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={6} />
                            <Grid item xs={3}>
                                <label style={{ fontWeight: 300 }}>
                                    Total: <strong>{totalPercent}%</strong>
                                </label>
                            </Grid>
                            <Grid item xs={3} style={{ paddingLeft: 0 }}>
                                <label style={{ fontWeight: 300 }}>
                                    Total: <strong>${stylizeNumber(Number(GCIValue) / 100 * totalPercent)}</strong>
                                </label>
                            </Grid>
                        </Grid>
                    </>
                )}
            </QuestionForm>
        </QuestionSection>
    )
}

export default GCISplitQuestion;