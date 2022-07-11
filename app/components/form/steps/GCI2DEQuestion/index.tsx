import React from "@libs/react";
import Ui from "@libs/material-ui";
import { IQuestionProps, IRoleData } from "../../../../models/type";
import { stylizeNumber } from "../../../../util";
import useApp from "../../../../hooks/useApp";

const GCI2DEQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext },
  models: { deal },
}) => {
  const { useState, useEffect } = React;
  const { Box, TextField, Button, InputAdornment, Select, MenuItem } = Ui;
  const wizard = useWizardContext();
  const { dealData, setDealData, roleData, setRoleData } = useApp();

  // state
  const [inputValue, setInputValue] = useState<string | number>("");
  const [showButton, setShowButton] = useState<boolean>(true);
  const [_reasonValue, _setReasonValue] = useState<number>(
    dealData.gci_reason_select
  );
  const [_reasonNote, _setReasonNote] = useState<string>("");

  // constants
  const listPrice = deal.context.list_price.number;
  const dealType = deal.deal_type;
  const bothType = deal.context.ender_type;

  const handleClickButton = () => {
    // save GCI value
    let GCIValue =
      dealData.gci_calculate_type == 0
        ? (listPrice * Number(inputValue)) / 100
        : Number(inputValue); // NEED_TO_UPDATE_THIS_CODE

    if (setDealData !== undefined) {
      dealData.gci_de_value = GCIValue;
      let temp = JSON.parse(JSON.stringify(dealData));
      setDealData(temp);
    }

    if (setRoleData !== undefined) {
      let temp: IRoleData[] = JSON.parse(JSON.stringify(roleData));
      roleData.map((item: IRoleData, index: number) => {
        temp[index].share_percent =
          item.share_percent == null
            ? parseFloat(
                ((Number(item.share_value) / Number(GCIValue)) * 100).toFixed(3)
              )
            : item.share_percent;
        temp[index].share_value =
          item.share_value == null
            ? parseFloat(
                ((Number(GCIValue) * Number(item.share_percent)) / 100).toFixed(
                  3
                )
              )
            : item.share_value;
      });
      setRoleData(temp);
    }

    //  less than 2 in case deal_type is buying or Selling. less than 4 in case deal_type is both.
    const value =
      dealData.gci_calculate_type == 0
        ? inputValue
        : (Number(inputValue) * 100) / Number(listPrice);
    if (
      (Number(value) < 2 && bothType == undefined) ||
      (Number(value) < 4 && bothType !== undefined)
    ) {
      dealData.gci_reason_select = _reasonValue;
      let temp = JSON.parse(JSON.stringify(dealData));
      if (setDealData !== undefined) {
        setDealData(temp);
      }
      if (_reasonValue === 2) {
        dealData.gci_reason = _reasonNote;
        let temp = JSON.parse(JSON.stringify(dealData));
        if (setDealData !== undefined) {
          setDealData(temp);
        }
      }
    }
    setShowButton(false);
    setTimeout(() => {
      wizard.next();
    }, 80);
  };

  const handleChangeTextField = (event: any) => {
    if (!showButton) {
      setShowButton(true);
    }
    if (Number(event.target.value) + "" === "NaN") {
      return;
    }
    if (
      dealData.gci_calculate_type === 0 &&
      (dealType == "Buying" || dealType == "Selling") &&
      Number(event.target.value) > 100
    ) {
      return;
    }
    if (
      dealData.gci_calculate_type === 0 &&
      bothType !== undefined &&
      Number(event.target.value) > 100
    ) {
      return;
    }

    if ((event.target.value + "").length > 8) {
      return;
    }
    setInputValue(Number(event.target.value));
  };

  const handleChangeReasonTextField = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    _setReasonNote(event.target.value);
  };

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    _setReasonValue(Number(event.target.value));
  };

  // variables
  let currentvalue =
    dealData.gci_calculate_type == 0
      ? inputValue
      : (Number(inputValue) * 100) / Number(listPrice);
  let showReason =
    bothType == undefined
      ? inputValue !== "" && Number(currentvalue) < 2
      : inputValue !== "" && Number(currentvalue) < 4;
  let notFinishCase1 = inputValue === ""; // not completed GCI value
  let notFinishCase2 = showReason && _reasonValue === -1; // not selected reason
  let notFinishCase3 = showReason && _reasonValue === 2 && _reasonNote === ""; // not completed reason note
  let isShowButton =
    showButton && !(notFinishCase1 || notFinishCase2 || notFinishCase3);

  useEffect(() => {
    if (dealData.gci_de_value !== 0) {
      let temp: number = 0;
      if (dealData.gci_calculate_type == 0) {
        temp = (100 * dealData.gci_de_value) / listPrice;
      } else {
        temp = dealData.gci_de_value;
      }
      setInputValue(temp);
      _setReasonNote(dealData.gci_reason);
      _setReasonValue(dealData.gci_reason_select);
    }
  }, [dealData]);

  return (
    <QuestionSection>
      <QuestionTitle>Please verify the GCI to Douglas Elliman?</QuestionTitle>
      <QuestionForm>
        <TextField
          size="small"
          label="GCI to DE"
          value={inputValue}
          style={{ width: "100%" }}
          onChange={handleChangeTextField}
          placeholder="Enter GCI"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {dealData.gci_calculate_type == 0 ? "%" : "$"}
              </InputAdornment>
            ),
          }}
        />
        {inputValue !== "" && dealData.gci_calculate_type == 0 && (
          <Box style={{ textAlign: "right", marginTop: 10 }}>
            <strong>{"$" + stylizeNumber(listPrice)}</strong>
            {`(Listing Price) * ${inputValue}% (GCI) = `}
            <strong>
              ${stylizeNumber((listPrice * Number(inputValue)) / 100)}
            </strong>
          </Box>
        )}
        {showReason && (
          <>
            <Box id="select-reason-box">
              <label style={{ float: "right", marginTop: 40 }}>
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
              style={{ width: "100%" }}
            >
              <MenuItem value={-1}>Select...</MenuItem>
              <MenuItem value={0}>Approved Commission Reduction</MenuItem>
              <MenuItem value={1}>Co-broke Commission Offered</MenuItem>
              <MenuItem value={2}>Other</MenuItem>
            </Select>
            {_reasonValue == 2 && (
              <TextField
                size="small"
                label="Reason"
                value={_reasonNote}
                style={{ width: "100%", marginTop: 10 }}
                onChange={handleChangeReasonTextField}
                placeholder="Please type your reason."
              />
            )}
          </>
        )}
        {isShowButton && (
          <Box style={{ textAlign: "right", marginTop: 20 }}>
            <Button
              variant="contained"
              onClick={handleClickButton}
              style={{ backgroundColor: "#0fb78d", color: "white" }}
            >
              Looks good, Next
            </Button>
          </Box>
        )}
        {showButton && <Box style={{ height: 120 }} />}
      </QuestionForm>
    </QuestionSection>
  );
};

export default GCI2DEQuestion;
