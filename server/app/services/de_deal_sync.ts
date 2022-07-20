import { BRAND, DEAL, getContextFromDeal, getTokenURL } from "../../util"

import moment from 'moment'
// import request from 'request-promise-native'
import _ from 'lodash'
import states from 'us-state-codes';

import db from '../models/database1/index';
import mockupDeal from './mockup_deal'
import axios from "axios";
import { request } from "express";

const getState = async deal => {
  const rows = await db.DeDealModel.findOne({ deal });
  // const { rows } = await db.executeSql.promise('SELECT * FROM de.deals WHERE deal = $1', [deal])
  const [row] = rows
  return row
  // return {
  //   id: "c9f46245-2534-11ea-5635-027d31a17536",
  //   deal: "c9f46245-2534-11ea-5635-027d31a18632",
  //   is_finalized: false,
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // }
}

const getToken = async () => {
  const result = await axios.get(getTokenURL);
  const { token } = result.data;
  return token
}

const getRoleCommission = (deal, role) => {
  if (role.commission_dollar !== null) {
    return {
      PercentOrAmount: 'Amount',
      Share: role.commission_dollar || 0
    }
  }

  return {
    PercentOrAmount: 'Percent',
    Share: role.commission_percentage || 0
  }
}

const getCommissionValue = (total, role) => {
  if (role.commission_dollar !== null)
    return role.commission_dollar


  return total * (role.commission_percentage / 100)
}

const getCommissionRate = (total, role) => {
  if (role.commission_percentage !== null)
    return role.commission_percentage


  return (role.commission_dollar / total) * 100
}

const save = async ({ deal, is_finalized = false }) => {
  const findRes = await db.DeDealModel.findOne({
    where: { deal },
  });
  if (findRes === null) {
    await db.DeDealModel.create({ deal, is_finalized });
  } else {
    await db.DeDealModel.update({ deal, is_finalized }, {
      where: { deal },
    });
  }
  // return db.executeSql.promise(`INSERT INTO de.deals(deal, is_finalized) 
  // VALUES ($1, $2)
  // ON CONFLICT (deal) 
  // DO UPDATE SET is_finalized = EXCLUDED.is_finalized, updated_at = NOW()`, [
  // deal.id,
  // is_finalized
  // ])
}

// const getRegionDetails = async (brand): Promise<any> => {
// const { rows } = await db.executeSql.promise('SELECT * FROM de.regions WHERE brand = $1', [brand.id])
// return rows[0]
// }

// const getOfficeDetails = async (brand): Promise<any> => {
// const { rows } = await db.executeSql.promise('SELECT * FROM de.offices WHERE brand = $1', [brand.id])
// return rows[0]
// }

// const getAgentDetails = async (role_ids): Promise<any> => {
// const { rows } = await db.executeSql.promise(`SELECT
//     deals_roles.id,
//     public.users.id as user, 
//     de.users.object->>'d365AgentId' as "AgentId", 
//     de.users.object->'offices'->0->'businessLocations'->0->>'businessLocation' as "BusinessLocation"
//   FROM deals_roles
//   LEFT JOIN public.users ON LOWER(deals_roles.email) = LOWER(public.users.email)
//   LEFT JOIN de.users ON de.users.user = public.users.id
//   WHERE deals_roles.id = ANY($1::uuid[])`, [role_ids])
// return rows
// }

const isDoubleEnded = deal => {
  const ender_type = getContextFromDeal(deal, 'ender_type')
  if (ender_type === DEAL.AGENT_DOUBLE_ENDER || ender_type === DEAL.OFFICE_DOUBLE_ENDER)
    return true

  return false
}

