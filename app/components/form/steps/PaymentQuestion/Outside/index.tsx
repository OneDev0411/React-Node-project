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

const PaymentQuestionOutside: React.FC<IQuestionProps> = ({
    Wizard: { QuestionSection, QuestionTitle, QuestionForm },
    hooks: { useWizardContext, useSectionContext },
    models: { deal, roles },
    Components: { DatePicker: DayPicker },
}) => {
    const { useState } = React;
    const { Grid, Select, MenuItem, ListSubheader,  TextField, InputAdornment, Box, Button, FormControlLabel, Checkbox, Divider } = Ui;
    const wizard = useWizardContext();
    const { step } = useSectionContext();
    const { GCIValue, agentDataList} = useApp();

    const showBoth = true;
    // const shouwBoth = deal.context.ender_type.text === "AgentDoubleEnder" || deal.context.ender_type.text === "OfficeDoubleEnder";
    const showBuy = showBoth || deal.deal_type === "Buying";

    // state
    const [status, setStatus] = useState<RemittanceStatus>(showBuy ? 'ShowBuy' : 'ShowSell');
    const [selectValue, setSelectValue] = useState<number>(-1);
    const [checkDataList, setCheckDataList] = useState<Array<CheckData>>([{ ...defaultCheckData }]);
    
    const [showButton, setShowButton] = useState<boolean>(true);
    // const [showBuy, setShowBuy] = useState<boolean>(showBoth || deal.deal_type === "Buying");
    // const [showSell, setShowSell] = useState<boolean>(deal.deal_type === "Selling");

    const handleSelectChange = (event: any) => {
        setSelectValue(event.target.value);    
    }

    const handleClickAddAnotherCheckButton = (event: any) => {
        let _checkDataList = checkDataList.slice();
        _checkDataList.push({ ...defaultCheckData });
        setCheckDataList(_checkDataList);
    }

    const handleClickRemoveButton = (event: any) => {
        let _checkDataList = checkDataList.slice();
        _checkDataList.pop();
        setCheckDataList(_checkDataList);
    }

    const updateCheckDataList = (index: number, key: keyof CheckData, value: any) => {
        let _checkDataList: CheckData[] = checkDataList.slice();
        _checkDataList[index][key] = value;
        setCheckDataList(_checkDataList);
    }

    

    const handleClickNextButton = () => {
        if (status === "ShowBuy") { 
            if (showBoth) { // shows sell part
                setStatus("ShowSell");
            } else {
                gotoNext();
            }
        } else {
            gotoNext();
        }
    }
    
    const gotoNext = () => {
        setShowButton(false);
        setTimeout(() => {
            wizard.next();
        }, 80);
    }

    // variables
    // const showBuy =  showBoth || deal.deal_type === "Buying";
    // const showSell =  deal.deal_type === "Selling"; // if showBoth is ture, enables true when cliking button

    return (
        <QuestionSection>
            <QuestionTitle>
                Please input Seller's payment info.
            </QuestionTitle>
            <QuestionForm>
            <PaymentQuestionComponent role="outside"/>
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

export default PaymentQuestionOutside;