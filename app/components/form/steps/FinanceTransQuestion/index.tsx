import React from '@libs/react'
import Ui from '@libs/material-ui'
import useApp from "../../../../hooks/useApp"
import { IDealData, IQuestionProps, SelectData } from "../../../../models/type"
import { financeSelectDataList } from '../../../../util'

const FinanceTransQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  api: { updateDealContext, getDealContext },
}) => {
  const { useState } = React
  const { RadioGroup, FormControlLabel, Radio, Box } = Ui
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { dealData, setDealData, setFinancing, setCurrentStep } = useApp()

  const financingContextValue = getDealContext('financing')?.text

  // state
  const [curSelect, setCurSelect] = useState<string>(financingContextValue)
  const [showBox, setShowBox] = useState<boolean>(true)

  const handleClickRadioButton = async (event: any) => {
    setShowBox(false)
    updateDealContext("financing", event.target.value)
    setCurSelect(event.target.value)
    if (setFinancing) setFinancing(event.target.value)
    let updatedDealData: IDealData = dealData
    setTimeout(() => {
      if (event.target.value === "Cash Deal") {
        wizard.goto(step + 2)
        updatedDealData.current_step = step + 2
        if (setDealData) setDealData(updatedDealData)
        updateDealContext("financing_program", "")
        if (setCurrentStep) setCurrentStep(step + 2)
      } else if (event.target.value === "Mortgage") {
        wizard.goto(step + 1)
        updatedDealData.current_step = step + 1
        if (setDealData) setDealData(updatedDealData)
        if (setCurrentStep) setCurrentStep(step + 1)
      }
    }, 80);
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        How is this transaction being financed?
      </QuestionTitle>
      <QuestionForm>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={curSelect}
          name="radio-buttons-group"
        >
          {financeSelectDataList.map((data: SelectData, index: number) => 
            <FormControlLabel 
              style={{ border: '1px solid #bfbfbf', borderRadius: 5 }} 
              onClick={handleClickRadioButton} 
              value={data.value} 
              control={<Radio />} 
              label={data.label} 
              key={index}
            />
          )}
        </RadioGroup>
        {showBox && (
          <Box style={{ height: 40 }} />
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

export default FinanceTransQuestion
