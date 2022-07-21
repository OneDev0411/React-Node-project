import { BRAND, DEAL, getContextFromDeal, getTokenURL } from "../../util";

import moment from "moment";
import _ from "lodash";
import states from "us-state-codes";

import rechatDB from "../models/rechatDB/index";
import commissionDB from "../models/commissionDB/index";
import mockupDeal from "./mockup_deal";
import axios from "axios";
import { QueryTypes } from "sequelize";

const getState = async (deal) => {
  const result = await commissionDB.DeDealModel.findOne({
    where: { deal },
  });

  return result?.dataValues;
};

const getToken = async () => {
  const result = await axios.get(getTokenURL);
  const { token } = result.data;
  return token;
};

const getRoleCommission = (deal, role) => {
  if (role.commission_dollar !== null) {
    return {
      PercentOrAmount: "Amount",
      Share: role.commission_dollar || 0,
    };
  }

  return {
    PercentOrAmount: "Percent",
    Share: role.commission_percentage || 0,
  };
};

const getCommissionValue = (total, role) => {
  if (role.commission_dollar !== null) return role.commission_dollar;

  return total * (role.commission_percentage / 100);
};

const getCommissionRate = (total, role) => {
  if (role.commission_percentage !== null) return role.commission_percentage;

  return (role.commission_dollar / total) * 100;
};

// NEED TO TEST
const save = async ({ deal, is_finalized = false }) => {
  console.log("deal++++++++++++++", deal);
  const findRes = await commissionDB.DeDealModel.findOne({
    where: { deal },
  });
  if (findRes === null) {
    await commissionDB.DeDealModel.create({ deal, is_finalized });
  } else {
    await commissionDB.DeDealModel.update(
      { deal, is_finalized },
      {
        where: { deal },
      }
    );
  }
};

const getRegionDetails = async (brand) => {
  try {
    const { dataValues } = await rechatDB.RegionModel.findOne({
      where: { brand: brand.id },
    });
    return dataValues;
  } catch (e) {
    console.log("ERROR:", e.message);
  }
};

const getOfficeDetails = async (brand) => {
  try {
    console.log("###ID:", brand.id);
    const { dataValues } = await rechatDB.OfficeModel.findOne({
      where: { brand: brand.id },
    });
    console.log("dataValues:", dataValues);
    return dataValues;
  } catch (e) {
    console.log("ERROR:", e.message);
  }
};

// const getAgentDetails = async (role_ids = ["cae39d20-110f-11ea-9c5d-027d31a1f7a0", "cb73df76-833c-11ea-9de1-027d31a1f7a0"], user_ids = ["50f23824-9d26-11eb-beca-027d2d7e1395", undefined]) => {
const getAgentDetails = async (role_ids, user_ids) => {
  try {
    // get de user data from user id in deal data
    const dataList = await rechatDB.sequelize.query(
      `SELECT
      de.users.user as user, 
      de.users.object->>'d365AgentId' as "AgentId", 
      de.users.object->'offices'->0->'businessLocations'->0->>'businessLocation' as "BusinessLocation"
      FROM de.users
      WHERE de.users.user = ANY($1::uuid[])`,
      {
        bind: [user_ids],
        type: QueryTypes.SELECT,
      }
    );

    // set empy data to roles without user
    const result = role_ids.map((role_id, index) => {
      let user_id = user_ids[index];
      if (user_id !== undefined) {
        let data = dataList.filter((data) => data.user == user_id);
        return {
          id: role_id,
          ...data[0],
        };
      } else {
        return {
          id: role_id,
          user: null,
          AgentID: null,
          BusinessLocation: null,
        };
      }
    });
    return result;
  } catch (e) {
    console.log("ERROR:", e.message);
  }
};

const isDoubleEnded = (deal) => {
  const ender_type = getContextFromDeal(deal, "ender_type");
  if (
    ender_type === DEAL.AGENT_DOUBLE_ENDER ||
    ender_type === DEAL.OFFICE_DOUBLE_ENDER
  )
    return true;

  return false;
};

