import React from "@libs/react"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { IQuestionProps, IFeeData, IRoleData } from "../../../../models/type"
import FeeQuestionComponent from "./item"
import { stylizeNumber } from "../../../../util"

const FeeQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  models: { deal },
  Components
}) => {
  const { useState, useEffect } = React
  const { Box, Button } = Ui
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { dealData, setDealData, currentStep, setCurrentStep, setFeeData, roleData } = useApp()

  const [showButton, setShowButton] = useState<boolean>(false)
	const [_tempFeeData, _setTempFeeData] = useState<IFeeData[]>([])

	const _feeAgents = roleData.filter((item: IRoleData) => item.role === "SellerAgent" || item.role === "CoSellerAgent" || item.role === "SellerReferral" || item.role === "BuyerAgent" || item.role === "CoBuyerAgent" || item.role === "BuyerReferral")

  useEffect(() => {
    let tempFeeData: IFeeData[] = JSON.parse(JSON.stringify(_tempFeeData))
		_feeAgents.map((item, id) => {
			let feeItem: IFeeData = {
				id: null,
				deal: deal.id,
				deal_side: 0,
				fee_type: '',
				fee_amount: item.share_value ? stylizeNumber(item.share_value) : '',
				fee_amount_percentage: item.share_percent? stylizeNumber(item.share_percent): '',
				fee_from: 0,
				fee_paid: 1,
				fee_unit: item.share_percent ? 0 : 1,
				fee_method: 0,
				key_Index: id,
				agent_name: item.legal_full_name
			}
			tempFeeData.push(feeItem)
		})
		if (setFeeData != undefined) {
			setFeeData(tempFeeData)
		}
		_setTempFeeData(tempFeeData)
  }, [])

  const handleClickNextButton = () => {
    setShowButton(false)
    if (setFeeData !== undefined) {
      setFeeData(_tempFeeData)
    }
    setTimeout(() => {
      if (currentStep < step + 1) {
        wizard.goto(step + 1)
        let temp = JSON.parse(JSON.stringify(dealData))
        temp.current_step = step + 1
        if (setDealData !== undefined)
          setDealData(temp)
        if (setCurrentStep !== undefined) {
          setCurrentStep(step+1)
        }
      }
    }, 80)
  }

  const handleClickRemoveFee = (index: number) => {
    setShowButton(true)
    let temp: IFeeData[] = JSON.parse(JSON.stringify(_tempFeeData))
    temp.splice(index , 1)
		for (let i= 0; i < temp.length; i++) {
			temp[i].key_Index = i;
		}
		_setTempFeeData(temp)
    if (setFeeData !== undefined)
      setFeeData(temp)
  }

  const handleClickAddAnotherButton = () => {
    setShowButton(true)
    let emptyValue: IFeeData = {
      id: null,
      deal: deal.id,
			deal_side: 0,
      fee_type: "",
      fee_amount: "",
      fee_amount_percentage: "",
			fee_from: 0,
			fee_paid: 1,
      fee_unit: 0,
      fee_method: 0,
	  	key_Index: _tempFeeData.length,
			agent_name: ''
    }
    let updatedValue = JSON.parse(JSON.stringify(_tempFeeData))
    updatedValue.push(emptyValue)
		_setTempFeeData(updatedValue)
    if (setFeeData !== undefined) {
      setFeeData(updatedValue)
    }
  }

  const updateFeeData = (item: IFeeData, id: number) => {
    setShowButton(true)
		let updatedValue = JSON.parse(JSON.stringify(_tempFeeData))
		updatedValue[id] = item
		_setTempFeeData(updatedValue)
	}

  useEffect(() => {
    setTimeout(() => {
      if (currentStep < step + 1)
        setShowButton(true)
      else
        setShowButton(false)
    }, 80);
  }, [])

  return (
    <QuestionSection>
      <QuestionTitle>
        Please input Fee info.
      </QuestionTitle>
      <QuestionForm width="60%">
        <FeeQuestionComponent
          dealType={deal.deal_type}
          Components={Components}
          tempFeeData={_tempFeeData}
          handleClickRemoveFee={handleClickRemoveFee}
          handleClickAddAnotherButton={handleClickAddAnotherButton}
          updateFeeData={updateFeeData}
        />
        {showButton && (
          <Box
            style={{
              textAlign: "right",
              marginTop: "20px",
              paddingBottom: "20px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleClickNextButton}
              style={{
                marginBottom: 20,
                backgroundColor: "#0fb78d",
                color: "white",
              }}
            >
              Looks good, Next
            </Button>
          </Box>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

export default FeeQuestion
