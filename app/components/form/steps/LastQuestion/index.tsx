import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps } from '../../../../models/type';

const LastQuestion: React.FC<IQuestionProps> = ({
    Wizard,
    utils: { notifyOffice },
}) => {
    const { QuestionSection, QuestionTitle, QuestionForm } = Wizard;
    const { Button, Box } = Ui;

    const handleSubmit = () => {
        notifyOffice("Please check this deal.");
    }

    return (
        <QuestionSection>
            <QuestionTitle>
                Awesome! Let's submit this for the review, and get you paid!
            </QuestionTitle>
            <QuestionForm>
                <Box style={{ textAlign: "right" }}>
                    <Button onClick={handleSubmit} variant="contained" style={{ marginBottom: 20, backgroundColor: '#0fb78d', color: 'white' }}>
                        Submit for Review
                    </Button>
                </Box>
            </QuestionForm>
        </QuestionSection>
    )
}

export default LastQuestion;