const getLeaseAttributes = ({ deal, roles }) => {
  let ListSideSalesPrice, BuySideSalesPrice;
  let ListSideDealValue, BuySideDealValue;
  let ListSideCommissionRate, BuySideCommissionRate;

  const isSellside = (role) =>
    role.role === "SellerAgent" || role.role === "CoSellerAgent";
  const isBuyside = (role) =>
    role.role === "BuyerAgent" || role.role === "CoBuyerAgent";

  const leased_price = getContextFromDeal(deal, "leased_price");
  const sum = (s, n) => s + n;

  if (deal.deal_type === DEAL.SELLING) {
    ListSideSalesPrice = leased_price;

    ListSideDealValue = _.chain(roles)
      .filter(isSellside)
      .map((r) => getCommissionValue(leased_price, r))
      .reduce(sum)
      .value();

    ListSideCommissionRate = _.chain(roles)
      .filter(isSellside)
      .map((r) => getCommissionRate(leased_price, r))
      .reduce(sum)
      .value();
  }

  if (deal.deal_type === DEAL.BUYING || isDoubleEnded(deal)) {
    BuySideSalesPrice = leased_price;

    BuySideDealValue = _.chain(roles)
      .filter(isBuyside)
      .map((r) => getCommissionValue(leased_price, r))
      .reduce(sum)
      .value();

    BuySideCommissionRate = _.chain(roles)
      .filter(isBuyside)
      .map((r) => getCommissionRate(leased_price, r))
      .reduce(sum)
      .value();
  }

  const lease_begin = getContextFromDeal(deal, "lease_begin");
  const lease_end = getContextFromDeal(deal, "lease_end");

  const LeaseStartDate = lease_begin
    ? moment.utc(lease_begin).format("YYYY-MM-DD")
    : null;
  const LeaseEndDate = lease_end
    ? moment.utc(lease_end).format("YYYY-MM-DD")
    : null;

  const contract_date = getContextFromDeal(deal, "lease_executed");
  const ContractDate = contract_date
    ? moment.utc(contract_date).format("YYYY-MM-DD")
    : null;

  const MonthlyRent = getContextFromDeal(deal, "leased_price");
  const ListingPrice = getContextFromDeal(deal, "lease_price");

  const RenterName = _.chain(roles)
    .filter({
      role: "Tenant",
    })
    .map("legal_full_name")
    .value()
    .join(" & ")
    .slice(0, 60);

  const LandlordName = _.chain(roles)
    .filter({
      role: "Landlord",
    })
    .map("legal_full_name")
    .value()
    .join(" & ")
    .slice(0, 60);

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

    DealType: "Rentals",
  };
};

const getSaleAttributes = ({ deal, roles }) => {
  let ListSideSalesPrice,
    BuySideSalesPrice: string = "";
  let ListSideDealValue, BuySideDealValue;
  let ListSideCommissionRate, BuySideCommissionRate;

  const contract_date = getContextFromDeal(deal, "contract_date");
  const ContractDate = contract_date
    ? moment.utc(contract_date).format("YYYY-MM-DD")
    : null;

  const isSellside = (role) =>
    role.role === "SellerAgent" || role.role === "CoSellerAgent";
  const isBuyside = (role) =>
    role.role === "BuyerAgent" || role.role === "CoBuyerAgent";

  const sales_price = getContextFromDeal(deal, "sales_price");
  const sum = (s, n) => s + n;

  if (deal.deal_type === DEAL.SELLING) {
    ListSideSalesPrice = sales_price;
    ListSideDealValue = _.chain(roles)
      .filter(isSellside)
      .map((r) => getCommissionValue(sales_price, r))
      .reduce(sum)
      .value();

    ListSideCommissionRate = _.chain(roles)
      .filter(isSellside)
      .map((r) => getCommissionRate(sales_price, r))
      .reduce(sum)
      .value();
  }

  if (deal.deal_type === DEAL.BUYING || isDoubleEnded(deal)) {
    BuySideSalesPrice = sales_price;

    BuySideDealValue = _.chain(roles)
      .filter(isBuyside)
      .map((r) => getCommissionValue(sales_price, r))
      .reduce(sum)
      .value();

    BuySideCommissionRate = _.chain(roles)
      .filter(isBuyside)
      .map((r) => getCommissionRate(sales_price, r))
      .reduce(sum)
      .value();
  }

  const BuyerName = _.chain(roles)
    .filter({
      role: "Buyer",
    })
    .map("legal_full_name")
    .value()
    .join(" & ")
    .slice(0, 60);

  const SellerName = _.chain(roles)
    .filter({
      role: "Seller",
    })
    .map("legal_full_name")
    .value()
    .join(" & ")
    .slice(0, 60);

  const EscrowOfficer = _.chain(roles)
    .filter({
      role: "Title",
    })
    .map("legal_full_name")
    .value()
    .join(" & ")
    .slice(0, 60);

  const EscrowOfficerEmail = _.chain(roles)
    .filter({
      role: "Title",
    })
    .map("email")
    .first()
    .value();

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

    DealType: "Sales",
  };
};

