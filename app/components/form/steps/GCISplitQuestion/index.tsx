import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps, ItemData } from "../../../../models/type"
import GCIInfoItem from "./item"
import { GCI2DEDataList } from '../../../../util'

const GCISplitQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
}) => {
    const { Grid, Button, Box } = Ui;
    
    return (
        <QuestionSection>
            <QuestionTitle>
                Great, here are your GCI share before splits:
            </QuestionTitle>
            <QuestionForm>
                {GCI2DEDataList.map((item: ItemData, id: number) => 
                    <GCIInfoItem Ui={Ui} key={id} itemData={item} />
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
            <QuestionTitle>
                Awesome! Let's submit this for the review, and get you paid!
            </QuestionTitle>
            <QuestionForm>
                <Box style={{ textAlign: "right" }}>
                    <Button variant="contained" style={{ backgroundColor: '#0fb78d', color: 'white' }}>
                        Submit for Review
                    </Button>
                </Box>
            </QuestionForm>
        </QuestionSection>
    )
}

export default GCISplitQuestion;