import React from "@libs/react"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { FeeQuestionProps, IFeeData } from "../../../../models/type"
import { feeTypeData } from '../../../../util'

const FeeQuestionComponent: React.FC<FeeQuestionProps> = ({
  deal,
  saveData: { updateFlag }
}) => {
	const { Box, Button, TextField, Grid, Select, IconButton, MenuItem, Radio, RadioGroup, InputAdornment, FormControlLabel } = Ui
  const { useEffect } = React
  const { submitted, setFeeData, feeData } = useApp()

	const fees = feeData.filter((item: IFeeData) => (item.deal == deal))
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
    temp.splice(index-1 , 1)
		for (let i= 0; i < temp.length; i++) {
			temp[i].id = i+1;
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
    let updatedValue = JSON.parse(JSON.stringify(feeData))
    if (key == "feeType"){
      updatedValue[id-1].fee_type = e.target.value
    }
    if (key == "feePercentAmount") {
      updatedValue[id-1].fee_amount_percentage = e.target.value
    }
    if (key == "feeAmount") {
      updatedValue[id-1].fee_amount = e.target.value
    }
    if (key == "feeUnit") {
      updatedValue[id-1].fee_unit = Number(e.target.value)
      if(updatedValue[id-1].fee_unit == 1) {
        updatedValue[id-1].fee_amount_percentage = 0
      } else {
        updatedValue[id-1].fee_amount = 0
      }
    }
    if (key == "feeType-method") {
      updatedValue[id-1].fee_method = e.target.value
    }
		if (setFeeData !== undefined) {
			setFeeData(updatedValue)
		}
  }

	const handleClickAddAnotherButton = () => {
    let emptyValue: IFeeData = {
      id: feeData.length + 1,
      deal: deal,
      fee_type: "",
      fee_amount: "",
      fee_amount_percentage: "",
      fee_unit: 0,
      fee_method: 0,
    }
    let updatedValue = JSON.parse(JSON.stringify(feeData))
    updatedValue.push(emptyValue)
    if(setFeeData != undefined){
      setFeeData(updatedValue)
    }
  }

  return (
		<>
    {fees.map((item: IFeeData, id: number) => 
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
				{fees.length > 1 && 
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
							() => handleClickRemoveFee(item.id)
						}
					>
						x
					</IconButton>
				}
				<Grid container spacing={2} style={{ marginBottom: 10 }}>
					<Grid item xs={3}>
						<label>Fee Type</label>
					</Grid>
					<Grid item xs={9}>
						<Select
							defaultValue=""
							id="grouped-select"
							label="Grouping"
							style={{ width: "100%" }}
							value={item.fee_type}
							onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
								handleChangeValue(e, "feeType", item.id)
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
								handleChangeValue(e, "feeUnit", item.id)
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
								handleChangeValue(e, "feePercentAmount", item.id)
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
								handleChangeValue(e, "feeUnit", item.id)
							}
							value={1}
							name="radio-buttons"
							size="small"
						/>
						<TextField
							variant="standard"
							style={{ width: '100%'}}
							value={item.fee_amount}
							onChange={(e: React.ChangeEvent<{ value: unknown }>) => 
								handleChangeValue(e, "feeAmount", item.id)
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
				<Grid container xs={8}>
					<Grid item xs={3}></Grid>
					<Grid item xs={9}>
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
								label="Off Net"
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
