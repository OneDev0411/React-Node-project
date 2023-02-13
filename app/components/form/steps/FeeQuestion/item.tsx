import React from "@libs/react"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { FeeQuestionProps, IFeeData, IRoleData } from "../../../../models/type"
import FeeItemComponent from "./component"
import { stylizeNumber } from "../../../../util"

const FeeQuestionComponent: React.FC<FeeQuestionProps> = ({
	dealType,
  saveData: { updateFlag },
	Components,
	tempFeeData,
	handleClickRemoveFee,
	handleClickAddAnotherButton,
	updateFeeData
}) => {
	const { Box, Button } = Ui
  const { useEffect } = React
  const { feeData } = useApp()

	useEffect(() => {
		updateFlag(true)
	}, [feeData])

  return (
		<>
    {tempFeeData.map((item: IFeeData, id: number) => 
			<FeeItemComponent
				item={item}
				id={id}
				length={tempFeeData.length}
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
