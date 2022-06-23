import React from '@libs/react'
import Ui from '@libs/material-ui'
import { AgentData, IQuestionProps } from "../../../../models/type"
import GCIInfoItem from "./item"
import useApp from '../../../../hooks/useApp'
import { stylizeNumber } from '../../../../util'

const GCISplitQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    models: { roles },
}) => {
    const { useEffect } = React;
    const { Grid, Button } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    const { GCIValue, agentDataList } = useApp();

    useEffect(() => {
        // when the component is shown
        if (wizard.currentStep === step) {
            setTimeout(() => {
                wizard.next();
            }, 1000);
        }
    }, [wizard.currentStep]);

    const agentRole = roles.filter((role: IDealRole) => role.role === "BuyerAgent" || role.role === "SellerAgent" || role.role === "CoBuyerAgent" || role.role === "CoSellerAgent");

    const totalPercent = agentDataList.reduce((totalPercent: any, agentData: any) => {
    // const totalPercent = agentDataList.reduce((totalPercent: Number, agentData: AgentData) => {
        return totalPercent + agentData.sharePercent;
    }, 0);

    return (
        <QuestionSection>
            <QuestionTitle>
                Great, here is your GCI share before splits:
            </QuestionTitle>
            <QuestionForm>
                {agentDataList.map((_: AgentData, id: number) =>
                    <GCIInfoItem Ui={Ui} key={id} index={id} role={agentRole[id]} GCIValue={GCIValue} />
                )}
                <Button variant="outlined" style={{ color: 'black !important', borderColor: '#dbdbdb !important', paddingBottom: 2, paddingTop: 2, marginLeft: -10, marginTop: 10 }}>
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
            </QuestionForm>
        </QuestionSection>
    )
}

export default GCISplitQuestion;