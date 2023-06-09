import React from "@libs/react"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { AppContextApi, IQuestionProps, IDealData, INoteData } from "../../../../models/type"
import { APP_URL } from "../../../../util"
import axios from "axios"

const LastQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  utils,
  api: { notifyOffice, close },
  hooks: { useWizardContext },
  models: { deal },
  isFlorida,
  isNevada
}) => {
  const { useState } = React
  const { QuestionSection, QuestionTitle, QuestionForm } = Wizard
  const isBackOffice = utils.isBackOffice
  const { Box, Button, Dialog, DialogTitle, DialogActions } = Ui
  const total_data: AppContextApi = useApp()
  const { dealData, submitted, setSubmitted, notes, setNotes, transCoordinator, setTransCoordinator } = useApp()
  const wizard = useWizardContext()
  const [feedback, setFeedback] = useState<string>("")
  const [openFeedback, setOpenFeedback] = useState<boolean>(false)
  
  const handleSubmit = async () => {
    wizard.setLoading(true)
    if (!isBackOffice)
      notifyOffice(true, "Please review the Commission Slip")
    if (notes.deal === "") {
      let tempNotesData: INoteData = JSON.parse(JSON.stringify(notes))
      tempNotesData.deal = deal.id
      if (setNotes !== undefined) {
        setNotes(tempNotesData)
      }
    }
    if (transCoordinator.deal === "") {
      let tmpTransCoordinator = transCoordinator
      tmpTransCoordinator.deal = deal.id
      if (setTransCoordinator) {
        setTransCoordinator(tmpTransCoordinator)
      }
    }
    const res = await axios.post(
      `${APP_URL}/rechat-commission-app-data-save`,
      {
        data: total_data,
      }
    )
    if (isFlorida || (isNevada && isBackOffice)) {
      utils.isReview = true
    } else {
      if (submitted === 2 && !isBackOffice) {
        let postData: IDealData = { ...dealData }
        postData.approval_request_date = ""
        postData.status = ""
        await axios.post(
          `${APP_URL}/rechat-commission-app-approve`,
          {
            data: postData,
          }
        )
      } else if (submitted === 2 && isBackOffice) {
        utils.isReview = true
      }
    }
    if (setSubmitted !== undefined)
      setSubmitted(1)
    wizard.setLoading(false)
    if (!isBackOffice) {
      if (res.data.message === "successful")
      setFeedback("Successfully submitted.")
      else {
        setFeedback("Submit failed.")
        if (setSubmitted !== undefined)
          setSubmitted(-1)
      }
      setOpenFeedback(true)
    }
  }

  const handleClose = () => {
    setOpenFeedback(false)
    close()
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        {submitted !== 1 ? <>Awesome! Let's submit this for the review, and get you paid!</> : <>Awesome! Submitted!</>}
      </QuestionTitle>
      <QuestionForm>
        {(submitted === -1 && !isBackOffice ) && 
          <Box style={{ textAlign: "right" }}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              style={{
                marginBottom: 20,
                backgroundColor: "#0fb78d",
                color: "white",
              }}
            >
              Submit for Review
            </Button>
          </Box>
        }
        {(submitted === 2 && !isBackOffice) && 
          (
            <Box style={{ textAlign: "right" }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                style={{
                  marginBottom: 20,
                  backgroundColor: "#0fb78d",
                  color: "white",
                }}
              >
                Submit again for Review
              </Button>
            </Box>
          )
        }
        {isBackOffice && 
          (
            <Box style={{ textAlign: "right" }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                style={{
                  marginBottom: 20,
                  backgroundColor: "#0fb78d",
                  color: "white",
                }}
              >
                Review
              </Button>
            </Box>
          )
        }
      </QuestionForm>
      <Dialog open={openFeedback} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{feedback}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </QuestionSection>
  )
}

export default LastQuestion
