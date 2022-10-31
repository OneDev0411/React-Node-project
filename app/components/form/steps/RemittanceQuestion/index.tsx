import React from "@libs/react"
import ReactUse from "@libs/react-use"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { IDealData, IRoleData, IQuestionProps, IRemittanceChecks } from "../../../../models/type"
import { defaultRemittanceChecks } from "../../../../util"
import { DatePicker } from "../../../DatePicker"

const RemittanceQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  models: { deal },
  Components: { DatePicker: DayPicker },
}) => {
  const { useState, useEffect } = React
  const { useDebounce } = ReactUse
  const { Grid, Select, MenuItem, TextField, InputAdornment, Box, Button, IconButton } = Ui
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { dealData, setDealData, roleData, remittanceChecks, setRemittanceChecks, submitted, setSubmitted, currentStep, setCurrentStep } = useApp()
  const enderType = deal.context.ender_type?.text
  const showBoth = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? true : false
  const showBuy = showBoth || deal.deal_type === "Buying"
  const showSell = showBoth || deal.deal_type === "Selling"

  const defaultCheckData: IRemittanceChecks = {
    id: null,
    deal: deal.id,
    check_num: 0,
    check_date: new Date(),
    check_receive_date: new Date(),
    amount: 0,
    deal_side: "",
  }
  let defaultChecksData: IRemittanceChecks[] = defaultRemittanceChecks
  defaultChecksData[0].deal = deal.id

  // state
  const [buySideChecks, setBuySideChecks] = useState<IRemittanceChecks[]>(defaultChecksData)
  const [listingSideChecks, setListingSideChecks] = useState<IRemittanceChecks[]>(defaultChecksData)
  const [_remittanceChecks, _setRemittanceChecks] = useState<IRemittanceChecks[]>(remittanceChecks)
  const [selectValueBuySide, setSelectValueBuySide] = useState<number>(-1)
  const [selectValueListingSide, setSelectValueListingSide] = useState<number>(-1)
  const [_dealData, _setDealData] = useState<IDealData>(dealData)
  const [showButton, setShowButton] = useState<boolean>(true)

  const handleBuySideSelectChange = (event: any) => {
    const value: number = event.target.value
    setSelectValueBuySide(value)
    if (wizard.currentStep < step + 1 && value !== -1) {
      if (showBoth && selectValueListingSide === -1)
        setShowButton(false)
      else
        setShowButton(true)
    }
    else
      setShowButton(false)
  }

  const handleListingSideSelectChange = (event: any) => {
    const value: number = event.target.value
    setSelectValueListingSide(value)
    if (wizard.currentStep < step + 1 && value !== -1) {
      if (showBoth && selectValueBuySide === -1)
        setShowButton(false)
      else
        setShowButton(true)
    }
    else
      setShowButton(false)
  }

  const handleClickBuySideAddAnotherCheckButton = () => {
    let temp = buySideChecks.slice()
    temp.push(defaultCheckData)
    setBuySideChecks(temp)
  }

  const removeBuySideCheck = (index: number) => {
    let temp = buySideChecks.slice()
    temp.splice(index, 1)
    setBuySideChecks(temp)
  }
  
  const handleClickListingSideAddAnotherCheckButton = () => {
    let temp = listingSideChecks.slice()
    temp.push(defaultCheckData)
    setListingSideChecks(temp)
  }

  const removeListingSideCheck = (index: number) => {
    let temp = listingSideChecks.slice()
    temp.splice(index, 1)
    setListingSideChecks(temp)
  }

  const updateCheckDataList = (
    index: number,
    key: keyof IRemittanceChecks,
    value: IRemittanceChecks[typeof key],
    dealSide: string,
  ) => {
    if (dealSide === "BuySide") {
      let temp = buySideChecks.slice()
      temp[index] = { ...temp[index], [key]: value, deal_side: dealSide, deal: deal.id }
      setBuySideChecks(temp)
    }
    if (dealSide === "ListingSide") {
      let temp = listingSideChecks.slice()
      temp[index] = { ...temp[index], [key]: value, deal_side: dealSide, deal: deal.id }
      setListingSideChecks(temp)
    }
  }

  const handleClickNextButton = () => {
    setShowButton(false)
    let temp = JSON.parse(JSON.stringify(dealData))
    temp.current_step = step + 1
    if (setDealData !== undefined)
      setDealData(temp)
    setTimeout(() => {
      if (wizard.currentStep < step + 1) {
        wizard.next()
        if (setCurrentStep !== undefined) {
          setCurrentStep(step+1)
        }
      }
    }, 80)
  }

  const handleChangeValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof IDealData
  ) => {
    let value: string = e.target.value
    if (Number(value) + "" === "NaN" || (value + "").length > 16) {
      return
    }

    let temp = JSON.parse(JSON.stringify(_dealData))
    temp[key] = Number(value)
    _setDealData(temp)
  }

  useEffect(() => {
    const _buySideChecks = _remittanceChecks.filter(item => item.deal_side == "BuySide")
    if (_buySideChecks.length > 0)
      setBuySideChecks(_buySideChecks)
    const _listingSideChecks = _remittanceChecks.filter(item => item.deal_side == "ListingSide")
    if (_listingSideChecks.length > 0)
      setListingSideChecks(_listingSideChecks)

    if (submitted === 1 || 
        dealData.current_step > step || 
        (showBuy && (!_buySideChecks.length || (_buySideChecks.length && _buySideChecks[0].check_num == 0 && _buySideChecks[0].amount == 0)) && _dealData.remittance_buy_side_bank_wire_amount == null) ||
        (showSell && (!_listingSideChecks.length || (_listingSideChecks.length && _listingSideChecks[0].check_num == 0 && _listingSideChecks[0].amount == 0)) && _dealData.remittance_listing_side_bank_wire_amount == null)
    ) {
      setShowButton(false)
    }
    else {
      setShowButton(true)
      _dealData.brokerage_commission = _dealData.brokerage_commission == 0 ? roleData.reduce((total: any, data: IRoleData) => {
        return parseFloat(
          (Number(total) + Number(data.share_value)).toFixed(3)
        )
      }, 0) : _dealData.brokerage_commission
    }
  }, [])

  useEffect(() => {
    if (buySideChecks.length == 1 && buySideChecks[0].check_num == 0 && buySideChecks[0].amount == 0 && (_dealData.remittance_buy_side_bank_wire_amount == null || _dealData.remittance_buy_side_bank_wire_amount == undefined))
      setSelectValueBuySide(-1)
    if ((buySideChecks.length == 1 && (buySideChecks[0].check_num != 0 || buySideChecks[0].amount != 0) && _dealData.remittance_buy_side_bank_wire_amount == null) || buySideChecks.length > 1)
      setSelectValueBuySide(0)
    if (buySideChecks.length == 1 && buySideChecks[0].check_num == 0 && buySideChecks[0].amount == 0 && (_dealData.remittance_buy_side_bank_wire_amount != null && _dealData.remittance_buy_side_bank_wire_amount != undefined))
      setSelectValueBuySide(1)
    if (listingSideChecks.length == 1 && listingSideChecks[0].check_num == 0 && listingSideChecks[0].amount == 0 && (_dealData.remittance_listing_side_bank_wire_amount == null || _dealData.remittance_listing_side_bank_wire_amount == undefined))
      setSelectValueListingSide(-1)
    if ((listingSideChecks.length == 1 && listingSideChecks[0].check_num != 0 && listingSideChecks[0].amount != 0 && _dealData.remittance_listing_side_bank_wire_amount == null) || listingSideChecks.length > 1)
      setSelectValueListingSide(0)
    if (listingSideChecks.length == 1 && listingSideChecks[0].check_num == 0 && listingSideChecks[0].amount == 0 && (_dealData.remittance_listing_side_bank_wire_amount != null && _dealData.remittance_listing_side_bank_wire_amount != undefined))
      setSelectValueListingSide(1)
    
    const _buySideChecks = buySideChecks.filter((item) => item.check_num !== 0 && item.amount !== 0)
    const _listingSideChecks = listingSideChecks.filter((item) => item.check_num !== 0 && item.amount !== 0)
    _setRemittanceChecks([..._buySideChecks, ..._listingSideChecks])
  }, [_dealData, buySideChecks, listingSideChecks])

  useDebounce(
    () => {
      if (setRemittanceChecks !== undefined) {
        setRemittanceChecks(_remittanceChecks)
      }
      let temp = JSON.parse(JSON.stringify(dealData))
      if (setDealData !== undefined) {
        if (_dealData.stage_cost !== 0) {
          temp.brokerage_commission = _dealData.brokerage_commission
          temp.stage_cost = _dealData.stage_cost
        }
        temp.remittance_buy_side_bank_wire_amount = selectValueBuySide == 0 ? null : (_dealData.remittance_buy_side_bank_wire_amount == 0 ? null : _dealData.remittance_buy_side_bank_wire_amount)
        temp.remittance_listing_side_bank_wire_amount = selectValueListingSide == 0 ? null : (_dealData.remittance_listing_side_bank_wire_amount == 0 ? null : _dealData.remittance_listing_side_bank_wire_amount)
        setDealData(temp)
      }
      if (submitted === 1) {
        if (setSubmitted !== undefined) {
          setSubmitted(2)
        }
      }
    },
    500,
    [_remittanceChecks, _dealData]
  )

  return (
    <QuestionSection>
      <QuestionTitle>Please input remittance info.</QuestionTitle>
      <QuestionForm width="55%">
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
                    <Box 
                      style={{
                        marginBottom: 20,
                        padding: 15,
                        paddingTop: 15,
                        paddingRight: 10,
                        display: 'inline-block',
                        position: 'relative', 
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        borderRadius: 4
                      }}
                      key={index}
                    >
                      {buySideChecks.length > 1 && <IconButton size="small" style={{ position: 'absolute', top: 10, right: 10, width: 7, height: 5 }} onClick={() => removeBuySideCheck(index)}>
                        x
                      </IconButton>}
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
                    <Box
                      style={{
                        marginBottom: 20,
                        padding: 15,
                        paddingTop: 15,
                        paddingRight: 10,
                        display: 'inline-block',
                        position: 'relative', 
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        borderRadius: 4
                      }}
                      key={index}
                    >
                      {listingSideChecks.length > 1 && <IconButton size="small" style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 5 }} onClick={() => removeListingSideCheck(index)}>
                        x
                      </IconButton>}
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <label>{`Check - ${index + 1}`}</label>
                        </Grid>
                        <Grid item xs={9}>
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
  )
}

export default RemittanceQuestion
