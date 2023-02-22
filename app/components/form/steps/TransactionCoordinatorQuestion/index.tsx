import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IDealData, IFeeData, IQuestionProps, IRoleData, ITransData, SelectData } from "../../../../models/type";
import useApp from "../../../../hooks/useApp"
import { TextField } from '@material-ui/core';

const TransCoordinatorQuestion: React.FC<IQuestionProps> = ({
  Wizard: {QuestionSection, QuestionTitle, QuestionForm},
  hooks: {useWizardContext, useSectionContext},
  api: {updateDealContext, getDealContext},
  models: {deal}
}) => {
  const { useState, useEffect } = React
  const { RadioGroup, FormControlLabel, Radio, Box, Button } = Ui
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const {dealData, setDealData, currentStep, setCurrentStep, transCoordinator, setTransCoordinator, feeData, roleData} = useApp()

  const [curSelect, setCurSelect] = useState<string>(transCoordinator.trans_coordinator)

  const transSelectDataList: SelectData[] = [
    {
      label: "Yes",
      value: "Yes"
    },
    {
      label: "No",
      value: "No"
    }
  ];

  const handleClickRadioButton = async (event:any) => {
    setCurSelect(event.target.value)
    let updatedDealData: IDealData = JSON.parse(JSON.stringify(dealData))
    let updatedTransData: ITransData = JSON.parse(JSON.stringify(transCoordinator))
    updatedTransData.trans_coordinator = event.target.value
    setTimeout(() => {
      if (currentStep < step + 1) {
        if (event.target.value === "Yes") {
          updatedDealData.current_step = step + 1
          if (setDealData) setDealData(updatedDealData)
          if (setCurrentStep) setCurrentStep(step + 1)
          wizard.goto(step + 1)
          if (setTransCoordinator !== undefined) setTransCoordinator(updatedTransData)
        } else if (event.target.value === "No") {
          updatedDealData.current_step = step + 2
          if (setDealData) setDealData(updatedDealData)
          if (setCurrentStep) setCurrentStep(step + 2)
          updatedTransData.email_address = ""
          if (setTransCoordinator !== undefined) setTransCoordinator(updatedTransData)
          wizard.goto(step + 2)
        }
      }
    }, 80);
  }

  useEffect(() => {
    setCurSelect(transCoordinator.trans_coordinator)
  }, [transCoordinator])

  return (
    <QuestionSection>
      <QuestionTitle>
        Using DE In-house Transaction Coordinator?
      </QuestionTitle>
      <QuestionForm>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          value={curSelect}
          name="radio-buttons-group"
        >
          {transSelectDataList.map((data: SelectData, index: number) => 
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
      </QuestionForm>
    </QuestionSection>
  )
}

export default TransCoordinatorQuestion