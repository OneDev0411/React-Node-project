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
    const { Box, TextField, Button, InputAdornment, Select, MenuItem, Grid } = Ui;
    const wizard = useWizardContext();
    const { GCIUnit, setGCIValue, reasonValue, setReasonValue, reasonNote, setReasonNote } = useApp();

    // state
    const [inputValue, setInputValue] = useState<string | number>("");
    const [showButton, setShowButton] = useState<boolean>(true);
    const [_reasonValue, _setReasonValue] = useState<number>(-1);
    const [_reasonNote, _setReasonNote] = useState<string>("");

    const handleClickButton = () => {
        // save GCI value
        let GCIValue = GCIUnit === "%" ? 1000000 * Number(inputValue) / 100 : Number(inputValue); // NEED_TO_UPDATE_THIS_CODE
        if (setGCIValue !== undefined) {
            setGCIValue(GCIValue);
        }
        // save reason
        if (Number(inputValue) < 2 && setReasonValue !== undefined && setReasonNote !== undefined) {
            setReasonValue(_reasonValue);
            if (_reasonValue === 2) {
                setReasonNote(_reasonNote);
            }
        }

        setShowButton(false);
        setTimeout(() => {
            wizard.next();
        }, 80);
    };

    // console.log('getDealContext:', getDealContext());

    const handleChangeTextField = (event: any) => {
        if ((Number(event.target.value) + "") === "NaN") {
            return;
        }
        if (GCIUnit === "%" && Number(event.target.value) > 100) {
            return;
        }
        if ((event.target.value + "").length > 8) {
            return;
        }
        setInputValue(Number(event.target.value));
    }

    const handleChangeReasonTextField = (event: any) => {
        _setReasonNote(event.target.value);
    }

    const handleSelectChange = (event: any) => {
        _setReasonValue(event.target.value);
    }

    // variables
    let showReason = inputValue !== "" && Number(inputValue) < 2;
    let notFinishCase1 = inputValue === ""; // not completed GCI value
    let notFinishCase2 = showReason && _reasonValue === -1; // not selected reason
    let notFinishCase3 = showReason && _reasonValue === 2 && _reasonNote === ""; // not completed reason note
    let isShowButton = showButton && !(notFinishCase1 || notFinishCase2 || notFinishCase3);

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
                {showReason && (
                    <>
                        <Box id="select-reason-box">
                            <label style={{ float: 'right', marginTop: 40 }}>
                                Please select your reason.
                            </label>
                        </Box>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={_reasonValue}
                            label="Seller"
                            MenuProps={{ autoFocus: false }}
                            onChange={handleSelectChange}
                            style={{ width: '100%' }}
                        >
                            <MenuItem value={-1}>Select...</MenuItem>
                            <MenuItem value={0}>Approved Commission Reduction</MenuItem>
                            <MenuItem value={1}>Co-broke Commission Offered</MenuItem>
                            <MenuItem value={2}>Other</MenuItem>
                        </Select>
                        {_reasonValue === 2 && (

                            <TextField
                                size='small'
                                label="Reason"
                                value={_reasonNote}
                                style={{ width: '100%' }}
                                onChange={handleChangeReasonTextField}
                                placeholder="Please type your reason."
                            />
                        )}
                    </>
                )}
                {isShowButton && (
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