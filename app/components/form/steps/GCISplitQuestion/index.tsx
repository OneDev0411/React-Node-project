import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps } from "../../../../models/type"
import GCIInfoItem from "./item"
// import { GCI2DEDataList } from '../../../../util'

const GCISplitQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    models: { deal, roles },
    GCIValue = 0,
    agentShareInfoList,
    setAgentShareInfoList,
}) => {
    const { useEffect } = React;
    const { Grid, Button } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    
    console.log('GCIValue:', GCIValue);
    useEffect(() => {
        // console.log('deal:', deal);
        // console.log('context:', deal.context);
        console.log('roles:', roles);
        // when the component is shown
        if (wizard.currentStep === step) {
            setTimeout(() => {
                wizard.next();
            }, 1000);
        }
    }, [wizard.currentStep]);

    let agentRole = roles.filter((role: IDealRole) => role.role === "BuyerAgent" || role.role === "SellerAgent" || role.role === "CoBuyerAgent" || role.role === "CoSellerAgent");
    // console.log('matchingRole:', matchingRole);

    return (
        <QuestionSection>
            <QuestionTitle>
                Great, here is your GCI share before splits:
            </QuestionTitle>
            <QuestionForm>
                {agentRole.map((agent: IDealRole, id: number) =>
                    <GCIInfoItem Ui={Ui} key={id} role={agent} GCIValue={GCIValue} />
                )}
                <Button variant="outlined" style={{ color: 'black !important', borderColor: '#dbdbdb !important', paddingBottom: 2, paddingTop: 2, marginLeft: -10, marginTop: 10 }}>
                    + Add More Agents
                </Button>
                <Grid container spacing={2} style={{ paddingBottom: 30 }}>
                    <Grid item xs={6} />
                    <Grid item xs={3}>
                        <label style={{ fontWeight: 300 }}>
                            Total: <strong>20%</strong>
                        </label>
                    </Grid>
                    <Grid item xs={3}>
                        <label style={{ fontWeight: 300 }}>
                            Total: <strong>$40,000</strong>
                        </label>
                    </Grid>
                </Grid>
            </QuestionForm>
        </QuestionSection>
    )
}

export default GCISplitQuestion;