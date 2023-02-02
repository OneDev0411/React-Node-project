import React from "@libs/react"
import Ui from "@libs/material-ui"
import { IChecksItemProps, IRemittanceChecks } from "../../../../models/type"
import { DatePicker } from "../../../DatePicker"
import { stylizeNumber } from "../../../../util"

const CheckDataItemComponent: React.FC<IChecksItemProps> = ({
  checkData,
  id,
  length,
  dayPicker,
  removeCheckData,
  updateCheckData
}) => {
  const { useState, useEffect } = React
  const { Grid, TextField, InputAdornment, Box, IconButton } = Ui

  const [checkDataAmount, setCheckDataAmount] = useState<string>('')

  const checkAmountEvent = document.getElementById(`check_amount${id}`)
  checkAmountEvent?.addEventListener('focusout', () => {
    let _checkDataAmount = stylizeNumber(parseFloat(parseFloat(String(Number(checkDataAmount.replace(/\,/g,'')))).toFixed(2)))
    setCheckDataAmount(_checkDataAmount)
  })

  const updateCheckDataList = (
    id: number,
    key: keyof IRemittanceChecks,
    value: IRemittanceChecks[typeof key],
  ) => {
    if (key === "amount") {
      let changedAmount = Number(String(value).replace(/\,/g,''))
      setCheckDataAmount(String(value))
      updateCheckData(id, key, changedAmount)
    } else {
      updateCheckData(id, key, value)    
    }
  }

  useEffect(() => {
    if (checkData) {
      let _checkDataAmount = stylizeNumber(checkData.amount)
      setCheckDataAmount(_checkDataAmount)
    } else {
      setCheckDataAmount('0')
    }
  }, [])

  return (
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
      key={id}
    >
      {length > 1 && <IconButton size="small" style={{ position: 'absolute', top: 10, right: 10, width: 7, height: 5 }} onClick={() => removeCheckData(id)}>
        x
      </IconButton>}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <label>{`Check - ${id + 1}`}</label>
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
                    id,
                    "check_num",
                    e.target.value,
                  )
                }
                type="number"
                label="Check #"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                id={`check_amount${id}`}
                value={checkDataAmount}
                style={{ width: "100%" }}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>
                ) =>
                  updateCheckDataList(
                    id,
                    "amount",
                    e.target.value,
                  )
                }
                type="string"
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
                Picker={dayPicker}
                value={
                  typeof checkData.check_date == "string"
                    ? new Date(checkData.check_date)
                    : checkData.check_date
                }
                setValue={(value: Date) =>
                  updateCheckDataList(id, "check_date", value)
                }
                label="Date on check"
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                Picker={dayPicker}
                value={
                  typeof checkData.check_receive_date == "string"
                    ? new Date(checkData.check_receive_date)
                    : checkData.check_receive_date
                }
                setValue={(value: Date) =>
                  updateCheckDataList(
                    id,
                    "check_receive_date",
                    value,
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
}
export default CheckDataItemComponent
