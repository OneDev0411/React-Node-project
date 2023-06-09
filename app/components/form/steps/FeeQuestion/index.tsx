import React from "@libs/react"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { IQuestionProps, IFeeData, IRoleData, ICreditData } from "../../../../models/type"
import FeeQuestionComponent from "./item"

const FeeQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  models: { deal, roles },
  Components,
  isNevada
}) => {
  const { useState, useEffect } = React
  const { Box, Button } = Ui
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { dealData, setDealData, currentStep, setCurrentStep, feeData, setFeeData, roleData, creditData } = useApp()

  const [showButton, setShowButton] = useState<boolean>(false)
	const [_tempFeeData, _setTempFeeData] = useState<IFeeData[]>([])
  const [_creditFee, _setCreditFee] = useState<IFeeData[]>([])

  const enderType = deal.context.ender_type?.text;
  const dealType = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? "Both" : deal.deal_type;

	const _feeAgents = roles.filter((item: IDealRole) => item.role === "SellerAgent" || item.role === "CoSellerAgent" || item.role === "SellerReferral" || item.role === "BuyerAgent" || item.role === "CoBuyerAgent" || item.role === "BuyerReferral")

  useEffect(() => {
    let tempFeeData: IFeeData[] = JSON.parse(JSON.stringify(_tempFeeData))
    if (feeData[0].fee_amount_percentage === "" && feeData[0].fee_amount === "") {
      _feeAgents.map((item, id) => {
        if ((dealType === "Selling" || dealType === "Both") && (item.role === "SellerAgent" || item.role === "CoSellerAgent" || item.role === "SellerReferral")) {
          let feeItem: IFeeData = {
            id: null,
            deal: deal.id,
            deal_side: 1,
            fee_type: '',
            fee_amount: '0',
            fee_amount_percentage: '0',
            fee_from: 0,
            fee_paid: 1,
            fee_unit: item.commission_percentage ? 0 : 1,
            fee_method: 0,
            key_Index: id,
            agent_name: item.legal_full_name
          }
          tempFeeData.push(feeItem)
        } if ((dealType === "Buying" || dealType === "Both") && (item.role === "BuyerAgent" || item.role === "CoBuyerAgent" || item.role === "BuyerReferral")) {
          let feeItem: IFeeData = {
            id: null,
            deal: deal.id,
            deal_side: 0,
            fee_type: '',
            fee_amount: '0',
            fee_amount_percentage: '0',
            fee_from: 0,
            fee_paid: 1,
            fee_unit: item.commission_percentage ? 0 : 1,
            fee_method: 0,
            key_Index: id,
            agent_name: item.legal_full_name
          }
          tempFeeData.push(feeItem)
        }
      })
      if (setFeeData !== undefined)
        setFeeData(tempFeeData)
      _setTempFeeData(tempFeeData)
    } else {
      let _tempFees = feeData.filter((item) => !(item.fee_type === "Credit given by Agent (Seller)" || item.fee_type === "Credit given by Agent (Buyer)"))
      _setTempFeeData(_tempFees)
    }
  }, [])

  const handleClickNextButton = () => {
    setShowButton(false)
    let updateValue: IFeeData[] = _tempFeeData.concat(_creditFee)
    if (setFeeData !== undefined) {
      setFeeData(updateValue)
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

  const handleClickRemoveCreditFee = (index: number) => {
    setShowButton(true)
    let temp: IFeeData[] = JSON.parse(JSON.stringify(_creditFee))
    temp.splice(index , 1)
		for (let i= 0; i < temp.length; i++) {
			temp[i].key_Index = i;
		}
		_setCreditFee(temp)
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
      fee_amount: "0",
      fee_amount_percentage: "0",
			fee_from: 0,
			fee_paid: 1,
      fee_unit: 0,
      fee_method: 0,
	  	key_Index: _tempFeeData.length,
			agent_name: ''
    }
    let updatedBaseFee = JSON.parse(JSON.stringify(_tempFeeData))
    updatedBaseFee.push(emptyValue)
		_setTempFeeData(updatedBaseFee)
    let updatedValue = updatedBaseFee.concat(_creditFee)
    if (setFeeData !== undefined) {
      setFeeData(updatedValue)
    }
  }

  const updateBaseFeeData = (item: IFeeData, id: number) => {
    setShowButton(true)
		let updatedValue = JSON.parse(JSON.stringify(_tempFeeData))
		updatedValue[id] = item
		_setTempFeeData(updatedValue)
	}

  const updateCreditFeeData = (item: IFeeData, id: number) => {
    setShowButton(true)
		let updatedValue = JSON.parse(JSON.stringify(_creditFee))
		updatedValue[id] = item
		_setCreditFee(updatedValue)
	}

  useEffect(() => {
    setTimeout(() => {
      if (currentStep < step + 1)
        setShowButton(true)
      else
        setShowButton(false)
    }, 80);
  }, [])

  useEffect(() => {
    if (isNevada && creditData) {
      let _emptyCreditFee: IFeeData[] = JSON.parse(JSON.stringify(_creditFee))
      let _creditFees = feeData.filter((item) => item.fee_type === "Credit given by Agent (Buyer)" || item.fee_type === "Credit given by Agent (Seller)")
      if (_creditFees.length == 0) {
        creditData.forEach((item: ICreditData) => {
          if (item.credit_side === "Seller") {
            let _feeItem: IFeeData = {
              id: null,
              deal: deal.id,
              deal_side: 1,
              fee_type: "Credit given by Agent (Seller)",
              fee_amount: item.credit_amount ? item.credit_amount : "0",
              fee_amount_percentage: "0",
              fee_from: 0,
              fee_paid: 1,
              fee_unit: 1,
              fee_method: 0,
              agent_name: _feeAgents[0].legal_full_name,
              key_Index: _creditFee.length
            }
            _emptyCreditFee.push(_feeItem)
          } else if (item.credit_side === "Buyer") {
            let _feeItem: IFeeData = {
              id: null,
              deal: deal.id,
              deal_side: 0,
              fee_type: "Credit given by Agent (Buyer)",
              fee_amount: item.credit_amount ? item.credit_amount : "0",
              fee_amount_percentage: "0",
              fee_from: 0,
              fee_paid: 1,
              fee_unit: 1,
              fee_method: 0,
              agent_name: _feeAgents[0].legal_full_name,
              key_Index: _creditFee.length
            }
            _emptyCreditFee.push(_feeItem)
          }
        })
        _setCreditFee(_emptyCreditFee)
      } else {
        _creditFees.forEach((item: IFeeData, index: number) => {
          if (creditData[index] && creditData[index].deal !== "") {
            item.fee_amount = creditData[index].credit_amount === "" ? "0" : creditData[index].credit_amount
          }
        })
        _setCreditFee(_creditFees)
      }
    }
  }, [creditData])

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
          updateFeeData={updateBaseFeeData}
        />
        {isNevada && 
          <FeeQuestionComponent
            dealType={deal.deal_type}
            Components={Components}
            tempFeeData={_creditFee}
            handleClickRemoveFee={handleClickRemoveCreditFee}
            updateFeeData={updateCreditFeeData}
          />
        }
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
