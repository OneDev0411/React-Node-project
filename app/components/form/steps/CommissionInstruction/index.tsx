import React from '@libs/react'
import Ui from '@libs/material-ui'
import useApp from "../../../../hooks/useApp"
import { INoteData, IQuestionProps } from "../../../../models/type"

const CommissionInstruction: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  models: {deal}
}) => {
  const { useState, useEffect } = React
  const { Box, TextField, Grid, Button } = Ui
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const {notes, setNotes, dealData, setDealData, currentStep, setCurrentStep} = useApp()

  const [addNote, setAddNote] = useState<string>('')
  const [showButton, setShowButton] = useState<boolean>(false)

  const onChangeValue = (value: string) => {
    setShowButton(true)
    setAddNote(value)
  }

  const handleClickNextButton = () => {
    setShowButton(false)
    let tempNoteData: INoteData = JSON.parse(JSON.stringify(notes))
    tempNoteData.deal = deal.id
    tempNoteData.note = addNote
    if (setNotes !== undefined) {
      setNotes(tempNoteData)
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

  useEffect(() => {
    setAddNote(notes.note)
  }, [notes])


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
            style={addNote?.length ? { marginBottom: 20, backgroundColor: "#0fb78d", color: "white" } : {}}
            disabled={!addNote?.length}
          >
            Looks Good, Next
          </Button>
        </Box>)}
      </QuestionForm>
    </QuestionSection>
  )
}

export default CommissionInstruction
