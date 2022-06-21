import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps } from "../../../../models/type"

const FinanceProgQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    api: { updateDealContext, getDealContext },
}) => {
    const { useState } = React;
    const { TextField, Button, Box } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();

    const financingProgramContextValue = getDealContext('financing_program')?.text;

    // state
    const [text, setText] = useState<string>(financingProgramContextValue);
    const [showButton, setShowButton] = useState<boolean>(true);

    const handleClickButton = () => {
        setShowButton(false);
        updateDealContext("financing_program", text);
        setTimeout(() => {
            wizard.next();
        }, 80);
    };

    const handleOnTextFieldChange = (event: any) => {
        setText(event.target.value);
    }

    return (
        <QuestionSection>
            <QuestionTitle>
                What is the financing program?
            </QuestionTitle>
            <QuestionForm>
                <TextField
                    size='small'
                    label="Financing Program"
                    style={{ width: '100%' }}
                    onChange={handleOnTextFieldChange}
                    value={text}
                />
                {showButton && (
                    <Box style={{ textAlign: 'right', marginTop: 20, paddingBottom: 20 }}>
                        <Button variant="contained" disabled={!text?.length} onClick={handleClickButton} style={text?.length ? { backgroundColor: '#0fb78d', color: 'white' } : {}}>
                            Looks good, Next
                        </Button>
                    </Box>
                )}
            </QuestionForm>
        </QuestionSection>
    )
}

export default FinanceProgQuestion;