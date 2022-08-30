import React from "@libs/react";
import Ui from "@libs/material-ui";
import { IDealData, IQuestionProps, IRemittanceChecks, IRoleData } from "../../../../models/type";
import { paymentTypeData, stylizeNumber, APP_URL } from "../../../../util";
import useApp from "../../../../hooks/useApp";
import PaidByInfoCard from "./PaidByInfoCard";
import axios from "axios";

const ReviewQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  models: { deal, roles },
  api: { getDealContext, updateTaskStatus },
  hooks: { useWizardContext },
}) => {
  const { QuestionSection, QuestionTitle } = Wizard;
  const { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Grid } = Ui;
  const { dealData, roleData, remittanceChecks } = useApp();
  const wizard = useWizardContext();
  const enderType = deal.context.ender_type?.text;
  const dealType = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? "Both" : deal.deal_type;

  const sellerInfo = roles.filter((role: IDealRole) => role.role === "Seller")[0];
  const sellerLawyerInfo = roles.filter((role: IDealRole) => role.role === "SellerLawyer")[0];
  const buyerInfo = roles.filter((role: IDealRole) => role.role === "Buyer")[0];
  const buyerLawyerInfo = roles.filter((role: IDealRole) => role.role === "BuyerLawyer")[0];

  const salesPrice = getDealContext("sales_price")?.number;
  const financing = getDealContext("financing")?.text;
  const financingProgram = getDealContext("financing_program")?.text;

  const [openDeclineMsg, setOpenDeclineMsg] = React.useState<boolean>(false);
  const [declineMsg, setDeclineMsg] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string>("");
  const [openFeedback, setOpenFeedback] = React.useState<boolean>(false);

  const gciDeValue = dealData.gci_calculate_type == 0 ? (dealData.gci_de_value / salesPrice * 100) : (dealData.gci_de_value);
  const showCompanyInfo = 
    (paymentTypeData[1].member.indexOf(dealData.outside_de_payment_type) >= 0 ||
      paymentTypeData[2].member.indexOf(dealData.outside_de_payment_type) >= 0) ? true : false;

  const handleClickApprove = async () => {
    wizard.setLoading(true);
    updateTaskStatus('Approved', false, '');
    let postData: IDealData = { ...dealData };
    const curDate = new Date();
    postData.approval_request_date = curDate.toISOString();
    const res = await axios.post(
      `${APP_URL}/rechat-commission-app-save-approval-date`,
      {
        data: postData,
      }
    );
    wizard.setLoading(false);
    if (res.data.message === "successful")
      setFeedback("Approved.");
    else
      setFeedback("Approve failed.");
    setOpenFeedback(true);
  };

  const handleClickDecline = () => {
    setOpenDeclineMsg(true);
  };
  
  const handleConfirmDecline = () => {
    wizard.setLoading(true);
    updateTaskStatus('Declined', false, declineMsg);
    wizard.setLoading(false);
    setOpenDeclineMsg(false);
    setFeedback("Declined.");
    setOpenFeedback(true);
  };

  const handleClose = () => {
    setOpenDeclineMsg(false);
  };

  const handleCloseFeedback = async () => {
    setOpenFeedback(false);
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        Please review the Commission Slip.
      </QuestionTitle>
      <div style={{ margin: "0 20px" }}>
        <Grid container style={{ marginTop: "30px" }}>
          {
            sellerInfo &&
            <Grid item xs={6}>
              <Grid item xs={12}>
                <label style={{ fontSize: '17px' }}>Seller Info</label>
              </Grid>
              <Grid item xs={12}>{sellerInfo.legal_full_name}</Grid>
              <Grid item xs={12}>{sellerInfo.email}</Grid>
              <Grid item xs={12}>{sellerInfo.phone_number}</Grid>
              <Grid item xs={12}>{sellerInfo.current_address ? sellerInfo.current_address.full : ""}</Grid>
            </Grid>
          }
          {
            sellerLawyerInfo &&
            <Grid item xs={6}>
              <Grid item xs={12}>
                <label style={{ fontSize: '17px' }}>Seller's Attorney Info</label>
              </Grid>
              <Grid item xs={12}>{sellerLawyerInfo.legal_full_name}</Grid>
              <Grid item xs={12}>{sellerLawyerInfo.email}</Grid>
              <Grid item xs={12}>{sellerLawyerInfo.phone_number}</Grid>
              <Grid item xs={12}>{sellerLawyerInfo.current_address ? sellerLawyerInfo.current_address.full : ""}</Grid>
            </Grid>
          }
        </Grid>
        <Grid container style={{ marginTop: "30px" }}>
          {
            buyerInfo &&
            <Grid item xs={6}>
              <Grid item xs={12}>
                <label style={{ fontSize: '17px' }}>Buyer Info</label>
              </Grid>
              <Grid item xs={12}>{buyerInfo.legal_full_name}</Grid>
              <Grid item xs={12}>{buyerInfo.email}</Grid>
              <Grid item xs={12}>{buyerInfo.phone_number}</Grid>
              <Grid item xs={12}>{buyerInfo.current_address ? buyerInfo.current_address.full : ""}</Grid>
            </Grid>
          }
          <Grid item xs={6}>
          {
            buyerLawyerInfo && 
            <Grid item xs={6}>
              <Grid item xs={12}>
                <label style={{ fontSize: '17px' }}>Buyer's Attorney Info</label>
              </Grid>
              <Grid item xs={12}>{buyerLawyerInfo.legal_full_name}</Grid>
              <Grid item xs={12}>{buyerLawyerInfo.email}</Grid>
              <Grid item xs={12}>{buyerLawyerInfo.phone_number}</Grid>
              <Grid item xs={12}>{buyerLawyerInfo.current_address ? buyerLawyerInfo.current_address.full : ""}</Grid>
            </Grid>
          }
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={12}>
            <label style={{ fontSize: '17px' }}>Financing</label>
          </Grid>
          <Grid item xs={12}>
            {financing}
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={12}>
            <label style={{ fontSize: '17px' }}>Financing Program</label>
          </Grid>
          <Grid item xs={12}>
            {financingProgram}
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={12}>
            <label style={{ fontSize: '17px' }}>GCI to Douglas Elliman</label>
          </Grid>
          <Grid item xs={12}>
            {gciDeValue}
            {dealData.gci_calculate_type == 0 ? "%" : "$"}
            {dealData.gci_calculate_type == 0 && (
            <Box>
              <strong>{"$" + stylizeNumber(salesPrice)}</strong>
              {` (Sales Price) * ${gciDeValue}% (GCI) = `}
              <strong>
                ${stylizeNumber(salesPrice * Number(gciDeValue) / 100)}
              </strong>
            </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            {dealData.gci_reason}
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={12}>
            <label style={{ fontSize: '17px' }}>GCI Split</label>
          </Grid>
          {roleData.filter((role: IRoleData) => 
            (dealType == "Buying" || dealType == "Both") ? 
              (role.role == "BuyerAgent" || role.role == "CoBuyerAgent" || role.role == "BuyerReferral") : 
              (role.role == "SellerAgent" || role.role == "CoSellerAgent" || role.role == "SellerReferral"))
            .map(role => 
            <>
              <Grid item xs={12}>
                <label>{role.role}</label>
              </Grid>
              <Grid item xs={12}>
                {role.legal_full_name}
              </Grid>
              <Grid item xs={12}>
                Share: {role.share_percent == null ? parseFloat((Number(role.share_value) / Number(salesPrice) * 100).toFixed(3)) : role.share_percent}
              </Grid>
              <Grid item xs={12}>
                Dollar: {role.share_value == null ? parseFloat((Number(salesPrice) * Number(role.share_percent) / 100).toFixed(3)) : role.share_value}
              </Grid>
              <Grid item xs={12}>
                {role.note}
              </Grid>
            </>
          )}
        </Grid>
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={6}>
            <label style={{ fontSize: '17px' }}>Remmittance </label>
          </Grid>
          <Grid item xs={6}>
            <label style={{ fontSize: '17px' }}>Buy Side</label>
          </Grid>
          <Grid item xs={6}>
            Form of Remittance
          </Grid>
          <Grid item xs={6}>
            <label>Checks</label>
          </Grid>
          {remittanceChecks.map((item: IRemittanceChecks, index: number) => 
            <>
              <Grid item xs={12}>
                <label>Check{index+1}</label>
              </Grid>
              <Grid item xs={6}>
                Check number
              </Grid>
              <Grid item xs={6}>
                <label>{item.check_num}</label>
              </Grid>
              <Grid item xs={6}>
                Amount
              </Grid>
              <Grid item xs={6}>
                <label>{item.amount}</label>
              </Grid>
              <Grid item xs={6}>
                Date on check
              </Grid>
              <Grid item xs={6}>
                <label>{(new Date(item.check_date)).toDateString().slice(4)}</label>
              </Grid>
              <Grid item xs={6}>
                Date on received
              </Grid>
              <Grid item xs={6}>
                <label>{(new Date(item.check_receive_date)).toDateString().slice(4)}</label>
              </Grid>
            </>
          )}
        </Grid>
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={6}>
            <label style={{ fontSize: '17px' }}>Remmittance </label>
          </Grid>
          <Grid item xs={6}>
            <label style={{ fontSize: '17px' }}>Listing Side</label>
          </Grid>
          <Grid item xs={6}>
            Form of Remittance
          </Grid>
          <Grid item xs={6}>
            <label>Bank Wire</label>
          </Grid>
          <Grid item xs={6}>
            Brokerage Commission
          </Grid>
          <Grid item xs={6}>
            <label>{dealData.brokerage_commission}</label>
          </Grid>
          <Grid item xs={6}>
            Staging Cost
          </Grid>
          <Grid item xs={6}>
            <label>{dealData.stage_cost}</label>
          </Grid>
          <Grid item xs={6}>
            Total Due at Closing
          </Grid>
          <Grid item xs={6}>
            <label>{Number(dealData.brokerage_commission) + Number(dealData.stage_cost)}</label>
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={12}>
            <label style={{ fontSize: '17px' }}>Inside Douglas Elliman Payments Info </label>
          </Grid>
          <Grid item xs={6}>
            Payment Type
          </Grid>
          <Grid item xs={6}>
            <label>{dealData.inside_de_payment_type}</label>
          </Grid>
          <Grid item xs={6}>
            Paid To
          </Grid>
          <Grid item xs={6}>
            <label>{dealData.inside_de_paid_to}</label>
          </Grid>
          <Grid item xs={12} style={{ marginTop: "15px" }}>
            <label>Paid By</label>
          </Grid>
          <Grid item xs={12}>
            {roleData.map((agent: IRoleData, id: number) => (
              <>
                {(dealType == "Selling" || dealType == "Both") &&
                  (agent.role == "SellerAgent" ||
                    agent.role == "CoSellerAgent" ||
                    agent.role == "SellerReferral") && (
                    <PaidByInfoCard
                      key={id}
                      index={id}
                      Ui={Ui}
                    />
                  )}
                {(dealType == "Buying" || dealType == "Both") &&
                  (agent.role == "BuyerAgent" ||
                    agent.role == "CoBuyerAgent" ||
                    agent.role == "BuyerReferral") && (
                    <PaidByInfoCard
                      key={id}
                      index={id}
                      Ui={Ui}
                    />
                  )}
              </>
            ))}
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={12}>
            <label style={{ fontSize: '17px' }}>Outside Douglas Elliman Payments Info </label>
          </Grid>
          <Grid item xs={6}>
            Payment Type
          </Grid>
          <Grid item xs={6}>
            <label>{dealData.outside_de_payment_type}</label>
          </Grid>
          <Grid item xs={6}>
            Paid To
          </Grid>
          <Grid item xs={6}>
            <label>{dealData.outside_de_paid_to}</label>
          </Grid>
          <Grid item xs={12} style={{ marginTop: "15px" }}>
            <label>Paid By</label>
          </Grid>
          <Grid item xs={12}>
            {roleData.map((agent: IRoleData, id: number) => (
              <>
                {(dealType == "Selling" || dealType == "Both") &&
                  (agent.role == "SellerAgent" ||
                    agent.role == "CoSellerAgent" ||
                    agent.role == "SellerReferral") && (
                    <PaidByInfoCard
                      key={id}
                      index={id}
                      Ui={Ui}
                    />
                  )}
                {(dealType == "Buying" || dealType == "Both") &&
                  (agent.role == "BuyerAgent" ||
                    agent.role == "CoBuyerAgent" ||
                    agent.role == "BuyerReferral") && (
                    <PaidByInfoCard
                      key={id}
                      index={id}
                      Ui={Ui}
                    />
                  )}
              </>
            ))}
          </Grid>
        </Grid>
        {showCompanyInfo &&
          <Grid container style={{ marginTop: "15px" }}>
            <Grid item xs={6}>
              Company
            </Grid>
            <Grid item xs={6}>
              <label>{dealData.outside_de_payment_company}</label>
            </Grid>
            <Grid item xs={6}>
              Company Address
            </Grid>
            <Grid item xs={6}>
              <label>{dealData.outside_de_payment_company_address}</label>
            </Grid>
            <Grid item xs={6}>
              Office Number
            </Grid>
            <Grid item xs={6}>
              <label>{dealData.outside_de_payment_office}</label>
            </Grid>
            <Grid item xs={6}>
              Cell Number
            </Grid>
            <Grid item xs={6}>
              <label>{dealData.outside_de_payment_cell}</label>
            </Grid>
            <Grid item xs={6}>
              Fax Number
            </Grid>
            <Grid item xs={6}>
              <label>{dealData.outside_de_payment_fax}</label>
            </Grid>
            <Grid item xs={6}>
              Tax ID
            </Grid>
            <Grid item xs={6}>
              <label>{dealData.outside_de_payment_tax_id}</label>
            </Grid>
            <Grid item xs={6}>
              Email
            </Grid>
            <Grid item xs={6}>
              <label>{dealData.outside_de_payment_mail}</label>
            </Grid>
          </Grid>
        }
        <Box
          style={{
            textAlign: "right",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleClickApprove}
            style={{
              backgroundColor: "#0fb78d",
              color: "white",
            }}
          >
            Approve
          </Button><Button
            variant="contained"
            onClick={handleClickDecline}
            style={{
              marginLeft: 10,
              backgroundColor: "#050E21",
              color: "white",
            }}
          >
            Decline
          </Button>
        </Box>
      </div>
      <Dialog open={openDeclineMsg} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Decline</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please input the reason for decline.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            value={declineMsg}
            multiline
            minRows={5}
            fullWidth
            variant="outlined"
            onChange={e => setDeclineMsg(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDecline} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openFeedback} onClose={handleCloseFeedback} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{feedback}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseFeedback} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </QuestionSection>
  );
};

export default ReviewQuestion;
