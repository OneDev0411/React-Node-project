import Ui from "@libs/material-ui"
import { FeeQuestionProps, IFeeData } from "../../../../models/type"
import FeeItemComponent from "./component"

const FeeQuestionComponent: React.FC<FeeQuestionProps> = ({
	dealType,
	Components,
	tempFeeData,
	handleClickRemoveFee,
	handleClickAddAnotherButton,
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
