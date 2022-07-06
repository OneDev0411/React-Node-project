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
    api: { deleteRole }
}) => {
    const { useState, useRef } = React;
    const { Grid, Button, Box } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    const { GCIValue, agentDataList, setAgentDataList } = useApp();
    
    // state
    const [status, setStatus] = useState<GCISplitStatus>('Listing');
    const [currentRole, setCurrentObject] = useState<Partial<IDealFormRole> | IDealRole | null>(null); // data from dropdown select, can be IDealRole object or nameObject
    const [showButton, setShowButton] = useState<boolean>(true);
    const [next, setNext] = useState(false);
    const buffer = useRef<AgentData[]>([]);

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

    const handleClickNextButton = async () => {
        setShowButton(false);
        setNext(true);
        setTimeout(() => {
            wizard.next();
            setNext(false);
        }, 80);
    };

    const handleClickCancelAddButton = () => {
        setStatus("Listing");
    }

    const handleClickRemoveButton = (id: IDealRole['id']) => {
        console.log('remove', id);
        // deleteRole(id);
    }

    const getData = (data: AgentData) => {
        let dataIndex = buffer.current.findIndex((item) => {
            return item.id == data.id;
        });
        if(dataIndex != -1) buffer.current.splice(dataIndex, 1);
        buffer.current.push(data);
        if(setAgentDataList !== undefined) setAgentDataList(buffer.current);
        console.log('data', data, buffer.current);
    }
    const updateFlag = (flag: boolean) => {
        console.log('flag', flag);
        if(!showButton)setShowButton(flag);
    } 

    // variables
    // console.log('roles:', roles);
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
                {agentDataList.map((_: AgentData, id: number) =>
                    <>
                        <GCIInfoItem Ui={Ui} key={id} index={id} role={agentRole[id]} GCIValue={GCIValue} next={next} getData={getData} updateFlag={updateFlag}/>
                        <Button key={id} variant="outlined" onClick={() => handleClickRemoveButton(agentRole[id].id)} style={{ color: 'black !important', borderColor: '#dbdbdb !important', paddingBottom: 2, paddingTop: 2, marginLeft: 10, marginBottom:20, marginTop:-20, float: "right" }}>
                            Remove one
                        </Button>
                    </>
                )}
                {status === "Listing" && (
                    <>
                        <Button variant="outlined" onClick={handleClickAddAnotherButton} style={{ color: 'black !important', borderColor: '#dbdbdb !important', paddingBottom: 2, paddingTop: 2, marginLeft: -10, marginTop: 20, marginBottom: 10 }}>
                            + Add More Agents
                        </Button>
                                             
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={4} />
                            <Grid item xs={4}>
                                <label style={{ fontWeight: 300 }}>
                                    Total: <strong>{totalPercent}%</strong>
                                </label>
                            </Grid>
                            <Grid item xs={4} style={{ paddingLeft: 0 }}>
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
                        <ContactRoles
                            placeholder={`Enter agent's name`}
                            onSelectRole={handleSelectContact}
                        />
                        <Box style={{ textAlign: 'right'}}>
                            <Button onClick={handleClickCancelAddButton} style={{ color: 'black !important', border: 'solid #dbdbdb 1px', borderRadius: 5 }}>
                                Cancel
                            </Button>
                        </Box>
                        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                            <Grid item xs={4} />
                            <Grid item xs={4}>
                                <label style={{ fontWeight: 300 }}>
                                    Total: <strong>{totalPercent}%</strong>
                                </label>
                            </Grid>
                            <Grid item xs={4} style={{ paddingLeft: 0 }}>
                                <label style={{ fontWeight: 300 }}>
                                    Total: <strong>${stylizeNumber(Number(GCIValue) / 100 * totalPercent)}</strong>
                                </label>
                            </Grid>
                        </Grid>
                    </>
                )}
                {showButton && status === "Listing" && (
                    <Box style={{ textAlign: 'right', marginTop: 10 }}>
                        <Button variant="contained" onClick={handleClickNextButton} style={{ marginBottom: 20, backgroundColor: '#0fb78d', color: 'white' }}>
                            Looks good, Next
                        </Button>
                    </Box>
                )}
            </QuestionForm>
        </QuestionSection>
    )
}

export default GCISplitQuestion;