const getLeaseAttributes = ({ deal, roles }) => {
  let ListSideSalesPrice, BuySideSalesPrice
  let ListSideDealValue, BuySideDealValue
  let ListSideCommissionRate, BuySideCommissionRate


  const isSellside = role => role.role === 'SellerAgent' || role.role === 'CoSellerAgent'
  const isBuyside = role => role.role === 'BuyerAgent' || role.role === 'CoBuyerAgent'

  const leased_price = getContextFromDeal(deal, 'leased_price')
  const sum = (s, n) => s + n

  if (deal.deal_type === DEAL.SELLING) {
    ListSideSalesPrice = leased_price

    ListSideDealValue = _.chain(roles)
      .filter(isSellside)
      .map(r => getCommissionValue(leased_price, r))
      .reduce(sum)
      .value()

    ListSideCommissionRate = _.chain(roles)
      .filter(isSellside)
      .map(r => getCommissionRate(leased_price, r))
      .reduce(sum)
      .value()
  }

  if (deal.deal_type === DEAL.BUYING || isDoubleEnded(deal)) {
    BuySideSalesPrice = leased_price

    BuySideDealValue = _.chain(roles)
      .filter(isBuyside)
      .map(r => getCommissionValue(leased_price, r))
      .reduce(sum)
      .value()


    BuySideCommissionRate = _.chain(roles)
      .filter(isBuyside)
      .map(r => getCommissionRate(leased_price, r))
      .reduce(sum)
      .value()
  }

  const lease_begin = getContextFromDeal(deal, 'lease_begin')
  const lease_end = getContextFromDeal(deal, 'lease_end')

  const LeaseStartDate = lease_begin ? moment.utc(lease_begin).format('YYYY-MM-DD') : null
  const LeaseEndDate = lease_end ? moment.utc(lease_end).format('YYYY-MM-DD') : null

  const contract_date = getContextFromDeal(deal, 'lease_executed')
  const ContractDate = contract_date ? moment.utc(contract_date).format('YYYY-MM-DD') : null

  const MonthlyRent = getContextFromDeal(deal, 'leased_price')
  const ListingPrice = getContextFromDeal(deal, 'lease_price')

  const RenterName = _.chain(roles)
    .filter({
      role: 'Tenant'
    })
    .map('legal_full_name')
    .value()
    .join(' & ')
    .slice(0, 60)

  const LandlordName = _.chain(roles)
    .filter({
      role: 'Landlord'
    })
    .map('legal_full_name')
    .value()
    .join(' & ')
    .slice(0, 60)

  return {
    ContractDate,

    LeaseStartDate,
    LeaseEndDate,

    MonthlyRent,
    ListingPrice,

    LandlordName,
    RenterName,

    ListSideSalesPrice,
    BuySideSalesPrice,
    ListSideDealValue,
    BuySideDealValue,
    ListSideCommissionRate,
    BuySideCommissionRate,

    DealType: 'Rentals'
  }
}

const getSaleAttributes = ({ deal, roles }) => {
  let ListSideSalesPrice, BuySideSalesPrice
  let ListSideDealValue, BuySideDealValue
  let ListSideCommissionRate, BuySideCommissionRate

  const contract_date = getContextFromDeal(deal, 'contract_date')
  const ContractDate = contract_date ? moment.utc(contract_date).format('YYYY-MM-DD') : null

  const isSellside = role => role.role === 'SellerAgent' || role.role === 'CoSellerAgent'
  const isBuyside = role => role.role === 'BuyerAgent' || role.role === 'CoBuyerAgent'

  const sales_price = getContextFromDeal(deal, 'sales_price')
  const sum = (s, n) => s + n

  if (deal.deal_type === DEAL.SELLING) {
    ListSideSalesPrice = sales_price
    ListSideDealValue = _.chain(roles)
      .filter(isSellside)
      .map(r => getCommissionValue(sales_price, r))
      .reduce(sum)
      .value()

    ListSideCommissionRate = _.chain(roles)
      .filter(isSellside)
      .map(r => getCommissionRate(sales_price, r))
      .reduce(sum)
      .value()
  }

  if (deal.deal_type === DEAL.BUYING || isDoubleEnded(deal)) {
    BuySideSalesPrice = sales_price

    BuySideDealValue = _.chain(roles)
      .filter(isBuyside)
      .map(r => getCommissionValue(sales_price, r))
      .reduce(sum)
      .value()


    BuySideCommissionRate = _.chain(roles)
      .filter(isBuyside)
      .map(r => getCommissionRate(sales_price, r))
      .reduce(sum)
      .value()
  }

  const BuyerName = _.chain(roles)
    .filter({
      role: 'Buyer'
    })
    .map('legal_full_name')
    .value()
    .join(' & ')
    .slice(0, 60)

  const SellerName = _.chain(roles)
    .filter({
      role: 'Seller'
    })
    .map('legal_full_name')
    .value()
    .join(' & ')
    .slice(0, 60)

  const EscrowOfficer = _.chain(roles)
    .filter({
      role: 'Title'
    })
    .map('legal_full_name')
    .value()
    .join(' & ')
    .slice(0, 60)

  const EscrowOfficerEmail = _.chain(roles)
    .filter({
      role: 'Title'
    })
    .map('email')
    .first()
    .value()

  return {
    ContractDate,

    ListSideSalesPrice,
    BuySideSalesPrice,
    ListSideDealValue,
    BuySideDealValue,
    ListSideCommissionRate,
    BuySideCommissionRate,

    BuyerName,
    SellerName,
    EscrowOfficer,
    EscrowOfficerEmail,

    DealType: 'Sales'
  }
}

