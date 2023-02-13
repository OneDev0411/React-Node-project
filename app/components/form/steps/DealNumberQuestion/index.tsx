import React from '@libs/react'
import Ui from '@libs/material-ui'
import useApp from "../../../../hooks/useApp"
import { IQuestionProps } from "../../../../models/type"

const DealNumberQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext },
  utils: {isBackOffice}
}) => {
  const { useState, useEffect } = React
  const { Box, TextField, Grid, Button } = Ui
  const wizard = useWizardContext()
  const { currentStep, dealNumber, setDealNumber } = useApp()

  const [_dealNumber, _setDealNumber] = useState<string>('')
  const [errorFlag, setErrorFlag] = useState<boolean>(false)
  const [showButton, setShowButton] = useState<boolean>(true)
  const [helperText, setHelperText] = useState<string>('')

  const onChangeValue = (value: string) => {
    if (value.length > 25) {
      setErrorFlag(true)
      setHelperText('Max Length is 25')
      return;
    }
    setErrorFlag(false)
    setHelperText('')
    _setDealNumber(value)
    let _temp = dealNumber
    _temp.deal_number = value
    if (setDealNumber !== undefined) {
      setDealNumber(_temp)
    }
  }

  const handleClickNextButton = () => {
    if (isBackOffice) {
      if (_dealNumber.length == 0) {
        setErrorFlag(true)
        setHelperText('Please enter the Deal Number')
        return
      } else {
        wizard.goto(currentStep + 1)
        setShowButton(false)
      }
    } else {
      wizard.goto(currentStep + 1)
      setShowButton(false)
    }
  }

  useEffect(() => {
    let temp = dealNumber.deal_number
    if (temp.length == 0) {
      _setDealNumber('')
    } else {
      _setDealNumber(dealNumber.deal_number)
    }
  }, [dealNumber])

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
              style={{
                marginBottom: 20,
                backgroundColor: "#0fb78d",
                color: "white"
              }}
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
