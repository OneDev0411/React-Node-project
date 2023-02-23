import React from '@libs/react'
import Ui from '@libs/material-ui'
import useApp from '../../../../hooks/useApp'
import { CreditItemProps, ICreditData } from "../../../../models/type"
import { stylizeNumber } from '../../../../util'

const CreditItemComponent: React.FC<CreditItemProps> = ({
  credits,
  index,
  updateCredit
}) => {
  const { useState, useEffect } = React
  const { Grid, Box, TextField } = Ui

  const [amount, setAmount] = useState<string>("")

  const amountEvent = document.getElementById(`credit${index}`)
  amountEvent?.addEventListener('focusout', () => {
    let displayValue = stylizeNumber(Number(amount))
    setAmount(displayValue)
  })
  const handleChangeAmount = (value: string) => {
    setAmount(value)
    let temp: ICreditData = credits
    temp.credit_amount = value
    updateCredit(temp, index)
  }

  useEffect(() => {
    let credit = stylizeNumber(Number(credits.credit_amount))
    setAmount(credit)
  }, [credits])

  return (
    <>
      <Grid container spacing={2} style={{marginBottom: 10, display: 'flex'}}>
        <Grid item xs={3}>
          <label>Credit Side</label>
        </Grid>
        <Grid item xs={9}>
          <label>{credits.credit_side}</label>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{marginBottom: 10}}>
        <Grid item xs={3}>
          <label>Credit To</label>
        </Grid>
        <Grid item xs={9}>
          <label>{credits.credit_to}</label>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{marginBottom: 10}}>
        <Grid item xs={3}>
          <label>Credit Amount</label>
        </Grid>
        <Grid item xs={9}>
          <TextField
            id={`credit${index}`}
            style={{width: "100%"}}
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleChangeAmount(e.target.value)
            }
            type="text"
          />
        </Grid>
      </Grid>
    </>
  )
}

export default CreditItemComponent