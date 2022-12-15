import React from "@libs/react"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { FeeQuestionProps, IFeeData } from "../../../../models/type"
import { feeTypeData, stylizeNumber } from '../../../../util'

const FeeQuestionComponent: React.FC<FeeQuestionProps> = ({
  deal,
  saveData: { updateFlag }
}) => {
	const { Box, Button, TextField, Grid, Select, IconButton, MenuItem, Radio, RadioGroup, InputAdornment, FormControlLabel } = Ui
  const { useEffect } = React
  const { submitted, setFeeData, feeData } = useApp()

	useEffect(() => {
		updateFlag(true)
	}, [feeData])

	const feeTypeElement = feeTypeData.feeName.map((feeType: string, index: any) => {
    return (
      <MenuItem value={feeType} id={index}>{feeType}</MenuItem>
    )
  })

	const handleClickRemoveFee = (index: number) => {
    let temp = JSON.parse(JSON.stringify(feeData))
    temp.splice(index , 1)
		for (let i= 0; i < temp.length; i++) {
			temp[i].key_Index = i;
		}
		if(setFeeData !== undefined) {
			setFeeData(temp)
		}
  }

	const handleChangeValue = (
    e: React.ChangeEvent<{ value: unknown }>,
    key: string,
    id: number
  ) => {
		let value = e.target.value
    let updatedValue = JSON.parse(JSON.stringify(feeData))
    if (key == "feeType"){
      updatedValue[id].fee_type = e.target.value
    }
		if (key == "feeDealSide") {
			updatedValue[id].deal_side = e.target.value
		}
    if (key == "feePercentAmount") {
      updatedValue[id].fee_amount_percentage = e.target.value
    }
    if (key == "feeAmount") {
      updatedValue[id].fee_amount = String(value).replace(/\,/g,'')
    }
		if (key == "feeFrom") {
			updatedValue[id].fee_from = e.target.value
		}
    if (key == "feeUnit") {
      updatedValue[id].fee_unit = Number(e.target.value)
      if(updatedValue[id].fee_unit == 1) {
        updatedValue[id].fee_amount_percentage = 0
      } else {
        updatedValue[id].fee_amount = 0
      }
    }
    if (key == "feeType-method") {
      updatedValue[id].fee_method = e.target.value
    }
		if (setFeeData !== undefined) {
			setFeeData(updatedValue)
		}
  }

	const handleClickAddAnotherButton = () => {
    let emptyValue: IFeeData = {
      id: null,
      deal: deal,
			deal_side: 0,
      fee_type: "",
      fee_amount: "",
      fee_amount_percentage: "",
			fee_from: 0,
      fee_unit: 0,
      fee_method: 0,
	  	key_Index: feeData.length
    }
    let updatedValue = JSON.parse(JSON.stringify(feeData))
    updatedValue.push(emptyValue)
    if(setFeeData != undefined){
      setFeeData(updatedValue)
    }
  }

  return (
		<>
    {feeData.map((item: IFeeData, id: number) => 
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
				{feeData.length > 1 && 
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
							value={item.fee_amount_percentage}
							onChange={(e: React.ChangeEvent<{ value: unknown }>) => 
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
							value={stylizeNumber(Number(item.fee_amount))}
							type="string"
							onChange={(e: React.ChangeEvent<{ value: unknown }>) => 
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
		)}
		<Box>
			<Button
				variant="outlined"
				onClick={handleClickAddAnotherButton}
				style={{
					color: "black !important",
					borderColor: "#dbdbdb !important",
					paddingBottom: 2,
					paddingTop: 2,
					marginLeft: 10,
				}}
			>
				+ Add More Fee
			</Button>
		</Box>
		</>
  )
}

export default FeeQuestionComponent
