import Ui from "@libs/material-ui"
import React from "@libs/react"
import { FeeQuestionProps, IFeeData } from "../../../../models/type"
import FeeItemComponent from "./component"

const FeeQuestionComponent: React.FC<FeeQuestionProps> = ({
	dealType,
	Components,
	tempFeeData,
	handleClickRemoveFee,
	updateFeeData
}) => {
	const { useState, useEffect } = React
	const { Box, Button } = Ui

	const [_tempFeeData, _setTempFeeData] = useState<IFeeData[]>(tempFeeData)

	useEffect(() => {
		_setTempFeeData(tempFeeData)
	}, [tempFeeData])

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
