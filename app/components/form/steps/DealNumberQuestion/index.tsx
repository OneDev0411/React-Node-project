import React from '@libs/react'
import Ui from '@libs/material-ui'
import useApp from "../../../../hooks/useApp"
import { IQuestionProps } from "../../../../models/type"

const DealNumberQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  utils: {isBackOffice},
  models: { deal },
  api: {getDealContext, updateDealContext}
}) => {
  const { useState, useEffect } = React
  const { Box, TextField, Grid, Button } = Ui
  const wizard = useWizardContext()
  const { currentStep, setCurrentStep, dealNumber, setDealNumber, dealData, setDealData } = useApp()

  const {step} = useSectionContext()

  const [_dealNumber, _setDealNumber] = useState<string>('')
  const [errorFlag, setErrorFlag] = useState<boolean>(false)
  const [showButton, setShowButton] = useState<boolean>(true)
  const [helperText, setHelperText] = useState<string>('')

  const _dealNumberFromContext = getDealContext("deal_number")?.text

  const onChangeValue = (value: string) => {
    setShowButton(true)
    if (value.length > 25) {
      setErrorFlag(true)
      setHelperText('Max Length is 25')
      return;
    }
    setErrorFlag(false)
    setHelperText('')
    _setDealNumber(value)
  }

  const handleClickNextButton = () => {
    if (_dealNumber.length == 0) {
      setErrorFlag(true)
      setHelperText('Please enter the Deal Number')
      return
    } else {
      updateDealContext("deal_number", _dealNumber)
      setShowButton(false)
      let _tempDealNumber = dealNumber
      _tempDealNumber.deal_number = _dealNumber
      _tempDealNumber.deal = deal.id
      if (setDealNumber !== undefined) {
        setDealNumber(_tempDealNumber)
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
  }

  useEffect(() => {
    if (_dealNumberFromContext) {
      _setDealNumber(_dealNumberFromContext)
    } else if (dealNumber.deal_number.length == 0) {
      _setDealNumber('')
    } else {
      setShowButton(false)
      _setDealNumber(dealNumber.deal_number)
    }
  }, [dealNumber])

  useEffect(() => {
    if (currentStep > step)
      wizard.goto(step + 1)
    else
      setShowButton(true)
  }, [])

  return (
    <QuestionSection>
      <QuestionTitle>
        Please Input the Deal Number.
      </QuestionTitle>
      <QuestionForm>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <label>Deal Number</label>
            </Grid>
            <Grid item xs={8}>
              {isBackOffice ? (
                <TextField 
                  variant='standard'
                  type="number"
                  style={{ color: "inherit", width: "95%" }}
                  value={_dealNumber}
                  multiline={true}
                  onChange={(e) => onChangeValue(e.target.value)}
                  error={errorFlag}
                  helperText={helperText}
                />
              ) : (
                <label>{_dealNumber}</label>
              )}
            </Grid>
          </Grid>
        </Box>
        {showButton && (
          <Box style={{ textAlign: "right", marginTop: 10 }}>
            <Button
              variant="contained"
              onClick={handleClickNextButton}
              style={_dealNumber?.length ? {marginBottom: 20, backgroundColor: "#0fb78d", color: "white"} : {}}
              disabled={!_dealNumber?.length}
            >
              Looks Good, Next
            </Button>
          </Box>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

export default DealNumberQuestion
