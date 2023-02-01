import React from "@libs/react"
import Ui from "@libs/material-ui"
import { FeeItemProps, IFeeData } from "../../../../models/type"
import { feeTypeData, stylizeNumber } from '../../../../util'

const FeeItemComponent: React.FC<FeeItemProps> = ({
  item,
  id,
  length,
  handleClickRemoveFee,
  updateData
}) => {
  const { Box, TextField, Grid, Select, IconButton, Radio, RadioGroup, MenuItem, InputAdornment, FormControlLabel } = Ui
  const { useEffect, useState } = React

  const [feeAmounts, setFeeAmounts] = useState<string>('')
  const [feePercents, setFeePercents] = useState<string>('')

  const feeAmountsEvents = document.getElementById(`fee_amounts${id}`)
  feeAmountsEvents?.addEventListener('focusout', () => {
    let _feeAmounts = stylizeNumber(parseFloat(parseFloat(String(Number(feeAmounts.replace(/\,/g,'')))).toFixed(2)))
    setFeeAmounts(_feeAmounts)
  })
  const feePercentsEvent = document.getElementById(`fee_percents${id}`)
  feePercentsEvent?.addEventListener('focusout', () => {
    let _feePercents = stylizeNumber(parseFloat(feePercents))
    setFeePercents(_feePercents)
  })

  const feeTypeElement = feeTypeData.feeName.map((feeType: string, index: any) => {
    return (
      <MenuItem value={feeType} id={index}>{feeType}</MenuItem>
    )
  })

  const handleChangeValue = (
    e: React.ChangeEvent<{ value: unknown }>,
    key: string,
    id: number
  ) => {
    let value = String(e.target.value)
    let updatedValue: IFeeData = JSON.parse(JSON.stringify(item))
    if (key == "feeType"){
      updatedValue.fee_type = value
			if (value === "Additional Brokerage Commission") {
				updatedValue.fee_unit = 1
				updatedValue.fee_amount = '295'
				setFeeAmounts('295')
			}
    }
		if (key === "feeDealSide") {
			updatedValue.deal_side = Number(e.target.value)
		}
    if (key === "feePercentAmount") {
      updatedValue.fee_amount_percentage = value
			setFeePercents(value)
    }
    if (key === "feeAmount") {
      updatedValue.fee_amount = String(value).replace(/\,/g,'')
			setFeeAmounts(value)
    }
		if (key === "feeFrom") {
			updatedValue.fee_from = Number(e.target.value)
		}
		if (key === "feePaid") {
			console.log('feePaid', Number(e.target.value))
			updatedValue.fee_paid = Number(e.target.value)
		}
    if (key === "feeUnit") {
      updatedValue.fee_unit = Number(e.target.value)
      if(updatedValue.fee_unit == 1) {
        updatedValue.fee_amount_percentage = "0"
        setFeePercents("0")
      } else {
        updatedValue.fee_amount = "0"
        setFeeAmounts("0")
      }
    }
    if (key === "feeType-method") {
      updatedValue.fee_method = Number(e.target.value)
    }
		updateData(updatedValue, id)
  }

  useEffect(() => {
    if (item.fee_amount !== "" || item.fee_amount_percentage !== "") {
      setFeeAmounts(stylizeNumber(parseFloat(item.fee_amount)))
      setFeePercents(stylizeNumber(parseFloat(item.fee_amount_percentage)))
    }
  }, [])

  return (
		<>
			<Box 
				style={{
					marginBottom: 20,
					padding: 30,
					paddingTop: 25,
					paddingRight: 15,
					display: 'inline-block',
					position: 'relative', 
					border: "1px solid rgba(0, 0, 0, 0.12)",
					borderRadius: 4
				}}
				key={id}
			>
				{length > 1 && 
					<IconButton 
						size="small"
						style={{
							position: 'absolute',
							top: 10,
							right: 10,
							width: 7,
							height: 5
						}}
						onClick={
							() => handleClickRemoveFee(id)
						}
					>
						x
					</IconButton>
				}
				<Grid container spacing={2} style={{marginBottom: 10, justifyContent: "center", alignItems: "center"}}>
					<Grid item xs={2}>
						<label>Deal Side</label>
					</Grid>
					<Grid item xs={1}></Grid>
					<Grid item xs={9} style={{paddingLeft: 20}}>
						<RadioGroup
							row
							aria-labelledby="demo-row-radio-buttons-group-label"
							name="row-radio-buttons-group"
							value={item.deal_side}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleChangeValue(e, "feeDealSide", id)
							}
						>
							<FormControlLabel
								value={0}
								style={{ marginRight: 20 }}
								control={
									<Radio
										checked={item.deal_side == 0}
										size="small"
										style={{ marginBottom: 3 }}
									/>
								}
								label="Buy"
							/>
							<FormControlLabel
								value={1}
								style={{ marginRight: 0 }}
								control={
									<Radio
										checked={item.deal_side == 1}
										size="small"
										style={{ marginBottom: 3 }}
									/>
								}
								label="List"
							/>
						</RadioGroup>
					</Grid>
				</Grid>
				<Grid container spacing={2} style={{ marginBottom: 10 }}>
					<Grid item xs={3}>
						<label>Fee Type</label>
					</Grid>
					<Grid item xs={9} style={{paddingLeft: 20}}>
						<Select
							defaultValue=""
							id="grouped-select"
							label="Grouping"
							style={{ width: "100%" }}
							value={item.fee_type}
							onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
								handleChangeValue(e, "feeType", id)
							}
						>
							{feeTypeElement}
						</Select>
					</Grid>
				</Grid>
				<Grid container spacing={2} style={{ marginBottom: 10 }}>
					<Grid item xs={3}>
						<label>Fee Amount</label>
					</Grid>
					<Grid item xs={4} style={{display: 'inherit'}}>
						<Radio
							checked={item.fee_unit == 0}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
								handleChangeValue(e, "feeUnit", id)
							}
							value={0}
							name="radio-buttons"
							size="small"
						/>
						<TextField
							variant="standard"
							style={{ width: '100%'}}
							id={`fee_percents${id}`}
							value={feePercents}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
								handleChangeValue(e, "feePercentAmount", id)
							}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">%</InputAdornment>
								),
							}}
							disabled={item.fee_unit == 1}
						/>
					</Grid>
					<Grid item xs={1}>
						<label>OR</label>
					</Grid>
					<Grid item xs={4} style={{display: 'inherit'}}>
						<Radio
							checked={item.fee_unit == 1}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
								handleChangeValue(e, "feeUnit", id)
							}
							value={1}
							name="radio-buttons"
							size="small"
						/>
						<TextField
							variant="standard"
							style={{ width: '100%'}}
							id={`fee_amounts${id}`}
							value={feeAmounts}
							type="string"
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
								handleChangeValue(e, "feeAmount", id)
							}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">$</InputAdornment>
								),
							}}
							disabled={item.fee_unit == 0}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2} style={{marginBottom: 10, justifyContent: "center", alignItems: "center"}}>
					<Grid item xs={2}>
						<label>Fee From</label>
					</Grid>
					<Grid item xs={1}></Grid>
					<Grid item xs={9} style={{paddingLeft: 20}}>
						<RadioGroup
							row
							aria-labelledby="demo-row-radio-buttons-group-label"
							name="row-radio-buttons-group"
							value={item.fee_from}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleChangeValue(e, "feeFrom", id)
							}
						>
							<FormControlLabel
								value={0}
								style={{ marginRight: 20 }}
								control={
									<Radio
										checked={item.fee_from == 0}
										size="small"
										style={{ marginBottom: 3 }}
									/>
								}
								label="Agent"
							/>
							<FormControlLabel
								value={1}
								style={{ marginRight: 0 }}
								control={
									<Radio
										checked={item.fee_from == 1}
										size="small"
										style={{ marginBottom: 3 }}
									/>
								}
								label="Deal"
							/>
						</RadioGroup>
					</Grid>
				</Grid>
				<Grid container spacing={2} style={{marginBottom: 10, justifyContent: "center", alignItems: "center"}}>
					<Grid item xs={2}>
						<label>Fee Paid</label>
					</Grid>
					<Grid item xs={1}></Grid>
					<Grid item xs={9} style={{paddingLeft: 20}}>
						<RadioGroup
							row
							aria-labelledby="demo-row-radio-buttons-group-label"
							name="row-radio-buttons-group"
							value={item.fee_paid}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleChangeValue(e, "feePaid", id)
							}
						>
							<FormControlLabel
								value={0}
								style={{ marginRight: 20 }}
								control={
									<Radio
										checked={item.fee_paid == 0}
										size="small"
										style={{ marginBottom: 3 }}
									/>
								}
								label="Yes"
							/>
							<FormControlLabel
								value={1}
								style={{ marginRight: 0 }}
								control={
									<Radio
										checked={item.fee_paid == 1}
										size="small"
										style={{ marginBottom: 3 }}
									/>
								}
								label="No"
							/>
						</RadioGroup>
					</Grid>
				</Grid>
				<Grid container xs={10}>
					<Grid item xs={2}></Grid>
					<Grid item xs={10}>
						<RadioGroup
							row
							aria-labelledby="demo-row-radio-buttons-group-label"
							name="row-radio-buttons-group"
							value={item.fee_method}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleChangeValue(e, "feeType-method", id)
							}
						>
							<FormControlLabel
								value={0}
								style={{ marginRight: 20 }}
								control={
									<Radio
										checked={item.fee_method == 0}
										size="small"
										style={{ marginBottom: 3 }}
									/>
								}
								label="Off the agent net"
							/>
							<FormControlLabel
								value={1}
								style={{ marginRight: 0 }}
								control={
									<Radio
										checked={item.fee_method == 1}
										size="small"
										style={{ marginBottom: 3 }}
									/>
								}
								label="Off the Top"
							/>
						</RadioGroup>
					</Grid>
				</Grid>
			</Box>
		</>
  )
}

export default FeeItemComponent
