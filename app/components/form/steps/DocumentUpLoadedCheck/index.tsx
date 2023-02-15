import React from '@libs/react'
import Ui from '@libs/material-ui'
import useApp from "../../../../hooks/useApp"
import { IDocStatus, IQuestionProps, SelectData } from "../../../../models/type"
import { financeSelectDataList } from '../../../../util'

const DocumentUpLoadedCheck: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  api: { updateDealContext, getDealContext },
  models: {deal}
}) => {
  const { useState, useEffect } = React
  const { Radio, Grid, Button, Box } = Ui
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { dealData, setDealData, setFinancing, setCurrentStep, docStatus, setDocStatus } = useApp()

  const [ referralCheck, setReferralCheck ] = useState<number>(0)
  const [ brokerageForm, setBrokerageForm ] = useState<number>(0)
  const [ showButton, setShowButton ] = useState<boolean>(true)

  const handleChangeValue = (
    e: React.ChangeEvent<{ value: unknown }>,
    key: string,
  ) => {
    let value = Number(e.target.value)
    if (key === "referral_doc") {
      setReferralCheck(value)
    }
    if (key === "brokerage_doc") {
      setBrokerageForm(value)
    }
  }

  const handleClickNextButton = () => {
    let _tempStatus: IDocStatus = JSON.parse(JSON.stringify(docStatus))
    _tempStatus.deal = deal.id
    _tempStatus.referral_doc = referralCheck
    _tempStatus.brokerage_form = brokerageForm
    if (setDocStatus !== undefined) {
      setDocStatus(_tempStatus)
    }
    wizard.next()
    setShowButton(false)
  }

  useEffect(() => {
    setReferralCheck(docStatus.referral_doc)
    setBrokerageForm(docStatus.brokerage_form)
  }, [docStatus])

  // state
  return (
    <QuestionSection>
      <QuestionTitle>
        Have you uploaded the following documents?
      </QuestionTitle>
      <QuestionForm>
        <Grid container spacing={2} style={{ marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={5}>
            <label>Have Referral Agreement</label>
          </Grid>
          <Grid item xs={3} style={{display: 'inherit', justifyContent: 'center', alignItems: 'center'}}>
            <Radio
              checked={referralCheck == 1}
              value={1}
              name="radio-buttons"
              size='small'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleChangeValue(e, "referral_doc")
              }
            />
            Yes
          </Grid>
          <Grid item xs={3} style={{display: 'inherit', justifyContent: 'center', alignItems: 'center'}}>
            <Radio
              checked={referralCheck == 0}
              value={0}
              name="radio-buttons"
              size='small'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleChangeValue(e, "referral_doc")
              }
            />
            No
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={5}>
            <label>Brokerage's W-9 form</label>
          </Grid>
          <Grid item xs={3} style={{display: 'inherit', justifyContent: 'center', alignItems: 'center'}}>
            <Radio
              checked={brokerageForm == 1}
              value={1}
              name="radio-buttons"
              size='small'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleChangeValue(e, "brokerage_doc")
              }
            />
            Yes
          </Grid>
          <Grid item xs={3} style={{display: 'inherit', justifyContent: 'center', alignItems: 'center'}}>
            <Radio
              checked={brokerageForm == 0}
              value={0}
              name="radio-buttons"
              size='small'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleChangeValue(e, "brokerage_doc")
              }
            />
            No
          </Grid>
        </Grid>
        {showButton && (
          <Box
            style={{
              textAlign: 'right',
              marginTop: '20px',
              paddingBottom: '20px'
            }}
          >
            <Button
              variant='contained'
              onClick={handleClickNextButton}
              style={{
                marginBottom: 20,
                backgroundColor: '#0fb78d',
                color: 'white'
              }}
            >
              Looks Good
            </Button>
          </Box>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

export default DocumentUpLoadedCheck
