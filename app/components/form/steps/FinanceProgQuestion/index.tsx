import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps } from "../../../../models/type"
import useApp from "../../../../hooks/useApp";

const FinanceProgQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext },
    api: { updateDealContext, getDealContext },
}) => {
    const { useState, useEffect } = React;
    const { TextField, Button, Box } = Ui;
    const wizard = useWizardContext();
    const { submitted } = useApp();

    const financingProgramContextValue = getDealContext('financing_program')?.text;

    // state
    const [text, setText] = useState<string>(financingProgramContextValue);
    const [showButton, setShowButton] = useState<boolean>(true);

    useEffect(() => {
        if (submitted === 1)
            setShowButton(false);
        else
            setShowButton(true);
    }, []);

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