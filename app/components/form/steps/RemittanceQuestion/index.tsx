import React from "@libs/react";
import Ui from "@libs/material-ui";
import { DatePicker } from "../../../DatePicker";
import {
  IDealData,
  IRoleData,
  IQuestionProps,
  IRemittanceChecks,
} from "../../../../models/type";
import useApp from "../../../../hooks/useApp";
import { defaultRemittanceChecks } from "../../../../util";

const RemittanceQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext },
  models: { deal },
  Components: { DatePicker: DayPicker },
}) => {
  const { useState, useEffect } = React;
  const { Grid, Select, MenuItem, TextField, InputAdornment, Box, Button } = Ui;
  const wizard = useWizardContext();
  const { dealData, setDealData, roleData, remittanceChecks, setRemittanceChecks, submitted, setSubmitted } = useApp();
  const enderType = deal.context.ender_type?.text;
  const showBoth = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? true : false;
  const showBuy = showBoth || deal.deal_type === "Buying";
  const showSell = showBoth || deal.deal_type === "Selling";

  const defaultCheckData: IRemittanceChecks = {
    id: null,
    deal: deal.id,
    check_num: 0,
    check_date: new Date(),
    check_receive_date: new Date(),
    amount: 0,
    deal_side: "",
  };

  // state
  const [buySideChecks, setBuySideChecks] = useState<IRemittanceChecks[]>(defaultRemittanceChecks);
  const [listingSideChecks, setListingSideChecks] = useState<IRemittanceChecks[]>(defaultRemittanceChecks);
  const [selectValueBuySide, setSelectValueBuySide] = useState<number>(-1);
  const [selectValueListingSide, setSelectValueListingSide] = useState<number>(-1);
  const [_dealData, _setDealData] = useState<IDealData>(dealData);
  const [showButton, setShowButton] = useState<boolean>(true);

  const handleBuySideSelectChange = (event: any) => {
    const value: number = event.target.value;
    setSelectValueBuySide(value);
    if (value !== -1 && selectValueListingSide !== -1)
      setShowButton(true);
    else
      setShowButton(false);
  };

  const handleListingSideSelectChange = (event: any) => {
    const value: number = event.target.value;
    setSelectValueListingSide(value);
    if (selectValueBuySide !== -1 && value !== -1) 
      setShowButton(true);
    else
      setShowButton(false);
  };

  const handleClickBuySideAddAnotherCheckButton = (event: any) => {
    if (!showButton) {
      setShowButton(true);
    }
    let temp = buySideChecks.slice();
    temp.push(defaultCheckData);
    setBuySideChecks(temp);
  };

  const handleClickBuySideRemoveCheckButton = (event: any) => {
    if (!showButton) {
      setShowButton(true);
    }
    let temp = buySideChecks.slice();
    temp.pop();
    setBuySideChecks(temp);
  };
  
  const handleClickListingSideAddAnotherCheckButton = (event: any) => {
    if (!showButton) {
      setShowButton(true);
    }
    let temp = listingSideChecks.slice();
    temp.push(defaultCheckData);
    setListingSideChecks(temp);
  };

  const handleClickListingSideRemoveCheckButton = (event: any) => {
    if (!showButton) {
      setShowButton(true);
    }
    let temp = listingSideChecks.slice();
    temp.pop();
    setListingSideChecks(temp);
  };

  const updateCheckDataList = (
    index: number,
    key: keyof IRemittanceChecks,
    value: IRemittanceChecks[typeof key],
    dealSide: string,
  ) => {
    if (!showButton) {
      setShowButton(true);
    }
    if (dealSide === "BuySide") {
      let temp = buySideChecks.slice();
      temp[index] = { ...temp[index], [key]: value, deal_side: dealSide, deal: deal.id };
      setBuySideChecks(temp);
    }
    if (dealSide === "ListingSide") {
      let temp = listingSideChecks.slice();
      temp[index] = { ...temp[index], [key]: value, deal_side: dealSide, deal: deal.id };
      setListingSideChecks(temp);
    }
  };

  const handleClickNextButton = () => {
    saveData();
    setShowButton(false);

    setTimeout(() => {
      wizard.next();
    }, 80);
    if (submitted === 1 && setSubmitted !== undefined)
      setSubmitted(-1);
  };

  // this save data before next wizard
  const saveData = () => {
    if (setRemittanceChecks !== undefined) {
      let remittanceChecks = buySideChecks.filter((item) => item.deal !== "");
      remittanceChecks = [ ...remittanceChecks, ...listingSideChecks.filter((item) => item.deal !== "")];
      setRemittanceChecks(remittanceChecks);
    }
    if (setDealData !== undefined) {
      if (_dealData.stage_cost !== 0) {
        dealData.brokerage_commission = _dealData.brokerage_commission;
        dealData.stage_cost = _dealData.stage_cost;
      }
      dealData.remittance_buy_side_bank_wire_amount = selectValueBuySide == 0 ? null : _dealData.remittance_buy_side_bank_wire_amount;
      dealData.remittance_listing_side_bank_wire_amount = selectValueListingSide == 0 ? null : _dealData.remittance_listing_side_bank_wire_amount;
      let temp = JSON.parse(JSON.stringify(dealData));
      setDealData(temp);
    }
  };

  const handleChangeValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof IDealData
  ) => {
    if (!showButton) {
      setShowButton(true);
    }
    let value: string = e.target.value;
    if (Number(value) + "" === "NaN" || (value + "").length > 16) {
      return;
    }

    let temp = JSON.parse(JSON.stringify(_dealData));
    temp[key] = Number(value);
    _setDealData(temp);
  };

  useEffect(() => {
    if (submitted === 1) {
      setShowButton(false);
    }
    else {
      setShowButton(true);
      _dealData.brokerage_commission = _dealData.brokerage_commission == 0 ? roleData.reduce((total: any, data: IRoleData) => {
        return parseFloat(
          (Number(total) + Number(data.share_value)).toFixed(3)
        );
      }, 0) : _dealData.brokerage_commission;
    }
    if (selectValueBuySide === -1 || selectValueListingSide === -1)
      setShowButton(false);
  }, []);

  useEffect(() => {
    if (buySideChecks[0].deal == "" && _dealData.remittance_buy_side_bank_wire_amount == null)
      setSelectValueBuySide(-1);
    if (buySideChecks[0].deal != "" && _dealData.remittance_buy_side_bank_wire_amount == null)
      setSelectValueBuySide(0);
    if (buySideChecks[0].deal == "" && _dealData.remittance_buy_side_bank_wire_amount != null)
      setSelectValueBuySide(1);
    if (listingSideChecks[0].deal == "" && _dealData.remittance_listing_side_bank_wire_amount == null)
      setSelectValueListingSide(-1);
    if (listingSideChecks[0].deal != "" && _dealData.remittance_listing_side_bank_wire_amount == null)
      setSelectValueListingSide(0);
    if (listingSideChecks[0].deal == "" && _dealData.remittance_listing_side_bank_wire_amount != null)
      setSelectValueListingSide(1);
  }, [_dealData, buySideChecks, listingSideChecks]);

  useEffect(() => {
    _setDealData(dealData);
  }, [dealData]);

  useEffect(() => {
    const _buySideChecks = remittanceChecks.filter(item => item.deal_side == "BuySide");
    if (_buySideChecks.length > 0)
      setBuySideChecks(_buySideChecks);
    const _listingSideChecks = remittanceChecks.filter(item => item.deal_side == "ListingSide");
    if (_listingSideChecks.length > 0)
      setListingSideChecks(_listingSideChecks);
  }, [remittanceChecks]);

  return (
    <QuestionSection>
      <QuestionTitle>Please input remittance info.</QuestionTitle>
      <QuestionForm>
        {(Number(_dealData.stage_cost) !== 0) && (
          <>
            <Box style={{ marginBottom: 10, marginTop: 20 }}>
              <TextField
                size="small"
                value={_dealData.brokerage_commission}
                style={{ width: "100%" }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeValue(e, "brokerage_commission")
                }
                type="text"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                label="Brokerage Commission"
              />
            </Box>
            <Box style={{ marginBottom: 10 }}>
              <TextField
                size="small"
                value={_dealData.stage_cost}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeValue(e, "stage_cost")
                }
                style={{ width: "100%" }}
                type="text"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                label="Staging Costs Due to DE"
              />
            </Box>
            <Box style={{ marginBottom: 10 }}>
              <TextField
                size="small"
                value={
                  Number(_dealData.brokerage_commission) +
                  Number(_dealData.stage_cost)
                }
                style={{ width: "100%" }}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                label="Total Due at Closing"
              />
            </Box>
          </>
        )}
        {(showBuy || showBoth) && (
          <Box style={{ marginTop: 40 }}>
            <Grid container spacing={2} style={{ marginBottom: 10 }}>
              <Grid item xs={4}>
                <label>Form of Remittance</label>
              </Grid>
              <Grid item xs={8}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectValueBuySide}
                  label="Seller"
                  MenuProps={{ autoFocus: false }}
                  onChange={handleBuySideSelectChange}
                  style={{ width: "100%" }}
                >
                  <MenuItem value={-1}>Select...</MenuItem>
                  <MenuItem value={0}>Check(s)</MenuItem>
                  <MenuItem value={1}>Bank Wire</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginBottom: 10 }}>
              <Grid item xs={4}>
                <label>
                  Deal side
                </label>
              </Grid>
              <Grid item xs={8}>
                Buy Side
              </Grid>
            </Grid>
            {(selectValueBuySide === 0) && (
              <>
                {buySideChecks.map(
                  (checkData: IRemittanceChecks, index: number) => (
                    <Box style={{ marginTop: 20 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <label>{`Check - ${index + 1}`}</label>
                        </Grid>
                        <Grid item xs={8}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                size="small"
                                value={checkData.check_num}
                                style={{ width: "100%" }}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  updateCheckDataList(
                                    index,
                                    "check_num",
                                    e.target.value,
                                    "BuySide"
                                  )
                                }
                                type="number"
                                label="Check #"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                size="small"
                                value={checkData.amount}
                                style={{ width: "100%" }}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  updateCheckDataList(
                                    index,
                                    "amount",
                                    e.target.value,
                                    "BuySide"
                                  )
                                }
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                }}
                                label="Amount"
                              />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <DatePicker
                                Picker={DayPicker}
                                value={
                                  typeof checkData.check_date == "string"
                                    ? new Date(checkData.check_date)
                                    : checkData.check_date
                                }
                                setValue={(value: Date) =>
                                  updateCheckDataList(index, "check_date", value, "BuySide")
                                }
                                label="Date on check"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <DatePicker
                                Picker={DayPicker}
                                value={
                                  typeof checkData.check_receive_date == "string"
                                    ? new Date(checkData.check_receive_date)
                                    : checkData.check_receive_date
                                }
                                setValue={(value: Date) =>
                                  updateCheckDataList(
                                    index,
                                    "check_receive_date",
                                    value,
                                    "BuySide"
                                  )
                                }
                                label="Date check received"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  )
                )}
                <Box style={{ marginTop: 20 }}>
                  <Button
                    variant="outlined"
                    onClick={handleClickBuySideAddAnotherCheckButton}
                    style={{
                      color: "black !important",
                      borderColor: "#dbdbdb !important",
                      paddingBottom: 2,
                      paddingTop: 2,
                      marginLeft: 10,
                    }}
                  >
                    + Add another check
                  </Button>
                  {buySideChecks.length > 1 && (
                    <Button
                      variant="outlined"
                      onClick={handleClickBuySideRemoveCheckButton}
                      style={{
                        color: "black !important",
                        borderColor: "#dbdbdb !important",
                        paddingBottom: 2,
                        paddingTop: 2,
                        marginLeft: 10,
                      }}
                    >
                      Remove one
                    </Button>
                  )}
                </Box>
              </>
            )}
            {(selectValueBuySide === 1) && (
            <Box style={{ marginTop: 20, marginBottom: 10 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <label>Amount</label>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    size="small"
                    value={_dealData.remittance_buy_side_bank_wire_amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangeValue(e, "remittance_buy_side_bank_wire_amount")
                    }
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          $
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            )}
          </Box>
        )}
        {(showSell || showBoth) && (
          <Box style={{ marginTop: 40 }}>
            <Grid container spacing={2} style={{ marginBottom: 10 }}>
              <Grid item xs={4}>
                <label>Form of Remittance</label>
              </Grid>
              <Grid item xs={8}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectValueListingSide}
                  label="Seller"
                  MenuProps={{ autoFocus: false }}
                  onChange={handleListingSideSelectChange}
                  style={{ width: "100%" }}
                >
                  <MenuItem value={-1}>Select...</MenuItem>
                  <MenuItem value={0}>Check(s)</MenuItem>
                  <MenuItem value={1}>Bank Wire</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginBottom: 10 }}>
              <Grid item xs={4}>
                <label>
                  Deal side
                </label>
              </Grid>
              <Grid item xs={8}>
                Listing Side
              </Grid>
            </Grid>
            {(selectValueListingSide === 0) && (
              <>
                {listingSideChecks.map(
                  (checkData: IRemittanceChecks, index: number) => (
                    <Box style={{ marginTop: 20 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <label>{`Check - ${index + 1}`}</label>
                        </Grid>
                        <Grid item xs={8}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                size="small"
                                value={checkData.check_num}
                                style={{ width: "100%" }}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  updateCheckDataList(
                                    index,
                                    "check_num",
                                    e.target.value,
                                    "ListingSide"
                                  )
                                }
                                type="number"
                                label="Check #"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                size="small"
                                value={checkData.amount}
                                style={{ width: "100%" }}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  updateCheckDataList(
                                    index,
                                    "amount",
                                    e.target.value,
                                    "ListingSide"
                                  )
                                }
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                }}
                                label="Amount"
                              />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <DatePicker
                                Picker={DayPicker}
                                value={
                                  typeof checkData.check_date == "string"
                                    ? new Date(checkData.check_date)
                                    : checkData.check_date
                                }
                                setValue={(value: Date) =>
                                  updateCheckDataList(index, "check_date", value, "ListingSide")
                                }
                                label="Date on check"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <DatePicker
                                Picker={DayPicker}
                                value={
                                  typeof checkData.check_receive_date == "string"
                                    ? new Date(checkData.check_receive_date)
                                    : checkData.check_receive_date
                                }
                                setValue={(value: Date) =>
                                  updateCheckDataList(
                                    index,
                                    "check_receive_date",
                                    value,
                                    "ListingSide"
                                  )
                                }
                                label="Date check received"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  )
                )}
                <Box style={{ marginTop: 20 }}>
                  {/* <Button variant="contained" onClick={handleClickAddAnotherCheckButton} style={{ backgroundColor: '#0fb78d', color: 'white', paddingBottom: 2, paddingTop: 2 }}> */}
                  {/* + Add another check */}
                  {/* </Button> */}
                  <Button
                    variant="outlined"
                    onClick={handleClickListingSideAddAnotherCheckButton}
                    style={{
                      color: "black !important",
                      borderColor: "#dbdbdb !important",
                      paddingBottom: 2,
                      paddingTop: 2,
                      marginLeft: 10,
                    }}
                  >
                    + Add another check
                  </Button>
                  {listingSideChecks.length > 1 && (
                    <Button
                      variant="outlined"
                      onClick={handleClickListingSideRemoveCheckButton}
                      style={{
                        color: "black !important",
                        borderColor: "#dbdbdb !important",
                        paddingBottom: 2,
                        paddingTop: 2,
                        marginLeft: 10,
                      }}
                    >
                      Remove one
                    </Button>
                  )}
                </Box>
              </>
            )}
            {(selectValueListingSide === 1) && (
              <Grid container spacing={2} style={{ marginTop: 20, marginBottom: 10 }}>
                <Grid item xs={4}>
                  <label>Amount</label>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    size="small"
                    value={_dealData.remittance_listing_side_bank_wire_amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangeValue(e, "remittance_listing_side_bank_wire_amount")
                    }
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          $
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        )}
        {showButton && (
          <Box style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              onClick={handleClickNextButton}
              style={{
                marginBottom: 20,
                backgroundColor: "#0fb78d",
                color: "white",
              }}
            >
              Looks good, Next
            </Button>
          </Box>
        )}
      </QuestionForm>
    </QuestionSection>
  );
};

export default RemittanceQuestion;
