import React from "@libs/react"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { FeeItemProps, GCISplitStatus, IFeeData, IRoleData } from "../../../../models/type"
import { feeTypeData, stylizeNumber } from '../../../../util'

const FeeItemComponent: React.FC<FeeItemProps> = ({
  item,
  id,
  length,
  handleClickRemoveFee,
  updateData,
	Components: {AgentsPicker},
	dealType
}) => {
  const { Box, TextField, Grid, Select, IconButton, Radio, RadioGroup, MenuItem, InputAdornment, FormControlLabel, Button } = Ui
	const { roleData } = useApp()
  const { useEffect, useState } = React

  const [feeAmounts, setFeeAmounts] = useState<string>('')
  const [feePercents, setFeePercents] = useState<string>('')
	const [_roleData, _setRoleData] = useState<IRoleData[]>(roleData)
	const [selectingStatus, setSelectingStatus] = useState<string>('')
	const [selectedGCIBuyingAgents, setSelectedGCIBuyingAgents] = useState<string[]>([])
	const [selectedGCISellingSideAgents, setSelectedGCISellingSideAgents] = useState<string[]>([])

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
			if (value === "Additional Brokerage Commission") {
				updatedValue.fee_unit = 1
				updatedValue.fee_amount = '295'
				updatedValue.fee_amount_percentage = '0'
				setFeePercents(stylizeNumber(0))
				setFeeAmounts(stylizeNumber(295))
			}
      updatedValue.fee_type = value
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

	const handleEditPrimaryAgent = () => {
		setSelectingStatus('Selecting')
	}

	const handleCancelPrimaryAgent = () => {
		setSelectingStatus('Listing')
	}

	const handleSelectAgent = (agent: BrandedUser, id: number) => {
		if (dealType === "Buying" || dealType === "Both") {
			let _selectedGCIBuyingAgents = selectedGCIBuyingAgents
			_selectedGCIBuyingAgents[id] = agent.display_name
			setSelectedGCIBuyingAgents(_selectedGCIBuyingAgents)
		} else if (dealType === "Selling" || dealType === "Both") {
			let _selectedGCISellingSideAgents = selectedGCISellingSideAgents
			_selectedGCISellingSideAgents[id] = agent.display_name
			setSelectedGCIBuyingAgents(_selectedGCISellingSideAgents)
		}
		setSelectingStatus("Listing")
	}

  useEffect(() => {
		setSelectingStatus('Listing')
		if (item.fee_amount === "") {
			setFeeAmounts(stylizeNumber(0))
			setFeePercents(stylizeNumber(parseFloat(item.fee_amount_percentage)))
		} else if (item.fee_amount_percentage === "") {
			setFeeAmounts(stylizeNumber(parseFloat(item.fee_amount)))
			setFeePercents(stylizeNumber(0))
		}
  }, [])

	useEffect(() => {
		_setRoleData(roleData)
	}, [roleData])

	
	useEffect(() => {
		let _selectedGCIBuyingAgents = (dealType === 'Buying' || dealType === "Both") ? _roleData.filter((roleItem: IRoleData) => roleItem.role === "BuyerAgent" || roleItem.role === "CoBuyerAgent" || roleItem.role === "BuyerReferral").map((role) => {return role.legal_full_name}) : []
		let _selectedGCISellingSideAgents = (dealType === 'Selling' || dealType === "Both") ? _roleData.filter((roleItem: IRoleData) => roleItem.role === "SellerAgent" || roleItem.role === "CoSellerAgent" || roleItem.role=== "SellerReferral").map((role) => {return role.legal_full_name}) : []
		setSelectedGCISellingSideAgents(_selectedGCISellingSideAgents)
		setSelectedGCIBuyingAgents(_selectedGCIBuyingAgents)
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
						<label>Agents</label>
					</Grid>
					<Grid item xs={1}></Grid>
					<Grid item xs={9} style={{paddingLeft: 20}}>
						{(dealType === "Buying" || dealType === "Both") && (
							<>
								{selectingStatus === "Listing" && (
									<Box style={{display: "flex", textAlign: 'center'}}>
										<label style={{marginTop: 7}}>{selectedGCIBuyingAgents[id]}</label>
										<Button
											onClick={handleEditPrimaryAgent}
											style={{
												marginLeft: "auto",
												color: "black !important",
												border: "solid #dbdbdb 1px",
												borderRadius: 5
											}}
										>
											Edit
										</Button>
									</Box>
								)}
								{selectingStatus === "Selecting" && (
									<Box style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
										<AgentsPicker
											flattenTeams={true}
											isPrimaryAgent={false}
											useTeamBrandId={false}
											onSelectAgent={(agent: BrandedUser) =>
												handleSelectAgent(agent, id)
											}
										/>
										<Box style={{ marginTop: 5, textAlign: "right" }}>
											<Button
												onClick={handleCancelPrimaryAgent}
												style={{
													color: "black !important",
													border: "solid #dbdbdb 1px",
													borderRadius: 5,
												}}
											>
												Cancel
											</Button>
										</Box>
									</Box>
								)}
							</>
						)}
						{(dealType === "Selling" || dealType === "Both") && (
							<>
								{selectingStatus === "Listing" && (
									<Box style={{display: "flex"}}>
										<label style={{marginTop: 7}}>{selectedGCISellingSideAgents[id]}</label>
										<Button
											onClick={handleEditPrimaryAgent}
											style={{
												marginLeft: "auto",
												color: "black !important",
												border: "solid #dbdbdb 1px",
												borderRadius: 5
											}}
										>
											Edit
										</Button>
									</Box>
								)}
								{selectingStatus === "Selecting" && (
									<Box style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
										<AgentsPicker
											flattenTeams={true}
											isPrimaryAgent={false}
											useTeamBrandId={false}
											onSelectAgent={(agent: BrandedUser) =>
												handleSelectAgent(agent, id)
											}
										/>
										<Box style={{ marginTop: 5, textAlign: "right" }}>
											<Button
												onClick={handleCancelPrimaryAgent}
												style={{
													color: "black !important",
													border: "solid #dbdbdb 1px",
													borderRadius: 5,
												}}
											>
												Cancel
											</Button>
										</Box>
									</Box>
								)}
							</>
						)}
					</Grid>
				</Grid>
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
