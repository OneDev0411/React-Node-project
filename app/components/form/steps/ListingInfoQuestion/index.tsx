import React from '@libs/react'
import Ui from '@libs/material-ui'
import { DatePicker } from '../../../DatePicker'
import { IQuestionProps } from "../../../../models/type"
import { stylizeNumber } from "../../../../util"

const ListingInfoQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    api: { updateDealContext, getDealContext },
    Components: { DatePicker: DayPicker }
}) => {
    const { useState } = React;
    const { Box, TextField, Button, InputAdornment } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    
    // context value
    const listPriceContextValue = getDealContext('list_price')?.text;
    const listDateContextValue = getDealContext('list_date')?.text;
    const closingDateContextValue = getDealContext('closing_date')?.text;

    // state
    const [listPrice, setListPrice] = useState<string>(Number(listPriceContextValue) + "");
    const [listDate, setListDate] = useState<Date>(!listDateContextValue ? new Date() : new Date(listDateContextValue));  // NEED_TO_UPDATE_THIS_CODE
    const [closingDate, setClosingDate] = useState<Date>(!closingDateContextValue ? new Date() : new Date(closingDateContextValue));  // NEED_TO_UPDATE_THIS_CODE
    const [showButton, setShowButton] = useState<boolean>(true);

    const handleClickButton = async () => {
        await updateDealContext("list_price", Number(listPrice.replaceAll(',', '')));
        await updateDealContext("list_date", listDate);
        await updateDealContext("closing_date", closingDate);
        
        setShowButton(false);
        setTimeout(() => {
            wizard.next();
        }, 80);
    };

    const handleChangeInput = (key: string, event: any) => {
        switch(key) {
            case "listPrice":
                let value: string = event.target.value;
                value = value.replaceAll(',', '');

                // don't accept too big number
                if (value.length >= 15) 
                    return;

                // don't accept invalid input
                if (Number(value) + "" === "NaN") 
                    return;
                setListPrice(stylizeNumber(Number(value)));
                break;
            case "listDate":
                setListDate(event.target.value);
                break;
            case "closingDate":
                setClosingDate(event.target.value);
                break;
        }
    }

    return (
        <QuestionSection>
            <QuestionTitle>
                Please confirm or update the following:
            </QuestionTitle>
            <QuestionForm>
                <TextField
                    size='small'
                    label="Original Listing Price"
                    value={listPrice}
                    onChange={(event: any) => handleChangeInput("listPrice", event)}
                    style={{ width: '100%', marginBottom: 20 }}
                    className="listing-price-input"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                $
                            </InputAdornment>
                        )
                    }}
                />
                <DatePicker
                    Picker={DayPicker} 
                    value={listDate}
                    setValue={setListDate}
                    label="Original Listing Date"
                />
                <DatePicker
                    Picker={DayPicker} 
                    value={closingDate}
                    setValue={setClosingDate}
                    label="Projected Closing Date"
                />
                {showButton && (
                    <Box style={{ textAlign: 'right' }}>
                        <Button variant="contained" onClick={handleClickButton} style={{ marginBottom: 20, zIndex: wizard.lastVisitedStep <= 8 && step === 8 && wizard.currentStep <= 8 ? 3 : -3, backgroundColor: '#0fb78d', color: 'white' }}>
                            Looks good, Next
                        </Button>
                    </Box>
                )}
            </QuestionForm>
        </QuestionSection>
    )
}

export default ListingInfoQuestion;