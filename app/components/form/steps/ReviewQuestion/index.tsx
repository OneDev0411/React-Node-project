import React from '@libs/react'
import Ui from '@libs/material-ui'
import _ from 'lodash'
import axios from 'axios'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import useApp from '../../../../hooks/useApp'
import { 
  IDealData,
  IPaidByData,
  IQuestionProps,
  IRemittanceChecks,
  IRoleData,
  IPayment,
  IFeeData,
  ICreditData 
} from '../../../../models/type'
import { APP_URL, commissionReason, stylizeNumber } from '../../../../util'

const ReviewQuestion: React.FC<IQuestionProps> = ({
  Wizard,
  models: { deal, roles },
  api: { getDealContext, updateTaskStatus, close },
  hooks: { useWizardContext },
  isNYC,
  isNevada,
  isFlorida
}) => {
  const { useEffect, useState } = React
  const { QuestionSection, QuestionTitle } = Wizard
  const { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Grid } = Ui
  const { dealData, roleData, remittanceChecks, insidePayments, outsidePayments, feeData, notes, docStatus, transCoordinator, dealNumber, creditData } = useApp()
  const wizard = useWizardContext()
  const enderType = deal.context.ender_type?.text
  const dealType = (enderType === 'AgentDoubleEnder' || enderType === 'OfficeDoubleEnder') ? 'Both' : deal.deal_type

  const sellers = roles.filter((role: IDealRole) => role.role === (deal.property_type.is_lease ? 'Landlord' : 'Seller'))
  const buyers = roles.filter((role: IDealRole) => role.role === (deal.property_type.is_lease ? 'Tenant' : 'Buyer'))

  const buySideChecks = remittanceChecks.filter(item => item.deal_side === 'BuySide')
  const listingSideChecks = remittanceChecks.filter(item => item.deal_side === 'ListingSide')

  const price = deal.property_type.is_lease ? getDealContext('leased_price')?.number : getDealContext('sales_price')?.number

  const [openDeclineMsg, setOpenDeclineMsg] = useState<boolean>(false)
  const [declineMsg, setDeclineMsg] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const [openFeedback, setOpenFeedback] = useState<boolean>(false)
  const [_feeData, _setFeeData] = useState<IFeeData[]>([])

  const gciDeValue = dealData.gci_de_value
  const gciDePercent = parseFloat((gciDeValue / price * 100).toFixed(3))
  const isBuyside = (role: IDealRole) =>
    role.role === 'BuyerAgent' || role.role === 'CoBuyerAgent'
  const isSellside = (role: IDealRole) =>
    role.role === 'SellerAgent' || role.role === 'CoSellerAgent'
  const getCommissionValue = (total: number, role: IDealRole) => {
    if (role.commission_dollar !== null) return role.commission_dollar;
  
    return total * (Number(role.commission_percentage) / 100)
  }  
  const getCommissionRate = (total: number, role: IDealRole) => {
    if (role.commission_percentage !== null) return role.commission_percentage;
  
    return (Number(role.commission_dollar) / total) * 100
  }
  const sum = (s: number, n: number) => s + n
  const BuySideDealValue = _.chain(roles)
    .filter(isBuyside)
    .map((r) => getCommissionValue(price, r))
    .reduce(sum)
    .value();
  const ListSideDealValue = _.chain(roles)
    .filter(isSellside)
    .map((r) => getCommissionValue(price, r))
    .reduce(sum)
    .value();
  const BuySideCommissionRate = _.chain(roles)
    .filter(isBuyside)
    .map((r) => getCommissionRate(price, r))
    .reduce(sum)
    .value();
  const ListSideCommissionRate = _.chain(roles)
    .filter(isSellside)
    .map((r) => getCommissionRate(price, r))
    .reduce(sum)
    .value();
  const ListSideAgent = roleData.filter((role) => ["SellerAgent", "CoSellerAgent"].includes(role.role))
  const BuySideAgent = roleData.filter((role) => ["BuyerAgent", "CoBuyerAgent"].includes(role.role))

  const getTotalPercentBuyerSide = (roleData: IRoleData[]) => {
    let sum: any = 0;
    for(let i = 0; i < roleData.length; i++ ) {
      sum += Number(roleData[i].share_percent)
    } 
    return sum
  };
  const getTotalPercentSellerSide = (roleData: IRoleData[]) => {
    let sum: any = 0;
    for(let i = 0; i < roleData.length; i++ ) {
      sum += Number(roleData[i].share_percent)
    }
    return sum
  };
  const getTotalValueBuyerSide = (roleData: IRoleData[]) => {
    let sum: any = 0;
    for(let i = 0; i < roleData.length; i++ ) {
      sum += Number(roleData[i].share_value)
    } 
    return sum
  };
  const getTotalValueSellerSide = (roleData: IRoleData[]) => {
    let sum: any = 0;
    for(let i = 0; i < roleData.length; i++) {
      sum += Number(roleData[i].share_value)
    }
    return sum
  };

  const totalValueBuyerSide = getTotalValueBuyerSide(BuySideAgent);
  const totalValueSellerSide = getTotalValueSellerSide(ListSideAgent);
  const totalPercentBuyerSide = getTotalPercentBuyerSide(BuySideAgent);
  const totalPercentSellerSide = getTotalPercentSellerSide(ListSideAgent);

  const isAgent = (role: IRoleData) => {
    return [
      'SellerAgent',
      'CoSellerAgent',
      'SellerReferral',
      'BuyerAgent',
      'CoBuyerAgent',
      'BuyerReferral',
    ].includes(role.role);
  };
  const doesNeedCommission = (role: IRoleData) => {
    if (dealType === 'Both') return true;

    if (dealType === 'Selling')
      return ['SellerAgent', 'CoSellerAgent', 'SellerReferral'].includes(
        role.role
      );

    if (dealType === 'Buying')
      return ['BuyerAgent', 'CoBuyerAgent', 'BuyerReferral'].includes(
        role.role
      );

    return false;
  };
  const isInternal = (role: IRoleData) => {
    return Boolean(role.agent_id)
  }
  const OfficeGCIPercent = _.chain(roleData)
    .filter(isAgent)
    .filter(doesNeedCommission)
    .filter(isInternal)
    .map((role) => role.share_percent ? Number(role.share_percent) : Number(role.share_value) / Number(price) * 100)
    .reduce(sum)
    .value()
  const OfficeGCIValue = Number(price) * OfficeGCIPercent / 100

  const activeInsidePayments = insidePayments.filter((item: IPayment) => item.de_paid_to !== '')
  const activeOutsidePayments = outsidePayments.filter((item: IPayment) => item.de_paid_to !== '')

  const nonGCIInsidePayments = insidePayments.filter((item: IPayment) => item.de_payment_type === 'Team Member')
  const nonGCIOutsidePayments = outsidePayments.filter((item: IPayment) => item.de_payment_type === 'Team Member')

  const getDEOfficeAddress = (data: any): string => {
    if (data.brand_type === 'Office')
      return data.name
    return getDEOfficeAddress(data.parent)
  }
  const deOfficeAddress = getDEOfficeAddress(deal.brand)

  const escrowTitleCompanyInfo = roles.filter((item: IDealRole) => item.role === "Title")

  const handleClickApprove = async () => {
    wizard.setLoading(true)
    updateTaskStatus('Approved', false, '')
    let postData: IDealData = { ...dealData }
    const curDate = new Date()
    postData.approval_request_date = curDate.toISOString()
    postData.status = 'Approved'
    const res = await axios.post(
      `${APP_URL}/rechat-commission-app-approve`,
      {
        data: postData,
      }
    )
    wizard.setLoading(false)
    if (res.data.message === 'successful')
      setFeedback('Approved.')
    else
      setFeedback('Approve failed.')
    setOpenFeedback(true)
  }

  const handleClickDecline = () => {
    setOpenDeclineMsg(true)
  }
  
  const handleConfirmDecline = async () => {
    wizard.setLoading(true)
    updateTaskStatus('Declined', false, declineMsg)
    let postData: IDealData = { ...dealData }
    postData.approval_request_date = ''
    postData.status = 'Declined'
    const res = await axios.post(
      `${APP_URL}/rechat-commission-app-approve`,
      {
        data: postData,
      }
    )
    wizard.setLoading(false)
    setOpenDeclineMsg(false)
    if (res.data.message === 'successful')
      setFeedback('Declined.')
    else
      setFeedback('Decline failed.')
    setOpenFeedback(true)
  }

  const handleClose = () => {
    setOpenDeclineMsg(false)
  }

  const handleCloseFeedback = async () => {
    setOpenFeedback(false)
    close()
  }
  
  const handlePrint = async () => {
    wizard.setLoading(true)
    let pdf = new jsPDF('p', 'pt', 'a4')
    const pdfHtml = document.querySelector('#report')
    const pdfCanvas = await html2canvas(pdfHtml as HTMLElement, {})
    const img = pdfCanvas.toDataURL('image/png')
    const imgProperties = pdf.getImageProperties(img)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProperties.height*pdfWidth) / imgProperties.width
    const pdfPageHeight = pdf.internal.pageSize.getHeight()
    const topLeftMargin = 30
    const totalPdfPages = Math.ceil((pdfHeight+topLeftMargin)/pdfPageHeight)
    
    pdf.addImage(img, 'PNG', topLeftMargin, topLeftMargin, pdfWidth - topLeftMargin*2, pdfHeight)
    for (let i = 1; i < totalPdfPages; i++) {
      pdf.addPage('a4', 'p')
      pdf.addImage(img, 'PNG', topLeftMargin, -pdfPageHeight*i + topLeftMargin, pdfWidth - topLeftMargin*2, pdfHeight)
    }
    pdf.save(`SP${deal.number}.pdf`)
    wizard.setLoading(false)
  }

  const styles = {
    wrapper: {
      marginTop: '15px',
    },
    group: {
      border: '1px solid rgba(0, 0, 0, 0.12)',
      marginBottom: '15px',
      padding: '10px 15px'
    },
    group_title: {
      marginBottom: '10px',
      fontSize: '17px'
    }
  }

  useEffect(() => {
    let _tempFeeData = feeData.filter((item) => !(item.fee_amount === '0' && item.fee_amount_percentage === "0"))
    _setFeeData(_tempFeeData)
  },[feeData])

  return (
    <QuestionSection>
      <QuestionTitle>
        Please review the Commission Slip.
      </QuestionTitle>
      <Grid
        container
        style={styles.wrapper}
        id="report"
      >
        <Grid container style={styles.group}>
          <Grid item xs={12} style={styles.group_title}>
            <label>CONTRACT INFORMATION</label>
          </Grid>
          <Grid container spacing={2}>
            {isFlorida && 
              <Grid item>
                <label>Deal Number:&nbsp;</label>{dealNumber.deal_number}
              </Grid>}
            {isNevada &&
              escrowTitleCompanyInfo.map((item: IDealRole) => 
                <Grid item>
                  <label>Escrow/Title Office email address:&nbsp;</label>{item.email}
                </Grid>
              )
            }
            <Grid item>
              <label>Listing ID:&nbsp;</label>{deal.context.deal_number?.text ?? deal.context.mls_number?.text ?? `Hippocket-${deal.number}`}
            </Grid>
            <Grid item>
              <label>Listing Address:&nbsp;</label>{deal.context.full_address?.text}
            </Grid>
            <Grid item>
              <label>Property Type:&nbsp;</label>{deal.context.property_type?.text}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item>
              <label>Contract {deal.property_type.is_lease ? 'Leased' : 'Sales'} Price:&nbsp;</label>
              ${deal.property_type.is_lease ? stylizeNumber(Number(deal.context.leased_price?.text)) : stylizeNumber(Number(deal.context.sales_price?.text))}
            </Grid>
            <Grid item>
              <label>Closing Date:&nbsp;</label>{deal.context.closing_date?.text}
            </Grid>
          </Grid>
        </Grid>
        {(escrowTitleCompanyInfo.length > 0) && <Grid container style={styles.group}>
          <Grid item xs={12} style={styles.group_title}>
            <label>{isFlorida ? 'Title/Closing Company' : 'Escrow Company'}</label>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <label>First Name:&nbsp;</label>{escrowTitleCompanyInfo[0].legal_first_name}
            </Grid>
            <Grid item xs={3}>
              <label>Last Name:&nbsp;</label>{escrowTitleCompanyInfo[0].legal_last_name}
            </Grid>
            <Grid item xs={3}>
              <label>Email Address:&nbsp;</label>{escrowTitleCompanyInfo[0].email}
            </Grid>
            <Grid item xs={3}>
              <label>Company Title:&nbsp;</label>{escrowTitleCompanyInfo[0].company_title}
            </Grid>
          </Grid>
        </Grid>}
        {isNevada && transCoordinator && 
          <Grid container style={styles.group}>
            <Grid item xs={12} style={styles.group_title}>
              <label>DE In-house Transaction Coordinator</label>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3}>{transCoordinator.trans_coordinator}</Grid>
              <Grid item xs={3}>{transCoordinator.email_address}</Grid>
            </Grid>
          </Grid>
        }

        {deal.property_type.label == "Referral" && isNevada && 
          <Grid container style={styles.group}>
            <Grid item xs={12} style={styles.group_title}>
              <label>DOCUMENT UPLOAD STATUS</label>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3}>Referral Agreement</Grid>
              <Grid item xs={3}>{Number(docStatus.referral_doc) === 1 ? "Yes" : "No"}</Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3}>Brokerage's W-9 form</Grid>
              <Grid item xs={3}>{Number(docStatus.brokerage_form) === 1 ? "Yes" : "No"}</Grid>
            </Grid>
          </Grid>
        }
        
        <Grid container style={styles.group}>
          <Grid item xs={12} style={styles.group_title}>
            <label>GCI AGENTS</label>
          </Grid>
          {(dealType === 'Buying' || dealType === 'Both') && 
            roleData.filter((roleItem: IRoleData) => roleItem.role == 'BuyerAgent' || roleItem.role == 'CoBuyerAgent' || roleItem.role == 'BuyerReferral').map(role => 
              <Grid container spacing={2} key={role.legal_full_name}>
                <Grid item xs={3}>{role.legal_full_name}</Grid>
                <Grid item xs={3}>{role.address}</Grid>
                <Grid item xs={3}>{dealType === 'Both' ? 'Buy & Listing Side' : 'Buy Side'}</Grid>
              </Grid>
          )}
          {(dealType === 'Selling' || dealType === 'Both') && 
            roleData.filter((roleItem: IRoleData) => roleItem.role == 'SellerAgent' || roleItem.role == 'CoSellerAgent' || roleItem.role == 'SellerReferral').map(role => 
            <Grid container spacing={2}>
              <Grid item xs={3}>{role.legal_full_name}</Grid>
              <Grid item xs={3}>{role.address}</Grid>
              <Grid item xs={3}>{dealType === 'Both' ? 'Buy & Listing Side' : 'Listing Side'}</Grid>
            </Grid>
          )}
        </Grid>
        
        {(nonGCIInsidePayments.length > 0 || nonGCIOutsidePayments.length > 0) && (
          <Grid container style={styles.group}>
            <Grid item xs={12} style={styles.group_title}>
              <label>NON-GCI AGENTS</label>
            </Grid>
            {nonGCIInsidePayments.map((item: IPayment, idx: number) =>
              item.de_paid_to && (
                <Grid container spacing={2} key={idx}>
                  <Grid item xs={3}>{item.de_paid_to}</Grid>
                  <Grid item xs={3}>{item.de_office_address}</Grid>
                  <Grid item xs={3}>{dealType === 'Both' ? 'Buy & Listing Side' : 'Buy Side'}</Grid>
                </Grid>
              )
            )}
            {nonGCIOutsidePayments.map((item: IPayment, idx: number) =>
              item.de_paid_to && (
                <Grid container spacing={2} key={idx}>
                  <Grid item xs={3}>{item.de_paid_to}</Grid>
                  <Grid item xs={3}>{item.de_office_address}</Grid>
                  <Grid item xs={3}>{dealType === 'Both' ? 'Buy & Listing Side' : 'Buy Side'}</Grid>
                </Grid>
              )
            )}
          </Grid>
        )}
        
        {((dealType === 'Buying' && 
            roles.filter((roleItem: IDealRole) => roleItem.role == 'SellerAgent' || roleItem.role == 'CoSellerAgent' || roleItem.role == 'SellerReferral').length > 0) ||
          (dealType === 'Selling' && 
            roles.filter((roleItem: IDealRole) => roleItem.role == 'BuyerAgent' || roleItem.role == 'CoBuyerAgent' || roleItem.role == 'BuyerReferral').length > 0))
        && (
          <Grid container style={styles.group}>
            <Grid item xs={12} style={styles.group_title}>
              <label>COBROKE AGENT(S)</label>
            </Grid>
            {(dealType === 'Buying') && 
              roles.filter((roleItem: IDealRole) => roleItem.role == 'SellerAgent' || roleItem.role == 'CoSellerAgent' || roleItem.role == 'SellerReferral').map(role => 
              <Grid container spacing={2}>
                <Grid item xs={3}>{role.legal_full_name}</Grid>
                <Grid item xs={3}>{role.company_title}</Grid>
                <Grid item xs={3}>Buy Side</Grid>
              </Grid>
            )}
            {(dealType === 'Selling') && 
              roles.filter((roleItem: IDealRole) => roleItem.role == 'BuyerAgent' || roleItem.role == 'CoBuyerAgent' || roleItem.role == 'BuyerReferral').map(role => 
              <Grid container spacing={2}>
                <Grid item xs={3}>{role.legal_full_name}</Grid>
                <Grid item xs={3}>{role.company_title}</Grid>
                <Grid item xs={3}>Listing Side</Grid>
              </Grid>
            )}
          </Grid>
        )}
        
        <Grid container style={styles.group}>
          <Grid item xs={12} style={styles.group_title}>
            <label>COMMISSION</label>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={2}>Gross Commission</Grid>
            <Grid item xs={2}>GCI To DE</Grid>
            <Grid item xs={3}>GCI To {deOfficeAddress}</Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={2}>% {stylizeNumber(BuySideCommissionRate + ListSideCommissionRate)}</Grid>
            <Grid item xs={2}>% {stylizeNumber(gciDePercent)}</Grid>
            <Grid item xs={3}>% {OfficeGCIPercent ? stylizeNumber(OfficeGCIPercent) : '0.00'}</Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={2}>$ {stylizeNumber(BuySideDealValue + ListSideDealValue)}</Grid>
            <Grid item xs={2}>$ {stylizeNumber(gciDeValue)}</Grid>
            <Grid item xs={3}>$ {OfficeGCIValue ? stylizeNumber(OfficeGCIValue) : '0.00'}</Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {dealData.gci_reason_select === 0 && commissionReason.Approved}
              {dealData.gci_reason_select === 1 && commissionReason.CoBroke}
              {dealData.gci_reason_select === 2 && dealData.gci_reason}
            </Grid>
          </Grid>
          <Grid container>
            <Grid container style={{margin: '5px 0'}}>
              <label>GCI SHARE BEFORE SPLIT</label>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: 3, marginLeft: 3 }}>
              {(dealType === 'Buying' || dealType === 'Both') && 
                roleData.filter((roleItem: IRoleData) => roleItem.role == 'BuyerAgent' || roleItem.role == 'CoBuyerAgent' || roleItem.role == 'BuyerReferral').map(role => 
                  <>
                    <Grid container>
                      <Grid item xs={2}>{role.legal_full_name}</Grid>
                      <Grid item xs={2}><b>Agent NO:</b> {role.agent_id}</Grid>
                      <Grid item xs={2}><b>Share %:</b> {role.share_percent != null ? stylizeNumber(Number(role.share_percent) * 100 / Number(totalPercentBuyerSide)) : stylizeNumber(Number(role.share_value) * 100 / Number(totalValueBuyerSide))}</Grid>
                      <Grid item xs={6}><b>Share $:</b> {role.share_value == null ? stylizeNumber(Number(price) * Number(role.share_percent) / 100) : stylizeNumber(parseFloat(role.share_value.toFixed(2)))}</Grid>
                    </Grid>
                    <Grid container>
                      <b>Notes:</b>&nbsp;{role.note}
                    </Grid>
                  </>
              )}
              {(dealType === 'Selling' || dealType === 'Both') && 
                roleData.filter((roleItem: IRoleData) => roleItem.role == 'SellerAgent' || roleItem.role == 'CoSellerAgent' || roleItem.role == 'SellerReferral').map(role => 
                  <>
                    <Grid container>
                      <Grid item xs={2}>{role.legal_full_name}</Grid>
                      <Grid item xs={2}><b>Agent NO:</b> {role.agent_id}</Grid>
                      <Grid item xs={2}><b>Share %:</b> {role.share_percent != null ? stylizeNumber(Number(role.share_percent) * 100 / Number(totalPercentSellerSide)) : stylizeNumber(Number(role.share_value) * 100 / Number(totalValueSellerSide))}</Grid>
                      <Grid item xs={6}><b>Share $:</b> {role.share_value == null ? stylizeNumber(parseFloat((Number(price) * Number(role.share_percent) / 100).toFixed(2))) : stylizeNumber(parseFloat(role.share_value.toFixed(2)))}</Grid>
                    </Grid>
                    <Grid container>
                      <b>Notes:</b>&nbsp;{role.note}
                    </Grid>
                  </>
              )}
            </Grid>
          </Grid>
        </Grid>
        
        <Grid container style={styles.group}>
          <Grid item xs={12} style={styles.group_title}>
            <label>REMITTANCE</label>
          </Grid>
          {(dealType === 'Buying' || dealType === 'Both') && (
            <>
              <Grid item xs={12}>
                <label>Form of Remittance</label> {buySideChecks.length > 0 && <span>CHECK(S)</span>}{Number(dealData.remittance_buy_side_bank_wire_amount) > 0 && <span>BANK WIRE</span>}
              </Grid>
              <Grid item xs={12}>
                {buySideChecks.length > 0 && <label>Deal side(s) for this check</label>}{Number(dealData.remittance_buy_side_bank_wire_amount) > 0 && <label>Deal side</label>} Buy Side
              </Grid>
              {buySideChecks.length > 0 && buySideChecks.map((item: IRemittanceChecks, idx: number) => 
                <Grid container spacing={2} key={idx}>
                  <Grid item><label>Check #</label>&nbsp;{item.check_num}</Grid>
                  <Grid item><label>Date on check</label>&nbsp;{(new Date(item.check_date)).toLocaleDateString()}</Grid>
                  <Grid item><label>Date check received</label>&nbsp;{(new Date(item.check_receive_date)).toLocaleDateString()}</Grid>
                  <Grid item><label>Amount $</label>{stylizeNumber(Number(item.amount))}</Grid>
                </Grid>
              )}
              {Number(dealData.remittance_buy_side_bank_wire_amount) > 0 && (
                <Grid item xs={12}>
                  <label>Amount</label>&nbsp;${stylizeNumber(Number(dealData.remittance_buy_side_bank_wire_amount))}
                </Grid>
              )}
            </>
          )}
          {(dealType === 'Selling' || dealType === 'Both') && (
            <>
              <Grid item xs={12} style={{ marginTop: '5px' }}>
                <label>Form of Remittance</label> {listingSideChecks.length > 0 && <span>CHECK(S)</span>}{Number(dealData.remittance_listing_side_bank_wire_amount) > 0 && <span>BANK WIRE</span>}
              </Grid>
              <Grid item xs={12}>
                {listingSideChecks.length > 0 && <label>Deal side(s) for this check</label>}{Number(dealData.remittance_listing_side_bank_wire_amount) > 0 && <label>Deal side</label>} Listing Side
              </Grid>
              {listingSideChecks.length > 0 && listingSideChecks.map((item: IRemittanceChecks, idx: number) => 
                <Grid container spacing={2} key={idx}>
                  <Grid item><label>Check #</label>&nbsp;{item.check_num}</Grid>
                  <Grid item><label>Date on check</label>&nbsp;{(new Date(item.check_date)).toLocaleDateString()}</Grid>
                  <Grid item><label>Date check received</label>&nbsp;{(new Date(item.check_receive_date)).toLocaleDateString()}</Grid>
                  <Grid item><label>Amount $</label>{stylizeNumber(Number(item.amount))}</Grid>
                </Grid>
              )}
              {Number(dealData.remittance_listing_side_bank_wire_amount) > 0 && (
                <Grid item xs={12}>
                  <label>Amount</label>&nbsp;${stylizeNumber(Number(dealData.remittance_listing_side_bank_wire_amount))}
                </Grid>
              )}
            </>
          )}
        </Grid>
        {(activeInsidePayments.length > 0 || activeOutsidePayments.length > 0) && (
          <Grid container style={styles.group}>
            <Grid item xs={12} style={styles.group_title}>
              <label>PAYMENTS AND FEES</label>
            </Grid>
            {activeInsidePayments.length > 0 && (
              <>
                <Grid item xs={12}>
                  <label>Inside Douglas Elliman Payments:</label>
                </Grid>
                {activeInsidePayments.map((item: IPayment, idx: number) => 
                  <Grid container key={idx} style={{ margin: '7px 0' }}>
                    <Grid item xs={4}>
                      <label>Payment type</label> {item.de_payment_type}
                    </Grid>
                    <Grid item xs={8}>
                      <label>Paid To:</label> {item.de_paid_to}
                    </Grid>
                    {item.de_paid_by.filter(paidByItem => paidByItem.payment_unit_type !== null).length > 0 && (
                      <>
                        <Grid item xs={1}>
                          <label>Paid By:</label>
                        </Grid>
                        <Grid item xs={11}>
                          {item.de_paid_by.filter(item => item.payment_unit_type !== null).map((paidByItem: IPaidByData, idx: number) =>
                            <Grid container style={{ marginTop: '5px' }} key={idx}>
                              <Grid item xs={3}>
                                {paidByItem.payment_by_name}
                                <b style={{ marginLeft: 10, fontSize: 13, color: '#ababab' }}>{paidByItem.role}</b>
                              </Grid>
                              <Grid item xs={2}>
                                {paidByItem.payment_unit_type == 0 ? `${stylizeNumber(Number(paidByItem.payment_value))}%` : `$${stylizeNumber(Number(paidByItem.payment_value))}`}
                              </Grid>
                              <Grid item xs={3}>
                                Calculated from: <b>{paidByItem.payment_calculated_from == 0 ? 'My GCI' : 'My NET'}</b>
                              </Grid>
                              <Grid item xs={3}>
                                Note: {paidByItem.payment_note}
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </>
                    )}
                  </Grid>
                )}
              </>
            )}
            {activeOutsidePayments.length > 0 && (
              <>
                <Grid item xs={12} style={{ marginTop: '5px' }}>
                  <label>Outside Douglas Elliman Payments:</label>
                </Grid>
                {activeOutsidePayments.map((item: IPayment, idx: number) => 
                  <Grid container key={idx} style={{ margin: '7px 0' }}>
                    <Grid item xs={4}>
                      <label>Payment type</label> {item.de_payment_type}
                    </Grid>
                    <Grid item xs={8}>
                      <label>Paid To:</label> {item.de_paid_to}
                    </Grid>
                    <Grid item xs={1}>
                      <label>Paid By:</label>
                    </Grid>
                    <Grid item xs={11}>
                      {item.de_paid_by.filter(item => item.payment_unit_type !== null).map((paidByItem: IPaidByData, idx: number) =>
                        <Grid container style={{ marginTop: '5px' }} key={idx}>
                          <Grid item xs={3}>
                            {paidByItem.payment_by_name}
                            <b style={{ marginLeft: 10, fontSize: 13, color: '#ababab' }}>{paidByItem.role}</b>
                          </Grid>
                          <Grid item xs={2}>
                            {paidByItem.payment_unit_type == 0 ? `${stylizeNumber(Number(paidByItem.payment_value))}%` : `$${stylizeNumber(Number(paidByItem.payment_value))}`}
                          </Grid>
                          <Grid item xs={3}>
                            Calculated from: <b>{paidByItem.payment_calculated_from == 0 ? 'My GCI' : 'My NET'}</b>
                          </Grid>
                          <Grid item xs={3}>
                            Note: {paidByItem.payment_note}
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        )}
        {isNevada && 
          <Grid container style={styles.group}>
            <Grid item xs={12} style={styles.group_title}>
              <label>Credit Info</label>
            </Grid>
            {(dealType === 'Buying' || dealType === 'Both') && 
              creditData.filter((creditItem: ICreditData) => creditItem.credit_side == "Buyer").map(credit => 
                <Grid container spacing={2} key={`${credit.credit_side}${credit.id}`}>
                  <Grid item xs={3}>{credit.credit_side}</Grid>
                  <Grid item xs={3}>{credit.credit_to}</Grid>
                  <Grid item xs={3}>{stylizeNumber(Number(credit.credit_amount))}</Grid>
                </Grid>
            )}
            {(dealType === 'Selling' || dealType === 'Both') && 
              creditData.filter((creditItem: ICreditData) => creditItem.credit_side == "Seller").map(credit => 
                <Grid container spacing={2} key={`${credit.credit_side}${credit.id}`}>
                  <Grid item xs={3}>{credit.credit_side}</Grid>
                  <Grid item xs={3}>{credit.credit_to}</Grid>
                  <Grid item xs={3}>{stylizeNumber(Number(credit.credit_amount))}</Grid>
                </Grid>
            )}
          </Grid>
        }
        {!isNYC && _feeData.length > 0 && (
          <Grid container style={styles.group} >
            <Grid item xs={12} style={styles.group_title}>
              <label>Fees</label>
            </Grid>
            {_feeData.map((item: IFeeData, id: number) => 
              (
                <Grid container xs={12} key={id}>
                  <Grid container xs={8}>
                    <Grid item xs={2}>
                      <label>Agents</label>
                    </Grid>
                    <Grid item xs={10} style={{display: 'inherit', alignItems: 'center'}}>
                      {item.agent_name}
                    </Grid>
                  </Grid>
                  <Grid container xs={8}>
                    <Grid item xs={2}>
                      <label>Deal Side</label>
                    </Grid>
                    <Grid item xs={10} style={{display: 'inherit', alignItems: 'center'}}>
                      {item.deal_side == 0? "Buy" : "List"}
                    </Grid>
                  </Grid>
                  <Grid container xs={8}>
                    <Grid item xs={2}>
                      <label>Fee Type</label>
                    </Grid>
                    <Grid item xs={10} style={{display: 'inherit', alignItems: 'center'}}>
                      {item.fee_type}
                    </Grid>
                  </Grid>
                  <Grid container xs={8}>
                    <Grid item xs={2}>
                      <label>Fee From</label>
                    </Grid>
                    <Grid item xs={10} style={{display: 'inherit', alignItems: 'center'}}>
                      {item.fee_from == 0? "Agent" : "Deal"}
                    </Grid>
                  </Grid>
                  <Grid container xs={8}>
                    <Grid item xs={2}>
                      <label>Fee Paid</label>
                    </Grid>
                    <Grid item xs={10} style={{display: 'inherit', alignItems: 'center'}}>
                      {item.fee_paid === 0? "Yes" : "No"}
                    </Grid>
                  </Grid>
                  <Grid container xs={8} style={{ marginTop: '5px', marginBottom: '10px' }}>
                    <Grid item xs={2}>
                      <label>Fee Amount</label>
                    </Grid>
                    {item.fee_unit == 0 && (
                      <Grid item xs={3} style={{display: 'inherit', alignItems: 'center'}}>
                        % {stylizeNumber(parseFloat(item.fee_amount_percentage))}
                      </Grid>
                    )}
                    {item.fee_unit == 1 && (
                      <Grid item xs={3} style={{display: 'inherit', alignItems: 'center'}}>
                        $ {stylizeNumber(parseFloat(item.fee_amount))}
                      </Grid>
                    )}
                    <Grid item xs={3} style={{display: 'inherit', alignItems: 'center'}}>
                      {item.fee_method == 0 ? "Off the agent net" : "Off the Top"}
                    </Grid>
                  </Grid>
                </Grid>
              )
            )}
          </Grid>
        )}
        
        {sellers.length > 0 && <Grid container style={styles.group}>
          <Grid item xs={12} style={styles.group_title}>
            <label>{deal.property_type.is_lease ? "LANDLORD(S)" : "SELLER(S)"}</label>
          </Grid>
          {sellers.map((item, idx) => 
            <React.Fragment key={idx}>
              <Grid item xs={3}>
                <label>{deal.property_type.is_lease ? "Landlord Name" : "Seller Name"}</label>
              </Grid>
              <Grid item xs={3}>
                {item.legal_full_name}
              </Grid>
            </React.Fragment>
          )}
        </Grid>}
        
        {buyers.length > 0 && <Grid container style={styles.group}>
          <Grid item xs={12} style={styles.group_title}>
            <label>{deal.property_type.is_lease ? "TENANT(S)" : "BUYER(S)"}</label>
          </Grid>
          {buyers.map((item, idx) => 
            <React.Fragment key={idx}>
              <Grid item xs={3}>
                <label>{deal.property_type.is_lease ? "Tenant Name" : "Buyer Name"}</label>
              </Grid>
              <Grid item xs={3}>
                {item.legal_full_name}
              </Grid>
            </React.Fragment>
          )}
        </Grid>}
        {notes.note.length > 0 && 
          <Grid container style={styles.group}>
            <Grid item xs={2}>
              <label>Notes</label>
            </Grid>
            <Grid item xs={3}>
              {notes.note}
            </Grid>
          </Grid>
        }
      </Grid>
      
      <Box style={{ marginTop: '20px' }}>
        <Button
          variant="contained"
          onClick={handlePrint}
          style={{
            backgroundColor: '#0fb78d',
            color: 'white',
          }}
        >
          Download
        </Button>
        {(dealData.status === '' || dealData.status === null) &&
          <Box
            component="span"
            style={{
              float: 'right',
              textAlign: 'right',
            }}
          >
            <Button
              variant="contained"
              onClick={handleClickApprove}
              style={{
                backgroundColor: '#0fb78d',
                color: 'white',
              }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              onClick={handleClickDecline}
              style={{
                marginLeft: 10,
                backgroundColor: '#050E21',
                color: 'white',
              }}
            >
              Decline
            </Button>
          </Box>
        }
      </Box>
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
  )
}

export default ReviewQuestion
