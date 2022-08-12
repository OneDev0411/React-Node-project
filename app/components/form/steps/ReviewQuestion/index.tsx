import React from "@libs/react";
import Ui from "@libs/material-ui";
import { AppContextApi, IQuestionProps, IRemittanceChecks, IRoleData } from "../../../../models/type";
import { stylizeNumber } from "../../../../util";
import useApp from "../../../../hooks/useApp";
import PaidByInfoCard from "./PaidByInfoCard";

const ReviewQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  models: { deal, roles },
  api: { getDealContext, updateTaskStatus },
}) => {
  const { QuestionSection, QuestionTitle } = Wizard;
  const { Box, Button, Grid } = Ui;
  const { dealData, roleData, remittanceChecks } = useApp();
  const total_data: AppContextApi = useApp();
  const deal_type = deal.deal_type;

  const sellerInfo = roles.filter((role: IDealRole) => role.role === "Seller")[0];
  const sellerLawyerInfo = roles.filter((role: IDealRole) => role.role === "SellerLawyer")[0];
  const buyerInfo = roles.filter((role: IDealRole) => role.role == "Buyer")[0];
  const buyerLawyerInfo = roles.filter((role: IDealRole) => role.role === "BuyerLawyer")[0];

  const listPrice = getDealContext("list_price")?.number;
  const financing = getDealContext("financing")?.text;
  const financingProgram = getDealContext("financing_program")?.text;

  const handleClickApprove = () => {
    updateTaskStatus('Approved', false, '');
  };

  const handleClickDecline = () => {
    updateTaskStatus('Declined', false, '');
  };

  return (
    <QuestionSection>
      <QuestionTitle>
        Please review the Commission Slip.
      </QuestionTitle>
      <div style={{ margin: "0 20px" }}>
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={12}>
            <label style={{ fontSize: '17px' }}>Seller's Info</label>
          </Grid>
          <Grid item xs={6}>{sellerInfo.legal_full_name}</Grid>
          <Grid item xs={6}>{sellerLawyerInfo.legal_full_name}</Grid>
          <Grid item xs={6}>{sellerInfo.email}</Grid>
          <Grid item xs={6}>{sellerLawyerInfo.email}</Grid>
          <Grid item xs={6}>{sellerInfo.phone_number}</Grid>
          <Grid item xs={6}>{sellerLawyerInfo.phone_number}</Grid>
          <Grid item xs={6}>{sellerInfo.current_address.full}</Grid>
          <Grid item xs={6}>{sellerLawyerInfo.current_address.full}</Grid>
        </Grid>
        <Grid container style={{ marginTop: "30px" }}>
          <Grid item xs={12}>
            <label style={{ fontSize: '17px' }}>Buyer's Info</label>
          </Grid>
          <Grid item xs={6}>{buyerInfo.legal_full_name}</Grid>
          <Grid item xs={6}>{buyerLawyerInfo.legal_full_name}</Grid>
          <Grid item xs={6}>{buyerInfo.email}</Grid>
          <Grid item xs={6}>{buyerLawyerInfo.email}</Grid>
          <Grid item xs={6}>{buyerInfo.phone_number}</Grid>
          <Grid item xs={6}>{buyerLawyerInfo.phone_number}</Grid>
          <Grid item xs={6}>{buyerInfo.current_address.full}</Grid>
          <Grid item xs={6}>{buyerLawyerInfo.current_address.full}</Grid>
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
            {dealData.gci_calculate_type == 0 ? dealData.gci_de_value / listPrice * 100 : dealData.gci_de_value}
            {dealData.gci_calculate_type == 0 ? "%" : "$"}
            {dealData.gci_calculate_type == 0 && (
            <Box>
              <strong>{"$" + stylizeNumber(listPrice)}</strong>
              {`(Listing Price) * ${dealData.gci_calculate_type == 0 ? dealData.gci_de_value / listPrice * 100 : dealData.gci_de_value}% (GCI) = `}
              <strong>
                ${stylizeNumber((listPrice * Number(dealData.gci_calculate_type == 0 ? dealData.gci_de_value / listPrice * 100 : dealData.gci_de_value)) / 100)}
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
          {roleData.map(role => 
            <>
              <Grid item xs={12}>
                <label>{role.role}</label>
              </Grid>
              <Grid item xs={12}>
                {role.legal_full_name}
              </Grid>
              <Grid item xs={12}>
                Share: {role.share_percent}
              </Grid>
              <Grid item xs={12}>
                Dollar: {role.share_value}
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
                <label>{item.check_date.toDateString().slice(4)}</label>
              </Grid>
              <Grid item xs={6}>
                Date on received
              </Grid>
              <Grid item xs={6}>
                <label>{item.check_receive_date.toDateString().slice(4)}</label>
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
            <label>{dealData.remittance_bank_wire_amount}</label>
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
            <label>{Number(dealData.remittance_bank_wire_amount) + Number(dealData.stage_cost)}</label>
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
                {deal_type == "Selling" &&
                  (agent.role == "BuyerAgent" ||
                    agent.role == "CoBuyerAgent") && (
                    <PaidByInfoCard
                      key={id}
                      index={id}
                      Ui={Ui}
                    />
                  )}
                {deal_type == "Buying" &&
                  (agent.role == "SellerAgent" ||
                    agent.role == "CoSellerAgent") && (
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
                {deal_type == "Selling" &&
                  (agent.role == "SellerAgent" ||
                    agent.role == "CoSellerAgent") && (
                    <PaidByInfoCard
                      key={id}
                      index={id}
                      Ui={Ui}
                    />
                  )}
                {deal_type == "Buying" &&
                  (agent.role == "BuyerAgent" ||
                    agent.role == "CoBuyerAgent") && (
                    <PaidByInfoCard
                      key={id}
                      index={id}
                      Ui={Ui}
                    />
                  )}
                {deal_type == "Both" &&
                  (agent.role == "BuyerAgent" ||
                    agent.role == "CoBuyerAgent" ||
                    agent.role == "SellerAgent" ||
                    agent.role == "CoSellerAgent") && (
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
    </QuestionSection>
  );
};

export default ReviewQuestion;
