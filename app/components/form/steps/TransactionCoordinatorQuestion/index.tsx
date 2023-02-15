import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IFeeData, IQuestionProps, IRoleData, SelectData } from "../../../../models/type";
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
  const {currentStep, transCoordinator, setTransCoordinator, feeData, roleData} = useApp()

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
    let _defaultTransData = JSON.parse(JSON.stringify(transCoordinator))
    _defaultTransData.trans_coordinator = event.target.value
    // if (setFinancing !== undefined)
    //   setFinancing(event.target.value)
    if (event.target.value === "Yes") {
      if (setTransCoordinator !== undefined) {
        setTransCoordinator(_defaultTransData)
      }
      wizard.goto(step + 2)
    } else {
      _defaultTransData.email_address = ""
      if (setTransCoordinator !== undefined) {
        setTransCoordinator(_defaultTransData)
      }
      wizard.next()
    }
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