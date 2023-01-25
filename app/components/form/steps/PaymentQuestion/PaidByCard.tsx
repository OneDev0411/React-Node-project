import React from "@libs/react"
import { IPaidByCardProps, IPaidByData } from "../../../../models/type"
import { stylizeNumber } from "../../../../util"

const PaidByCard: React.FC<IPaidByCardProps> = ({
  Ui: {
    Grid,
    TextField,
    InputAdornment,
    Box,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
  },
  saveData: { updateFlag },
  payment,
  paymentIndex,
  updatePayment,
  index,
  paymentSide
}) => {
  const { useState, useEffect } = React
  // state
  const [_paidBy, _setPaidBy] = useState<IPaidByData>(payment.de_paid_by[index])
  const [checkedAgent, setCheckedAgent] = useState<boolean>(false)
  const [paidByInsidePercent, setPaidByInsidePercent] = useState<string>('')
  const [paidByInsideValue, setPaidByInsideValue] = useState<string>('')
  const [paidByOutsidePercent, setPaidByOutsidePercent] = useState<string>('')
  const [paidByOutsideValue, setPaidByOutsideValue] = useState<string>('')

  const paidByInsidePercentEvent = document.getElementById(`paid-by-Inside-percent${index}`)
  paidByInsidePercentEvent?.addEventListener('focusout', () => {
    let updatedPaidByPercent = paidByInsidePercent
    setPaidByInsidePercent(stylizeNumber(parseFloat(updatedPaidByPercent)))
  })
  const paidByOutsidePercentEvent = document.getElementById(`paid-by-Outside-percent${index}`)
  paidByOutsidePercentEvent?.addEventListener('focusout', () => {
    let updatedPaidByPercent = paidByOutsidePercent
    setPaidByOutsidePercent(stylizeNumber(parseFloat(updatedPaidByPercent)))
  })
  const paidByInsideValueEvent = document.getElementById(`paid-by-Inside-value${index}`)
  paidByInsideValueEvent?.addEventListener('focusout', () => {
    let updatedPaidByValue = paidByInsideValue
    setPaidByInsideValue(stylizeNumber(parseFloat(parseFloat(String(Number(updatedPaidByValue.replace(/\,/g,'')))).toFixed(2))))
  })
  const paidByOutsideValueEvent = document.getElementById(`paid-by-Outside-value${index}`)
  paidByOutsideValueEvent?.addEventListener('focusout', () => {
    let updatedPaidByValue = paidByOutsideValue
    setPaidByOutsideValue(stylizeNumber(parseFloat(parseFloat(String(Number(updatedPaidByValue.replace(/\,/g,'')))).toFixed(2))))
  })

  const handleChangeValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof IPaidByData
  ) => {
    updateFlag(true)
    let value: string = e.target.value.replace(/\,/g,'')
    if (key != "payment_note" && (value == "NaN" || (value + "").length > 16)) {
      return
    }
    if (
      key == "payment_value" &&
      _paidBy.payment_unit_type == 0 &&
      Number(value) > 100
    ) {
      return
    } else if (key == "payment_value" && _paidBy.payment_unit_type == 0) {
      paymentSide=="Inside" ? setPaidByInsidePercent(e.target.value) : setPaidByOutsidePercent(e.target.value)
    } else if (key == "payment_value" && _paidBy.payment_unit_type == 1) {
      paymentSide=="Inside" ? setPaidByInsideValue(e.target.value) : setPaidByOutsideValue(e.target.value)
    }
    let updateValue = JSON.parse(JSON.stringify(_paidBy))
    if (key !== "payment_note") {
      if (value !== "") {
        updateValue[key] = parseFloat(value)
      } else {
        updateValue[key] = 0
      }
    }
    if (key == "payment_note") {
      updateValue[key] = value
    }
    if (key == "payment_unit_type") {
      updateValue["payment_value"] = 0
      if (paymentSide == "Inside") {
        setPaidByInsidePercent(stylizeNumber(updateValue["payment_value"]))
        setPaidByInsideValue(stylizeNumber(updateValue["payment_value"]))
      } else {
        setPaidByOutsidePercent(stylizeNumber(updateValue["payment_value"]))
        setPaidByOutsideValue(stylizeNumber(updateValue["payment_value"]))
      }
    }
    _setPaidBy(updateValue)
  }

  const handleCheckedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFlag(true)
    let value = e.target.checked
    setCheckedAgent(value)
  }

  useEffect(() => {
    if (checkedAgent) {
      if (payment.de_paid_by[index].payment_unit_type !== null)
        _setPaidBy(payment.de_paid_by[index])
      else
        _setPaidBy({
          ..._paidBy,
          payment_unit_type: 0,
          payment_value: 0,
          payment_calculated_from: 0,
          payment_note: "",
        })
    }
    else {
      _setPaidBy({
        ..._paidBy,
        payment_unit_type: null,
        payment_value: null,
        payment_calculated_from: null,
        payment_note: "",
      })
    }
  }, [checkedAgent])
  
  useEffect(() => {
    if (payment.de_paid_by[index].payment_value != null)
      setCheckedAgent(true)
    else
      setCheckedAgent(false)
  }, [])

  useEffect(() => {
    if(_paidBy.payment_unit_type == 0 && _paidBy.payment_value) {
      paymentSide=="Inside" ? setPaidByInsidePercent(stylizeNumber(_paidBy.payment_value)) : setPaidByOutsidePercent(stylizeNumber(_paidBy.payment_value))
    } else if (_paidBy.payment_unit_type == 1 && _paidBy.payment_value) {
      paymentSide=="Inside" ? setPaidByInsideValue(stylizeNumber(_paidBy.payment_value)) : setPaidByOutsideValue(stylizeNumber(_paidBy.payment_value))
    }
  }, [])
  
  useEffect(() => {
    if (index == 0) {
      if (payment.de_paid_by[index].payment_value != null)
        setCheckedAgent(true)
      else
        setCheckedAgent(false)
    }
  }, [payment.de_paid_to])

  useEffect(() => {
    let updateValue = JSON.parse(JSON.stringify(payment))
    updateValue.de_paid_by[index] = _paidBy
    updatePayment(updateValue, paymentIndex)
  }, [_paidBy])

  return (
    <Box
      style={{
        marginTop: 0,
        marginBottom: 10,
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: 4,
        padding: 10,
      }}
    >
      <Box style={{ alignSelf: "center", textAlign: "left" }}>
        <Checkbox
          size="small"
          style={{ marginBottom: 3 }}
          checked={checkedAgent}
          onChange={handleCheckedValue}
        />
        <label>{_paidBy.payment_by_name}</label>
        <label style={{ marginLeft: 10, fontSize: 13, color: "#ababab" }}>
          {_paidBy.role}
        </label>
      </Box>
      <Grid container spacing={1} style={{ padding: 0 }}>
        <Grid item xs={5} style={{ display: "inherit", marginRight: 10 }}>
          <Radio
            checked={_paidBy.payment_unit_type == 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(e, "payment_unit_type")
            }
            value={0}
            name="radio-buttons"
            inputProps={{ "aria-label": "A" }}
            size="small"
            disabled={!checkedAgent}
          />
          <TextField
            size="small"
            type="number"
            id={paymentSide=="Inside" ? `paid-by-Inside-percent${index}`: `paid-by-Outside-percent${index}`}
            value={paymentSide == "Inside" ? paidByInsidePercent : paidByOutsidePercent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(e, "payment_value")
            }
            style={{ paddingTop: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">%</InputAdornment>
              ),
            }}
            disabled={
              !checkedAgent || (_paidBy.payment_unit_type == 1)
            }
          />
        </Grid>
        <Grid item xs={1} style={{ alignSelf: "center" }}>
          OR
        </Grid>
        <Grid item xs={5} style={{ display: "inherit" }}>
          <Radio
            checked={_paidBy.payment_unit_type == 1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(e, "payment_unit_type")
            }
            value={1}
            name="radio-buttons"
            inputProps={{ "aria-label": "B" }}
            size="small"
            disabled={!checkedAgent}
          />
          <TextField
            size="small"
            type="string"
            id={paymentSide=="Inside" ? `paid-by-Inside-value${index}`: `paid-by-Outside-value${index}`}
            value={paymentSide == "Inside" ? paidByInsideValue : paidByOutsideValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(e, "payment_value")
            }
            style={{ paddingTop: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            disabled={
              !checkedAgent || (_paidBy.payment_unit_type == 0)
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} style={{ paddingLeft: 10 }}>
        <Grid
          item
          xs={5}
          style={{ maxWidth: "max-content", alignSelf: "center", marginTop: 2 }}
        >
          Calculated from:
        </Grid>
        <Grid item xs={7}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={_paidBy.payment_calculated_from}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(e, "payment_calculated_from")
            }
          >
            <FormControlLabel
              value={0}
              style={{ marginRight: 20 }}
              control={
                <Radio
                  size="small"
                  style={{ marginBottom: 3 }}
                  disabled={!checkedAgent}
                />
              }
              label="My GCI"
            />
            <FormControlLabel
              value={1}
              style={{ marginRight: 0 }}
              control={
                <Radio
                  size="small"
                  style={{ marginBottom: 3 }}
                  disabled={!checkedAgent}
                />
              }
              label="My NET"
            />
          </RadioGroup>
        </Grid>
      </Grid>
      <Grid container spacing={1} style={{ padding: 10, paddingTop: 0 }}>
        <Grid item xs={2}>
          <label>Notes:</label>
        </Grid>
        <Grid item xs={10}>
          <TextField
            variant="standard"
            style={{ color: "inherit", width: "100%" }}
            disabled={!checkedAgent}
            value={_paidBy.payment_note}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(
                e,
                "payment_note"
              )
            }
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default PaidByCard
