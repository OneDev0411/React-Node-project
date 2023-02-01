import React from "@libs/react"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { FeeQuestionProps, IFeeData } from "../../../../models/type"
import FeeItemComponent from "./component"

const FeeQuestionComponent: React.FC<FeeQuestionProps> = ({
  deal,
  saveData: { updateFlag }
}) => {
	const { Box, Button } = Ui
  const { useEffect } = React
  const { submitted, setFeeData, feeData } = useApp()

	useEffect(() => {
		updateFlag(true)
	}, [feeData])

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

	const handleClickAddAnotherButton = () => {
    let emptyValue: IFeeData = {
      id: null,
      deal: deal,
			deal_side: 0,
      fee_type: "",
      fee_amount: "",
      fee_amount_percentage: "",
			fee_from: 0,
			fee_paid: 1,
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

	const updateFeeData = (item: IFeeData, id: number) => {
		let updatedValue = JSON.parse(JSON.stringify((feeData)))
		updatedValue[id] = item
		if(setFeeData != undefined) {
			setFeeData(updatedValue)
		}
	}

  return (
		<>
    {feeData.map((item: IFeeData, id: number) => 
			<FeeItemComponent
				item={item}
				id={id}
				length={feeData.length}
				handleClickRemoveFee={handleClickRemoveFee}
				updateData={updateFeeData}
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
