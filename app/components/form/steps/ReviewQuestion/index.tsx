import React from "@libs/react";
import Ui from "@libs/material-ui";
import { IDealData, IPaidByData, IQuestionProps, IRemittanceChecks, IRoleData, IPayment } from "../../../../models/type";
import { paymentTypeData, stylizeNumber, APP_URL } from "../../../../util";
import useApp from "../../../../hooks/useApp";
import PaidByInfoCard from "./PaidByInfoCard";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReviewQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  models: { deal, roles },
  api: { getDealContext, updateTaskStatus, close },
  hooks: { useWizardContext },
}) => {
  const { QuestionSection, QuestionTitle } = Wizard;
  const { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Grid } = Ui;
  const { dealData, roleData, remittanceChecks, insidePayments, outsidePayments } = useApp();
  const wizard = useWizardContext();
  const enderType = deal.context.ender_type?.text;
  const dealType = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? "Both" : deal.deal_type;

  const sellerInfo = roles.filter((role: IDealRole) => role.role === "Seller")[0];
  const sellerLawyerInfo = roles.filter((role: IDealRole) => role.role === "SellerLawyer")[0];
  const buyerInfo = roles.filter((role: IDealRole) => role.role === "Buyer")[0];
  const buyerLawyerInfo = roles.filter((role: IDealRole) => role.role === "BuyerLawyer")[0];

  const buySideChecks = remittanceChecks.filter(item => item.deal_side === "BuySide");
  const listingSideChecks = remittanceChecks.filter(item => item.deal_side === "ListingSide");

  const salesPrice = getDealContext("sales_price")?.number;
  const financing = getDealContext("financing")?.text;
  const financingProgram = getDealContext("financing_program")?.text;

  const [openDeclineMsg, setOpenDeclineMsg] = React.useState<boolean>(false);
  const [declineMsg, setDeclineMsg] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string>("");
  const [openFeedback, setOpenFeedback] = React.useState<boolean>(false);

  const gciDeValue = dealData.gci_de_value;
  const gciDePercent = parseFloat((gciDeValue / salesPrice * 100).toFixed(3));

  const handleClickApprove = async () => {
    wizard.setLoading(true);
    updateTaskStatus('Approved', false, '');
    let postData: IDealData = { ...dealData };
    const curDate = new Date();
    postData.approval_request_date = curDate.toISOString();
    postData.status = "Approved";
    const res = await axios.post(
      `${APP_URL}/rechat-commission-app-approve`,
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
  
  const handleConfirmDecline = async () => {
    wizard.setLoading(true);
    updateTaskStatus('Declined', false, declineMsg);
    let postData: IDealData = { ...dealData };
    postData.approval_request_date = "";
    postData.status = "Declined";
    const res = await axios.post(
      `${APP_URL}/rechat-commission-app-approve`,
      {
        data: postData,
      }
    );
    wizard.setLoading(false);
    setOpenDeclineMsg(false);
    if (res.data.message === "successful")
      setFeedback("Declined.");
    else
      setFeedback("Decline failed.");
    setOpenFeedback(true);
  };

  const handleClose = () => {
    setOpenDeclineMsg(false);
  };

  const handleCloseFeedback = async () => {
    setOpenFeedback(false);
    close();
  }
  
  const handlePrint = async () => {
    wizard.setLoading(true);
    let pdf = new jsPDF("p", "pt", "a4");
    const pdfHtml = document.querySelector("#report");
    const pdfCanvas = await html2canvas(pdfHtml as HTMLElement, {});
    const img = pdfCanvas.toDataURL("image/png");
    const imgProperties = pdf.getImageProperties(img);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height*pdfWidth) / imgProperties.width;
    const pdfPageHeight = pdf.internal.pageSize.getHeight();
    const topLeftMargin = 40;
    const totalPdfPages = Math.ceil((pdfHeight+topLeftMargin)/pdfPageHeight);
    
    pdf.addImage(img, "PNG", topLeftMargin, topLeftMargin, pdfWidth - topLeftMargin*2, pdfHeight);
    for (let i = 1; i < totalPdfPages; i++) {
      pdf.addPage("a4", "p");
      pdf.addImage(img, "PNG", topLeftMargin, -pdfPageHeight*i + topLeftMargin, pdfWidth - topLeftMargin*2, pdfHeight);
    }
    const pdfData = pdf.output('blob');
    const url = URL.createObjectURL(pdfData);
    window.open(url);
    URL.revokeObjectURL(url);
    wizard.setLoading(false);
  };

  return (
    <QuestionSection>
      <QuestionTitle>
        Please review the Commission Slip.
      </QuestionTitle>
      <div style={{ margin: "0 20px" }}>
        <div id="report" style={{ margin: "30px 20px" }}>
          <Grid container>
            {sellerInfo && (
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <label style={{ fontSize: '17px' }}>Seller Info</label>
                </Grid>
                <Grid item xs={12}>{sellerInfo.legal_full_name}</Grid>
                <Grid item xs={12}>{sellerInfo.email}</Grid>
                <Grid item xs={12}>{sellerInfo.phone_number}</Grid>
                <Grid item xs={12}>{sellerInfo.current_address ? sellerInfo.current_address.full : ""}</Grid>
              </Grid>
            )}
            {sellerLawyerInfo && (
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <label style={{ fontSize: '17px' }}>Seller's Attorney Info</label>
                </Grid>
                <Grid item xs={12}>{sellerLawyerInfo.legal_full_name}</Grid>
                <Grid item xs={12}>{sellerLawyerInfo.email}</Grid>
                <Grid item xs={12}>{sellerLawyerInfo.phone_number}</Grid>
                <Grid item xs={12}>{sellerLawyerInfo.current_address ? sellerLawyerInfo.current_address.full : ""}</Grid>
              </Grid>
            )}
          </Grid>
          <Grid container style={{ marginTop: "30px" }}>
            {buyerInfo && (
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <label style={{ fontSize: '17px' }}>Buyer Info</label>
                </Grid>
                <Grid item xs={12}>{buyerInfo.legal_full_name}</Grid>
                <Grid item xs={12}>{buyerInfo.email}</Grid>
                <Grid item xs={12}>{buyerInfo.phone_number}</Grid>
                <Grid item xs={12}>{buyerInfo.current_address ? buyerInfo.current_address.full : ""}</Grid>
              </Grid>
            )}
            <Grid item xs={6}>
            {buyerLawyerInfo && (
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <label style={{ fontSize: '17px' }}>Buyer's Attorney Info</label>
                </Grid>
                <Grid item xs={12}>{buyerLawyerInfo.legal_full_name}</Grid>
                <Grid item xs={12}>{buyerLawyerInfo.email}</Grid>
                <Grid item xs={12}>{buyerLawyerInfo.phone_number}</Grid>
                <Grid item xs={12}>{buyerLawyerInfo.current_address ? buyerLawyerInfo.current_address.full : ""}</Grid>
              </Grid>
            )}
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
          {financing != "Cash Deal" && (
            <Grid container style={{ marginTop: "30px" }}>
              <Grid item xs={12}>
                <label style={{ fontSize: '17px' }}>Financing Program</label>
              </Grid>
              <Grid item xs={12}>
                {financingProgram}
              </Grid>
            </Grid>
          )}
          <Grid container style={{ marginTop: "30px" }}>
            <Grid item xs={12}>
              <label style={{ fontSize: '17px' }}>GCI to Douglas Elliman</label>
            </Grid>
            <Grid item xs={12}>
              {gciDePercent}%
              <Box>
                <strong>{"$" + stylizeNumber(salesPrice)}</strong>
                {` (Sales Price) * ${gciDePercent}% (GCI) = `}
                <strong>
                  ${stylizeNumber(salesPrice * Number(gciDePercent) / 100)}
                </strong>
              </Box>
            </Grid>
            <Grid item xs={12} style={{ marginTop: 5 }}>
              {dealData.gci_reason_select === 0 && <label>Approved Commission Reduction</label>}
              {dealData.gci_reason_select === 1 && <label>Co-broke Commission Offered</label>}
              {dealData.gci_reason_select === 2 && <label>{dealData.gci_reason}</label>}
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
              <React.Fragment key={role.role_id}>
                <Grid item xs={12}>
                  <label>{role.role}</label>
                </Grid>
                <Grid item xs={12}>
                  {role.legal_full_name}
                </Grid>
                <Grid item xs={12}>
                  Share: {role.share_percent == null ? parseFloat((Number(role.share_value) / Number(salesPrice) * 100).toFixed(3)) : role.share_percent}%
                </Grid>
                <Grid item xs={12}>
                  Dollar: ${stylizeNumber(Number(role.share_value == null ? parseFloat((Number(salesPrice) * Number(role.share_percent) / 100).toFixed(3)) : role.share_value))}
                </Grid>
                <Grid item xs={12}>
                  {role.note}
                </Grid>
              </React.Fragment>
            )}
          </Grid>
          {Number(dealData.stage_cost) !== 0 &&
            <Grid container style={{ marginTop: "30px" }}>
              <Grid item xs={12}>
                <label>Remittance Info</label>
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
          }
          {(dealType == "Both" || dealType == "Buying") &&
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
              {buySideChecks.length > 0 && <>
                <Grid item xs={6}>
                  <label>Checks</label>
                </Grid>
                {buySideChecks.map((item: IRemittanceChecks, index: number) => 
                  <Grid
                    container
                    style={{
                      padding: "10px 0",
                      marginBottom: 10,
                    }}
                    key={index}
                  >
                    <Grid item xs={12} style={{ marginBottom: 5 }}>
                      <label>Check{index+1}</label>
                    </Grid>
                    <Grid item xs={6}>
                      Check number
                    </Grid>
                    <Grid item xs={6}>
                      <label style={{ margin: 0 }}>{item.check_num}</label>
                    </Grid>
                    <Grid item xs={6}>
                      Amount
                    </Grid>
                    <Grid item xs={6}>
                      <label style={{ margin: 0 }}>${stylizeNumber(item.amount)}</label>
                    </Grid>
                    <Grid item xs={6}>
                      Date on check
                    </Grid>
                    <Grid item xs={6}>
                      <label style={{ margin: 0 }}>{(new Date(item.check_date)).toDateString().slice(4)}</label>
                    </Grid>
                    <Grid item xs={6}>
                      Date on received
                    </Grid>
                    <Grid item xs={6}>
                      <label style={{ margin: 0 }}>{(new Date(item.check_receive_date)).toDateString().slice(4)}</label>
                    </Grid>
                  </Grid>
                )}
              </>}
              {Number(dealData.remittance_buy_side_bank_wire_amount) > 0 && <>
                <Grid item xs={6}>
                  <label>Bank Wire</label>
                </Grid>
                <Grid item xs={6}>
                  Amount
                </Grid>
                <Grid item xs={6}>
                  <label>${stylizeNumber(Number(dealData.remittance_buy_side_bank_wire_amount))}</label>
                </Grid>
              </>}
            </Grid>
          }
          {(dealType == "Both" || dealType == "Selling") &&
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
              {listingSideChecks.length > 0 && <>
                <Grid item xs={6}>
                  <label>Checks</label>
                </Grid>
                {listingSideChecks.map((item: IRemittanceChecks, index: number) => 
                  <Grid 
                    container
                    style={{
                      padding: "10px 0",
                      marginBottom: 10,
                    }}
                    key={index}
                  >
                    <Grid item xs={12} style={{ marginBottom: 5 }}>
                      <label>Check{index+1}</label>
                    </Grid>
                    <Grid item xs={6} style={{ padding: 0 }}>
                      Check number
                    </Grid>
                    <Grid item xs={6} style={{ margin: 0 }}>
                      <label style={{ margin: 0 }}>{item.check_num}</label>
                    </Grid>
                    <Grid item xs={6}>
                      Amount
                    </Grid>
                    <Grid item xs={6}>
                      <label style={{ margin: 0 }}>${stylizeNumber(item.amount)}</label>
                    </Grid>
                    <Grid item xs={6}>
                      Date on check
                    </Grid>
                    <Grid item xs={6}>
                      <label style={{ margin: 0 }}>{(new Date(item.check_date)).toDateString().slice(4)}</label>
                    </Grid>
                    <Grid item xs={6}>
                      Date on received
                    </Grid>
                    <Grid item xs={6}>
                      <label style={{ margin: 0 }}>{(new Date(item.check_receive_date)).toDateString().slice(4)}</label>
                    </Grid>
                  </Grid>
                )}
              </>}
              {Number(dealData.remittance_listing_side_bank_wire_amount) > 0 && <>
                <Grid item xs={6}>
                  <label>Bank Wire</label>
                </Grid>
                <Grid item xs={6}>
                  Amount
                </Grid>
                <Grid item xs={6}>
                  <label>${stylizeNumber(Number(dealData.remittance_listing_side_bank_wire_amount))}</label>
                </Grid>
              </>}
            </Grid>
          }
          <Grid container style={{ marginTop: "15px" }}>
            <>
              <Grid item xs={12}>
                <label style={{ fontSize: '17px', marginBottom: 10 }}>Inside Douglas Elliman Payments Info </label>
              </Grid>
              {insidePayments.map((item: IPayment, index) => 
                item.de_payment_type && 
                <Grid
                  container
                  style={{
                    padding: 20,
                    marginBottom: 10,
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    borderRadius: 4
                  }}
                  key={index}
                >
                  <Grid item xs={6} style={{ marginTop: "5px" }}>
                    Payment Type
                  </Grid>
                  <Grid item xs={6}>
                    <label>{item.de_payment_type}</label>
                  </Grid>
                  <Grid item xs={6}>
                    Paid To
                  </Grid>
                  <Grid item xs={6}>
                    <label>{item.de_paid_to}</label>
                  </Grid>
                  {item.de_paid_by.filter(paidByItem => paidByItem.payment_unit_type !== null).length > 0 &&
                    <Grid item xs={12} style={{ marginTop: "15px" }}>
                      <label>Paid By</label>
                    </Grid>
                  }
                  <Grid item xs={12}>
                    {item.de_paid_by.map((paidByItem: IPaidByData, id: number) => (
                      paidByItem.payment_unit_type !== null &&
                      <>
                        {(dealType == "Selling" || dealType == "Both") &&
                          (paidByItem.role == "SellerAgent" ||
                            paidByItem.role == "CoSellerAgent" ||
                            paidByItem.role == "SellerReferral") && (
                            <PaidByInfoCard
                              key={id}
                              Ui={Ui}
                              paidByData={paidByItem}
                            />
                          )}
                        {(dealType == "Buying" || dealType == "Both") &&
                          (paidByItem.role == "BuyerAgent" ||
                            paidByItem.role == "CoBuyerAgent" ||
                            paidByItem.role == "BuyerReferral") && (
                            <PaidByInfoCard
                              key={id}
                              Ui={Ui}
                              paidByData={paidByItem}
                            />
                          )}
                      </>
                    ))}
                  </Grid>
                </Grid>
              )}
            </>
          </Grid>
          
          <Grid container style={{ marginTop: "30px" }}>
            <>
              <Grid item xs={12}>
                <label style={{ fontSize: '17px', marginBottom: 10 }}>Outside Douglas Elliman Payments Info </label>
              </Grid>
              {outsidePayments.map((item: IPayment, index) => 
                item.de_payment_type && 
                <Grid
                  container
                  style={{
                    padding: 20,
                    marginBottom: 10,
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    borderRadius: 4
                  }}
                  key={index}
                >
                  <Grid item xs={6} style={{ marginTop: "5px" }}>
                    Payment Type
                  </Grid>
                  <Grid item xs={6}>
                    <label>{item.de_payment_type}</label>
                  </Grid>
                  <Grid item xs={6}>
                    Paid To
                  </Grid>
                  <Grid item xs={6}>
                    <label>{item.de_paid_to}</label>
                  </Grid>
                  {item.de_paid_by.filter(paidByItem => paidByItem.payment_unit_type !== null).length > 0 &&
                    <Grid item xs={12} style={{ marginTop: "15px" }}>
                      <label>Paid By</label>
                    </Grid>
                  }
                  <Grid item xs={12}>
                    {item.de_paid_by.map((paidByItem: IPaidByData, id: number) => (
                      paidByItem.payment_unit_type !== null && <>
                        {(dealType == "Selling" || dealType == "Both") &&
                          (paidByItem.role == "SellerAgent" ||
                            paidByItem.role == "CoSellerAgent" ||
                            paidByItem.role == "SellerReferral") && (
                            <PaidByInfoCard
                              key={id}
                              Ui={Ui}
                              paidByData={paidByItem}
                            />
                          )}
                        {(dealType == "Buying" || dealType == "Both") &&
                          (paidByItem.role == "BuyerAgent" ||
                            paidByItem.role == "CoBuyerAgent" ||
                            paidByItem.role == "BuyerReferral") && (
                            <PaidByInfoCard
                              key={id}
                              Ui={Ui}
                              paidByData={paidByItem}
                            />
                          )}
                      </>
                    ))}
                    {(paymentTypeData[1].member.indexOf(item.de_payment_type) >= 0 || 
                      paymentTypeData[2].member.indexOf(item.de_payment_type) >= 0) &&
                      <Grid container style={{ marginTop: "15px" }}>
                        <Grid item xs={6}>
                          Company
                        </Grid>
                        <Grid item xs={6}>
                          <label>{item.de_payment_company}</label>
                        </Grid>
                        <Grid item xs={6}>
                          Company Address
                        </Grid>
                        <Grid item xs={6}>
                          <label>{item.de_payment_company_address}</label>
                        </Grid>
                        <Grid item xs={6}>
                          Office Number
                        </Grid>
                        <Grid item xs={6}>
                          <label>{item.de_payment_office}</label>
                        </Grid>
                        <Grid item xs={6}>
                          Cell Number
                        </Grid>
                        <Grid item xs={6}>
                          <label>{item.de_payment_cell}</label>
                        </Grid>
                        <Grid item xs={6}>
                          Fax Number
                        </Grid>
                        <Grid item xs={6}>
                          <label>{item.de_payment_fax}</label>
                        </Grid>
                        <Grid item xs={6}>
                          Tax ID
                        </Grid>
                        <Grid item xs={6}>
                          <label>{item.de_payment_tax_id}</label>
                        </Grid>
                        <Grid item xs={6}>
                          Email
                        </Grid>
                        <Grid item xs={6}>
                          <label>{item.de_payment_mail}</label>
                        </Grid>
                      </Grid>
                    }
                  </Grid>
                </Grid>
              )}
            </>
          </Grid>
        </div>
        <Box
          style={{
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            onClick={handlePrint}
            style={{
              backgroundColor: "#0fb78d",
              color: "white",
            }}
          >
            View/Print
          </Button>
          {(dealData.status === "" || dealData.status === null) &&
            <Box
              component="span"
              style={{
                float: "right",
                textAlign: "right",
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
              </Button>
              <Button
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
          }
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
