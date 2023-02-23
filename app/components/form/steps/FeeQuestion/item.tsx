import Ui from "@libs/material-ui"
import { FeeQuestionProps, IFeeData } from "../../../../models/type"
import FeeItemComponent from "./component"

const FeeQuestionComponent: React.FC<FeeQuestionProps> = ({
	dealType,
	Components,
	tempFeeData,
	handleClickRemoveFee,
	updateFeeData
}) => {
	const { Box, Button } = Ui

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
		</>
  )
}

export default FeeQuestionComponent
