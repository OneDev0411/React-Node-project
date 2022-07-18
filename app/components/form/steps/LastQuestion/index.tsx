import React from "@libs/react";
import Ui from "@libs/material-ui";
import { AppContextApi, IQuestionProps } from "../../../../models/type";
import useApp from "../../../../hooks/useApp";
import axios from "axios";

const LastQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  utils: { notifyOffice },
}) => {
  const { QuestionSection, QuestionTitle, QuestionForm } = Wizard;
  const { Box, Button } = Ui;
  const total_data: AppContextApi = useApp();
  console.log("total_data", total_data);
  const handleSubmit = async () => {
    notifyOffice("Please review the Commission Slip");
    let res = await axios.post(
      "http://localhost:8081/rechat-commission-app-data-save",
      {
        data: total_data,
      }
    );
  };

  return (
    <QuestionSection>
      <QuestionTitle>
        Awesome! Let's submit this for the review, and get you paid!
      </QuestionTitle>
      <QuestionForm>
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
      </QuestionForm>
    </QuestionSection>
  );
};

export default LastQuestion;
