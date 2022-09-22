import React from "@libs/react";
import Ui from "@libs/material-ui";
import { AppContextApi, IQuestionProps } from "../../../../models/type";
import { APP_URL } from "../../../../util";
import useApp from "../../../../hooks/useApp";
import axios from "axios";

const LastQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  api: { notifyOffice },
  hooks: { useWizardContext },
}) => {
  const { QuestionSection, QuestionTitle, QuestionForm } = Wizard;
  const { Box, Button, Dialog, DialogTitle, DialogActions } = Ui;
  const total_data: AppContextApi = useApp();
  const { submitted, setSubmitted } = useApp();
  const wizard = useWizardContext();
  const [feedback, setFeedback] = React.useState<string>("");
  const [openFeedback, setOpenFeedback] = React.useState<boolean>(false);
  
  const handleSubmit = async () => {
    wizard.setLoading(true);
    notifyOffice(true, "Please review the Commission Slip");
    const res = await axios.post(
      `${APP_URL}/rechat-commission-app-data-save`,
      {
        data: total_data,
      }
    );
    if (setSubmitted !== undefined)
      setSubmitted(1);
    wizard.setLoading(false);
    if (res.data.message === "successful")
      setFeedback("Successfully submitted.");
    else {
      setFeedback("Submit failed.");
      if (setSubmitted !== undefined)
        setSubmitted(-1);
    }
    setOpenFeedback(true);
  };

  const handleClose = async () => {
    setOpenFeedback(false);
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        {submitted === -1 ? <>Awesome! Let's submit this for the review, and get you paid!</> : <>Awesome! Submitted!</>}
      </QuestionTitle>
      {submitted === -1 && <QuestionForm>
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
      </QuestionForm>}
      <Dialog open={openFeedback} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{feedback}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </QuestionSection>
  );
};

export default LastQuestion;