const sync = async (deal = mockupDeal) => {
  // const sync = async (deal, brand_ids) => {
  // Context.log('Syncing D365 for', deal.id)
  deal = mockupDeal;

  const token = await getToken()

  const state = await getState(deal.id)
  // const brands = deal.brands;

  // const region = _.find(brands, { brand_type: BRAND.REGION })
  // const office = _.find(brands, { brand_type: BRAND.OFFICE })

  const property_type = deal.property_type;

  const roles = deal.roles;

  const sales_price = getContextFromDeal(deal, 'sales_price')
  const leased_price = getContextFromDeal(deal, 'leased_price')

  const type = property_type.is_lease ? 'rental' : 'sale'
  const update = ''
  // const update = state ? '/update' : ''
  const uri = `https://webapi.elliman.com/api/adc/postdeal/${type}${update}`
  const created_at = state ? state.created_at : new Date()
  const DealDate = moment.utc(created_at).format('YYYY-MM-DD')

  const isHippocket = !deal.listing
  const ListingId = getContextFromDeal(deal, 'mls_number') ?? `Hippocket-${deal.number}`
  const Street = getContextFromDeal(deal, 'street_address')
  const ZipCode = getContextFromDeal(deal, 'postal_code')
  const PropertyType = property_type.label

  /*
   * So, in case of Hip Pockets, we don't have Listing Date. Michael asked me to provide the DealDate for those cases.
   * In case of buy-side deals, we don't have listing date. In those cases, James asked me to provide executed date aka contract date.
   */
  console.log("###############:", getContextFromDeal(deal, 'list_date'));
  const ListingDate = getContextFromDeal(deal, 'list_date')
    ?? (isHippocket ? DealDate : null)
    ?? getContextFromDeal(deal, 'contract_date')
    ?? getContextFromDeal(deal, 'lease_executed')

  const ListingPrice = getContextFromDeal(deal, 'list_price') ?? (isHippocket ? (sales_price || leased_price) : null)
  const UnitNum = getContextFromDeal(deal, 'unit_number')
  const City = getContextFromDeal(deal, 'city')

  // State parameter is supposed to be state code.
  // We either have state code, or have state name.
  // If we have state code, we use it. Otherwise we'll try to extract code from name
  const state_code = states.sanitizeStateCode(getContextFromDeal(deal, 'state_code'))
  const state_name = getContextFromDeal(deal, 'state').trim()
  let State = state_code

  if (!State)
    State = states.sanitizeStateCode(state_name) //Maybe we've put state_code in state_name like state_name: TX

  if (!State) // Maybe we only have state name like this: state_name: Texas
    State = states.getStateCodeByStateName(states.sanitizeStateName(state_name))

  if (!State)
    State = state_name // Last attempt. Use whatever is in the state_name

  const closing_date = getContextFromDeal(deal, 'closing_date') ?? getContextFromDeal(deal, 'lease_begin')
  const ClosingDate = closing_date ? moment.utc(closing_date).format('YYYY-MM-DD') : null

  let DealSide = deal.deal_type === DEAL.SELLING ? 'List' : 'Buy'

  if (isDoubleEnded(deal))
    DealSide = 'Both'


  const leaseAttributes = property_type.is_lease ? getLeaseAttributes({ deal, roles }) : {}
  const saleAttributes = !property_type.is_lease ? getSaleAttributes({ deal, roles }) : {}

  const isAgent = role => {
    return [
      'SellerAgent',
      'CoSellerAgent',
      'SellerReferral',

      'BuyerAgent',
      'CoBuyerAgent',
      'BuyerReferral',
    ].includes(role.role)
  }

  const doesNeedCommission = role => {
    if (DealSide === 'Both')
      return true

    if (DealSide === 'List')
      return [
        'SellerAgent',
        'CoSellerAgent',
        'SellerReferral'
      ].includes(role.role)

    if (DealSide === 'Buy')
      return [
        'BuyerAgent',
        'CoBuyerAgent',
        'BuyerReferral',
      ].includes(role.role)
  }

  const role_ids = _.map(roles, 'id')

  // const agent_details = await getAgentDetails(role_ids)
  const agent_details = []
  // const region_details = await getRegionDetails(region)
  // const office_details = await getOfficeDetails(office)

  const isInternal = role => {
    const details = _.find(agent_details, { id: role.id })
    return true;
    // return Boolean(details.AgentId)
  }

  const getDealSide = role => {
    return (role.role === 'SellerAgent' || role.role === 'CoSellerAgent') ? 'List' : 'Buy'
  }

  const mapInternal = role => {
    const AgentType = (role.role === 'BuyerReferral' || role.role === 'AgentReferral') ? 'AgentReferral' : 'Primary'

    if (!AgentType)
      return

    // const details = _.find(agent_details, { id: role.id })

    // const { AgentId, BusinessLocation } = details

    return {
      AgentType,
      // AgentId,
      // BusinessLocation,
      'OfficeGCIAllocation': 100,
      CompanyName: role.company_title,
      DealSide: getDealSide(role),
      ...getRoleCommission(deal, role)
    }
  }

  const mapExternal = role => {
    const AgentType = 'Referral'
    const Feebase = 'Off_the_top'

    return {
      AgentType,
      DealSide: getDealSide(role),
      PayTo: 'Vendor',
      VendorName: role.legal_full_name,
      CompanyName: role.company_title,
      Feebase,
      ...getRoleCommission(deal, role)
    }
  }

  const agents = _.chain(roles)
    .filter(isAgent)
    // .filter(doesNeedCommission)
    .map(role => isInternal(role) ? mapInternal(role) : mapExternal(role))
    .value()

  const body = {
    listing: {
      ListingId,
      Street,
      ZipCode,
      PropertyType,
      ListingDate: "2022-02-02",
      ListingPrice: 30000,
      UnitNum,
      City,
      State,
      ListingType: 'Other',
      BusinessLocation: "business_location"
      // BusinessLocation: office_details.business_locations[0]
    },
    deal: {
      Source: 'StudioPro',
      DealUniqueRef: `SP${deal.number}`,
      DealSide,
      'LineOfBusiness': 'Brokerage',
      ClosingDate,
      DealDate,
      // PaidBy: region_details.paid_by,
      PaidBy: "payroll",
      
      ...leaseAttributes,
      ...saleAttributes,
      
      // custom code
      LeaseStartDate: "2022-01-01",
      LeaseEndDate: "2022-01-01",
      MonthlyRent: 30000,
      ListSideDealValue: 10000,
      ListSideCommissionRate: 3,
    },
    agents: agents.map(agent => {
      return { ...agent, AgentID: "test", BusinessLocation: "test", OfficeGCIAllocation: 10 }
    })
  }

  try {
    console.log('body:', body);
    const res: any = await axios.post(uri, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // console.log('request:', request);
    console.log('res:', res.data);
  } catch (e) {
    console.log('error:', e.response.data);
  }
}

//   try {
//     console.log('body:', body);
//     // const res = await request({
//     //   uri,
//     //   headers: {
//     //     Authorization: `Bearer ${token}`
//     //   },
//     //   json: true,
//     //   method: 'post',
//     //   body
//     // })
//     const res: any = await axios.post(uri, body, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     console.log('res:', res);
//     if (res.successful)
//       await save({ deal })
//     console.log('Sync Result', res);
//     // Context.log('Sync Result', res)
//   } catch (e) {

//     /*
//      * When a deal goes goes from their API to D365, it's locked out and we wont be able to amend it there.
//      * When this happens, mark it as finalized and we wont try sending more updates to D365.
//      */
//     console.log('error:', e.message);
//     if (e.statusCode === 409) {
//       await save({ deal, is_finalized: true })
//       console.log('Sync Finalized');
//       // Context.log('Sync Finalized')
//       return
//     }

//     throw e
//   }
// }

// const sync = async (deal, brand_ids) => {
//   const state = await getState(deal.id)
//   if (state?.is_finalized)
//     return

//   await queue(deal, brand_ids)
// }

// export default sync;
// sync();
console.log(getState("17013336-d079-11ec-a6b2-0271a4acc769"));

// module.exports = {
  // sync
// }
