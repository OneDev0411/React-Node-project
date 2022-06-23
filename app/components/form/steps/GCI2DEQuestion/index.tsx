import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IQuestionProps } from "../../../../models/type"
import { stylizeNumber } from '../../../../util';
import useApp from '../../../../hooks/useApp';

const GCI2DEQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    api: { getDealContext, updateDealContext },
}) => {
    const { useState } = React;
    const { Box, TextField, Button, InputAdornment } = Ui;
    const wizard = useWizardContext();
    const { GCIUnit, setGCIValue } = useApp();

    // state
    const [inputValue, setInputValue] = useState<string | number>("");
    const [showButton, setShowButton] = useState<boolean>(true);

    const handleClickButton = () => {
        let GCIValue = GCIUnit === "%" ? 1000000 * Number(inputValue) / 100 : Number(inputValue); // NEED_TO_UPDATE_THIS_CODE
        if(setGCIValue !== undefined) {
            setGCIValue(GCIValue);
        }
        setShowButton(false);
        setTimeout(() => {
            wizard.next();
        }, 80);
    };

    // console.log('getDealContext:', getDealContext());

    const handleChangeTextField = (event: any) => {
        setInputValue(event.target.value);
    }

    return (
        <QuestionSection>
            <QuestionTitle>
                Please verify the GCI to Douglas Elliman?
            </QuestionTitle>
            <QuestionForm>
                <TextField
                    size='small'
                    label="GCI to DE"
                    value={inputValue}
                    style={{ width: '100%' }}
                    onChange={handleChangeTextField}
                    placeholder="Enter GCI"
                    type="number"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {GCIUnit}
                            </InputAdornment>
                        )
                    }}
                />
                {(inputValue !== "" && GCIUnit === "%") && (
                    <Box style={{ textAlign: 'right', marginTop: 10 }}>
                        <strong>$1,000,000</strong>
                        {/* <strong>{`$${stylizeNumber(Number(listPrice))}`}</strong>  // NEED_TO_UPDATE_THIS_CODE */}
                        {`(Listing Price) * ${inputValue}% (GCI) = `}
                        {/* <strong>{`$${stylizeNumber(Number(listPrice) / 100 * Number(inputValue))}`}</strong> // NEED_TO_UPDATE_THIS_CODE */}  
                        {/* <strong>$50,000</strong> */}
                        <strong>${stylizeNumber(1000000 * Number(inputValue) / 100)}</strong>
                    </Box>
                )}
                {(showButton && inputValue !== "") && (
                    <Box style={{ textAlign: 'right', marginTop: 20 }}>
                        <Button variant="contained" onClick={handleClickButton} style={{ backgroundColor: '#0fb78d', color: 'white' }}>
                            Looks good, Next
                        </Button>
                    </Box>
                )}
                {showButton && (
                    <Box style={{ height: 120 }} />
                )}
            </QuestionForm>
        </QuestionSection>
    )
}

export default GCI2DEQuestion;