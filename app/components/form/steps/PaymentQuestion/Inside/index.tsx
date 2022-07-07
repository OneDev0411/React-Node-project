import React from '@libs/react'
import Ui from '@libs/material-ui'
import { DatePicker } from "../../../../DatePicker"
import { CheckData, IQuestionProps, RemittanceStatus } from "../../../../../models/type"
import useApp from '../../../../../hooks/useApp'

import PaymentQuestionComponent from '../paymentQuestionComponent'

const defaultCheckData: CheckData = {
    number: 0,
    date: new Date(),
    receiveDate: new Date(),
    amount: 0,
}

const PaymentQuestionInside: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    models: { deal, roles },
    Components: { DatePicker: DayPicker },
}) => {
    const { useState } = React;
    const { Grid, Select, MenuItem, ListSubheader,  TextField, InputAdornment, Box, Button, FormControlLabel, Checkbox, Divider } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    const deal_type = deal.deal_type;
    const { dealData, roleData, remittanceChecks} = useApp();
    // state
    const [selectValue, setSelectValue] = useState<number>(-1);
    const [next, setNext] = useState(false);
    const [checkDataList, setCheckDataList] = useState<Array<CheckData>>([{ ...defaultCheckData }]);
    
    const [showButton, setShowButton] = useState<boolean>(true);
    // const [showBuy, setShowBuy] = useState<boolean>(showBoth || deal.deal_type === "Buying");
    // const [showSell, setShowSell] = useState<boolean>(deal.deal_type === "Selling");


    const handleClickNextButton = () => {
            setNext(true);
            gotoNext();
            console.log('paymentstep', dealData, remittanceChecks, roleData)
    }
    
    const gotoNext = () => {
        setShowButton(false);
        setTimeout(() => {
            wizard.next();
            setNext(false);
        }, 1000);
    }

    const updateFlag = (flag: boolean) => {
        console.log('updateFlag', flag);
        if(!showButton)setShowButton(flag);
    }

   
    // variables
    // const showBuy =  showBoth || deal.deal_type === "Buying";
    // const showSell =  deal.deal_type === "Selling"; // if showBoth is ture, enables true when cliking button

    return (
        <QuestionSection>
            <QuestionTitle>
                 Please input Inside Douglas Elliman Payments info.
            </QuestionTitle>
            <QuestionForm>
            <PaymentQuestionComponent range="inside" next={next} deal_type={deal_type} updateFlag={updateFlag}/>
            {showButton && (
                <Box style={{ textAlign: 'right', marginTop:"20px", paddingBottom:"20px" }}>
                    <Button variant="contained" onClick={handleClickNextButton} style={{ marginBottom: 20, backgroundColor: '#0fb78d', color: 'white' }}>
                        Looks good, Next
                    </Button>
                </Box>
            )}
            </QuestionForm>
        </QuestionSection>
    )
}

export default PaymentQuestionInside;