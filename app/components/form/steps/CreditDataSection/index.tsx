import React from "@libs/react"
import useApp from "../../../../hooks/useApp";
import { ICreditData, IQuestionProps } from "../../../../models/type";
import Ui from "@libs/material-ui"
import CreditItemComponent from "./component";

const CreditQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  utils,
  models,
  api: {getDealContext, updateDealContext},
  hooks: {useWizardContext, useSectionContext},
  isNevada,
  isFlorida,
  isNYC
}) => {
  const {useState, useEffect} = React
  const { QuestionSection, QuestionTitle, QuestionForm } = Wizard
  const { deal, roles } = models
  const wizard = useWizardContext()
  const { dealData, setDealData, currentStep, setCurrentStep, creditData, setCreditData } = useApp()
  const { Box, Button } = Ui
  const { step } = useSectionContext()

  const [showButton, setShowButton] = useState<boolean>(false)
  const [sellerCredits, setSellerCredits] = useState<ICreditData[]>([])
  const [buyerCredits, setBuyerCredits] = useState<ICreditData[]>([])


  const enderType = deal.context.ender_type?.text
  const dealType = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? "Both" : deal.deal_type

  const handleClickNextButton = async () => {
    setShowButton(false)
    setTimeout(() => {
      if (currentStep < step + 1) {
        wizard.goto(step + 1)
        let temp = JSON.parse(JSON.stringify(dealData))
        temp.current_step = step + 1
        if (setDealData) setDealData(temp)
        if (setCurrentStep) setCurrentStep(step + 1)
      }
    }, 80);
  }

  const updateCredit = (item: ICreditData, index: number) => {
    let temp: ICreditData[] = JSON.parse(JSON.stringify(creditData))
    temp[index].credit_amount = item.credit_amount
    temp[index].credit_side = item.credit_side
    temp[index].credit_to = item.credit_to
    temp[index].deal = deal.id
    if (setCreditData) setCreditData(temp)
  }

  useEffect(() => {
    setTimeout(() => {
      setShowButton(true)
    }, 80);
  }, [])

  useEffect(() => {
    let _sellerCredits = creditData.filter((credit) => credit.credit_side === "Seller")
    let _buyerCredits = creditData.filter((credit) => credit.credit_side === "Buyer")
    setSellerCredits(_sellerCredits)
    setBuyerCredits(_buyerCredits)
  }, [creditData])

  useEffect(() => {
    setTimeout(() => {
      if (currentStep > step)
        setShowButton(false)
      else
        setShowButton(true)
    }, 80);
  }, [])

  return (
    <QuestionSection>
      <QuestionTitle>
        Please Input the Credit
      </QuestionTitle>
      <QuestionForm width="60%">
        {(dealType === "Selling" || dealType === "Both") && sellerCredits.length > 0 &&
          <Box
            style={{
              marginBottom: 20,
              padding: 15,
              paddingTop: 15,
              paddingRight: 10,
              display: 'inline-block',
              position: 'relative', 
              border: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: 4,
              width: '100%'
            }}
          >
            {sellerCredits.map((item: ICreditData, index: number) => 
              <CreditItemComponent 
                credits={item}
                index={index}
                updateCredit={updateCredit}
                setShowButton={setShowButton}
              />
            )}
          </Box>
        }
        {(dealType === "Buying" || dealType ==="Both") && buyerCredits.length > 0 &&
          <Box
            style={{
              marginBottom: 20,
              padding: 15,
              paddingTop: 15,
              paddingRight: 10,
              display: 'inline-block',
              position: 'relative', 
              border: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: 4,
              width: '100%'
            }}
          >
            {buyerCredits.map((item: ICreditData, index: number) => 
              <CreditItemComponent 
                credits={item}
                index={index}
                updateCredit={updateCredit}
                setShowButton={setShowButton}
              />
            )}
          </Box>
        }
        {showButton && (
          <Box style={{ textAlign: "right", marginTop: 10 }}>
            <Button
              variant="contained"
              onClick={handleClickNextButton}
              style={{
                marginBottom: 20,
                backgroundColor: "#0fb78d",
                color: "white"
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

export default CreditQuestion