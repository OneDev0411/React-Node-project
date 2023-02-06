import React from "@libs/react"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { FeeQuestionProps, IFeeData } from "../../../../models/type"
import FeeItemComponent from "./component"
import { stylizeNumber } from "../../../../util"

const FeeQuestionComponent: React.FC<FeeQuestionProps> = ({
  dealId,
	dealType,
  saveData: { updateFlag },
	Components,
	roles
}) => {
	const { Box, Button } = Ui
  const { useEffect, useState } = React
  const { submitted, setFeeData, feeData, roleData } = useApp()

	const [_feeData, _setFeeData] = useState<IFeeData[]>(feeData)

	useEffect(() => {
		updateFlag(true)
	}, [feeData])

	const handleClickRemoveFee = (index: number) => {
    let temp = JSON.parse(JSON.stringify(_feeData))
    temp.splice(index , 1)
		for (let i= 0; i < temp.length; i++) {
			temp[i].key_Index = i;
		}
		if(_setFeeData !== undefined) {
			_setFeeData(temp)
		}
  }

	const handleClickAddAnotherButton = () => {
    let emptyValue: IFeeData = {
      id: null,
      deal: dealId,
			deal_side: 0,
      fee_type: "",
      fee_amount: "",
      fee_amount_percentage: "",
			fee_from: 0,
			fee_paid: 1,
      fee_unit: 0,
      fee_method: 0,
	  	key_Index: feeData.length,
			agentName: ''
    }
    let updatedValue = JSON.parse(JSON.stringify(_feeData))
    updatedValue.push(emptyValue)
    if(_setFeeData != undefined){
      _setFeeData(updatedValue)
    }
  }

	const updateFeeData = (item: IFeeData, id: number) => {
		let updatedValue = JSON.parse(JSON.stringify((_feeData)))
		updatedValue[id] = item
		if(_setFeeData != undefined) {
			_setFeeData(updatedValue)
		}
	}

	useEffect(() => {
		let _feeItems: IFeeData[] = JSON.parse(JSON.stringify(feeData))
		roleData.map((item, id) => {
			let _feeItem: IFeeData = {
				id: id,
				deal: dealId,
				deal_side: 0,
				fee_type: '',
				fee_amount: item.share_value ? stylizeNumber(item.share_value) : '',
				fee_amount_percentage: item.share_percent? stylizeNumber(item.share_percent): '',
				fee_from: 0,
				fee_paid: 1,
				fee_unit: 0,
				fee_method: 0,
				key_Index: id,
				agentName: item.legal_full_name
			}
			_feeItems.push(_feeItem)
		})
		_setFeeData(_feeItems)
	}, [])

  return (
		<>
    {_feeData.map((item: IFeeData, id: number) => 
			<FeeItemComponent
				item={item}
				id={id}
				length={_feeData.length}
				handleClickRemoveFee={handleClickRemoveFee}
				updateData={updateFeeData}
				Components={Components}
				dealType={dealType}
			/>
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
