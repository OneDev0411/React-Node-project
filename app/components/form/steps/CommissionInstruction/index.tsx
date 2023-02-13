import React from '@libs/react'
import Ui from '@libs/material-ui'
import useApp from "../../../../hooks/useApp"
import { IQuestionProps } from "../../../../models/type"

const CommissionInstruction: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext }}) => {
  const { useState } = React
  const { Box, TextField, Grid, Button } = Ui
  const wizard = useWizardContext()

  const [addNote, setAddNote] = useState<string>('')
  const [showButton, setShowButton] = useState<boolean>(true)

  const onChangeValue = (value: string) => {
    setAddNote(value)
  }

  const handleClickNextButton = () => {
    wizard.goto(11)
    setShowButton(false)
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        Commission Instruction
      </QuestionTitle>
      <QuestionForm>
        <Box>
          <Grid container>
            <Grid item xs={2}>
              <label>Note: </label>
            </Grid>
            <Grid item xs={10}>
              <TextField 
                variant='standard'
                type="text"
                value={addNote}
                multiline={true}
                style={{width: '95%'}}
                onChange={(e) => onChangeValue(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
        {showButton && (<Box style={{ textAlign: 'right', marginTop: 10 }}>
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
        </Box>)}
      </QuestionForm>
    </QuestionSection>
  )
}

export default CommissionInstruction
