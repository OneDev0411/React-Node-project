import React from '@libs/react'
import Ui from '@libs/material-ui'
import { DatePicker } from '../../../DatePicker'
import { IQuestionProps } from "../../../../models/type"

const ListingInfoQuestion: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    api: { updateDealContext },
    Components: { DatePicker: DayPicker }
}) => {
    const { useState } = React;
    const { Box, TextField, Button, InputAdornment } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();

    // state
    const [listPrice, setListPrice] = useState<number>(0);
    const [listDate, setListDate] = useState<string>("Apr 22, 2022");  // NEED_TO_UPDATE_THIS_CODE
    const [closingDate, setClosingDate] = useState<string>("Apr 22, 2022");  // NEED_TO_UPDATE_THIS_CODE

    const handleClickButton = async () => {
        await updateDealContext("list_price", Number(listPrice));
        await updateDealContext("list_date", listDate);
        await updateDealContext("closing_date", closingDate);
        wizard.next();
    };

    const handleChangeInput = (key: string, event: any) => {
        switch(key) {
            case "listPrice":
                setListPrice(event.target.value);
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
                    type={"number"}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                $
                            </InputAdornment>
                        )
                    }}
                />
                <DatePicker Picker={DayPicker} />
                {/* <TextField
                    size='small'
                    label="Original Listing Date"
                    onChange={(event: any) => handleChangeInput("listDate", event)}
                    value={listDate}
                    style={{ width: '100%', marginBottom: 20 }}
                /> */}
                <TextField
                    size='small'
                    label="Projected Closing Date"
                    onChange={(event: any) => handleChangeInput("closingDate", event)}
                    value={closingDate}
                    style={{ width: '100%', marginBottom: 20 }}
                />
                {wizard.currentStep < 9 && (
                    <Box style={{ textAlign: 'right' }}>
                        <Button variant="contained" onClick={handleClickButton} style={{ backgroundColor: '#0fb78d', color: 'white' }}>
                            Looks good, Next
                        </Button>
                    </Box>
                )}
            </QuestionForm>
        </QuestionSection>
    )
}

export default ListingInfoQuestion;