const getBrandsFromDeal = (brand, brands) => {
  let { parent, ..._brand } = brand;
  brands.push(_brand);
  if (brand.parent !== null) {
    getBrandsFromDeal(brand.parent, brands);
  }
};

const sync = async (deal = mockupDeal) => {
  // const sync = async deal => {
  console.log("Syncing D365 for", deal.id);

  deal = mockupDeal;

  const token = await getToken();

  const state = await getState(deal.id);

  let brands = [];
  getBrandsFromDeal(deal.brand, brands);

  const region = _.find(brands, { brand_type: BRAND.REGION });
  const office = _.find(brands, { brand_type: BRAND.OFFICE });

  const property_type = deal.property_type;

  const roles = deal.roles;

  const sales_price = getContextFromDeal(deal, "sales_price");
  const leased_price = getContextFromDeal(deal, "leased_price");

  const type = property_type.is_lease ? "rental" : "sale";
  const update = state ? "/update" : "";
  const uri = `https://webapi.elliman.com/api/adc/postdeal/${type}${update}`;
  console.log("URL:", uri);

  const created_at = state ? state.created_at : new Date();
  const DealDate = moment.utc(created_at).format("YYYY-MM-DD");

  const isHippocket = !deal.listing;
  const ListingId =
    getContextFromDeal(deal, "mls_number") ?? `Hippocket-${deal.number}`;
  const Street = getContextFromDeal(deal, "street_address");
  const ZipCode = getContextFromDeal(deal, "postal_code");
  const PropertyType = property_type.label;

  /*
   * So, in case of Hip Pockets, we don't have Listing Date. Michael asked me to provide the DealDate for those cases.
   * In case of buy-side deals, we don't have listing date. In those cases, James asked me to provide executed date aka contract date.
   */
  const ListingDate =
    getContextFromDeal(deal, "list_date") ??
    (isHippocket ? DealDate : null) ??
    getContextFromDeal(deal, "contract_date") ??
    getContextFromDeal(deal, "lease_executed");

  const ListingPrice =
    getContextFromDeal(deal, "list_price") ??
    (isHippocket ? sales_price || leased_price : null);
  const UnitNum = getContextFromDeal(deal, "unit_number");
  const City = getContextFromDeal(deal, "city");

  // State parameter is supposed to be state code.
  // We either have state code, or have state name.
  // If we have state code, we use it. Otherwise we'll try to extract code from name
  const state_code = states.sanitizeStateCode(
    getContextFromDeal(deal, "state_code")
  );
  const state_name = getContextFromDeal(deal, "state").trim();
  let State = state_code;

  if (!State) State = states.sanitizeStateCode(state_name); //Maybe we've put state_code in state_name like state_name: TX

  if (!State)
    // Maybe we only have state name like this: state_name: Texas
    State = states.getStateCodeByStateName(
      states.sanitizeStateName(state_name)
    );

  if (!State) State = state_name; // Last attempt. Use whatever is in the state_name

  const closing_date =
    getContextFromDeal(deal, "closing_date") ??
    getContextFromDeal(deal, "lease_begin");
  const ClosingDate = closing_date
    ? moment.utc(closing_date).format("YYYY-MM-DD")
    : null;

  let DealSide = deal.deal_type === DEAL.SELLING ? "List" : "Buy";

  if (isDoubleEnded(deal)) DealSide = "Both";

  const leaseAttributes = property_type.is_lease
    ? getLeaseAttributes({ deal, roles })
    : {};
  const saleAttributes = !property_type.is_lease
    ? getSaleAttributes({ deal, roles })
    : {};

  const isAgent = (role) => {
    return [
      "SellerAgent",
      "CoSellerAgent",
      "SellerReferral",
      "BuyerAgent",
      "CoBuyerAgent",
      "BuyerReferral",
    ].includes(role.role);
  };

  const doesNeedCommission = (role) => {
    if (DealSide === "Both") return true;

    if (DealSide === "List")
      return ["SellerAgent", "CoSellerAgent", "SellerReferral"].includes(
        role.role
      );

    if (DealSide === "Buy")
      return ["BuyerAgent", "CoBuyerAgent", "BuyerReferral"].includes(
        role.role
      );

    return false;
  };

  const role_ids = _.map(roles, "id");
  const user_ids = _.map(_.map(roles, "user"), "id");

  const agent_details = await getAgentDetails(role_ids, user_ids);
  const region_details = await getRegionDetails(region);
  const office_details = await getOfficeDetails(office);

  const isInternal = (role) => {
    const details = _.find(agent_details, { id: role.id });
    return Boolean(details.AgentId);
  };

  const getDealSide = (role) => {
    return role.role === "SellerAgent" || role.role === "CoSellerAgent"
      ? "List"
      : "Buy";
  };

  const mapInternal = (role) => {
    const AgentType =
      role.role === "BuyerReferral" || role.role === "AgentReferral"
        ? "AgentReferral"
        : "Primary";

    if (!AgentType) return;

    const details = _.find(agent_details, { id: role.id });

    const { AgentId, BusinessLocation } = details;

    return {
      AgentType,
      AgentId,
      BusinessLocation,
      OfficeGCIAllocation: 100,
      CompanyName: role.company_title,
      DealSide: getDealSide(role),
      ...getRoleCommission(deal, role),
    };
  };

  const mapExternal = (role) => {
    const AgentType = "Referral";
    const Feebase = "Off_the_top";

    return {
      AgentType,
      DealSide: getDealSide(role),
      PayTo: "Vendor",
      VendorName: role.legal_full_name,
      CompanyName: role.company_title,
      Feebase,
      ...getRoleCommission(deal, role),
    };
  };

  const agents = _.chain(roles)
    .filter(isAgent)
    .filter(doesNeedCommission)
    .map((role) => (isInternal(role) ? mapInternal(role) : mapExternal(role)))
    .value();

  const body = {
    listing: {
      ListingId,
      Street,
      ZipCode,
      PropertyType,
      ListingDate,
      ListingPrice,
      UnitNum,
      City,
      State,
      ListingType: "Other",
      BusinessLocation: office_details.business_locations[0],
    },
    deal: {
      Source: "StudioPro",
      DealUniqueRef: `SP${deal.number}`,
      DealSide,
      LineOfBusiness: "Brokerage",
      ClosingDate,
      DealDate,
      PaidBy: region_details.paid_by,

      ...leaseAttributes,
      ...saleAttributes,
    },
    agents,
  };

  try {
    // console.log("body:", body);
    const res: any = await axios.post(uri, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("res:", res.data);
    if (res.data.successful) {
      await save({ deal: deal.id });
    }
    // console.log("Sync Result", res.data);
  } catch (e) {
    /*
     * When a deal goes goes from their API to D365, it's locked out and we wont be able to amend it there.
     * When this happens, mark it as finalized and we wont try sending more updates to D365.
     */
    console.log("error:", e);
    if (e.statusCode === 409) {
      await save({ deal });
      console.log("Sync Finalized");
      return;
    }

    // throw e;
  }
};

// export default sync;
sync();
// async function test() {
//   try {
//     await save({ deal: mockupDeal.id });
//   } catch(e) {
//     console.log('error:', e.message);
//   }
// }
// test();
