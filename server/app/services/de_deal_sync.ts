import { BRAND, DEAL, getContextFromDeal, getTokenURL } from "../../util";

import moment from "moment";
import _ from "lodash";
import states from "us-state-codes";

import rechatDB from "../models/rechatDB/index";
import commissionDB from "../models/commissionAppDB/index";
import axios from "axios";
import { QueryTypes } from "sequelize";

const getState = async (deal: any) => {
  const result = await commissionDB.DealModel.findOne({
    where: { deal },
  });

  return result?.dataValues;
};

const getApprovalInfo = async (deal: any) => {
  const result = await commissionDB.AppDealModel.findOne({
    where: { deal },
  });

  return { approval_request_date: result?.approval_request_date, status: result?.status };
};

const getAgentIdFromUserId = async (user_id) => {
  try {
    // get de user data from user id in deal data
    const dataList = await rechatDB.sequelize.query(
      `SELECT
      de.users.object->>'d365AgentId' as "AgentId"
      FROM de.users
      WHERE de.users.user = $1::uuid`,
      {
        bind: [user_id],
        type: QueryTypes.SELECT,
      }
    );

    return dataList.length ? dataList[0].AgentId : null;
  } catch (e) {
    console.log("ERROR:", e.message);
  }
}

const getAgentsFromPayments = async (deal, roles) => {
  const payments = await commissionDB.AppPaymentModel.findAll({
    where: {deal},
  });
  const agents: any = [];
  const role_ids = _.map(roles, "id");
  const user_ids = _.map(_.map(roles, "user"), "id");

  const agent_details = await getAgentDetails(role_ids, user_ids);

  await Promise.all(payments.map(async (payment) => {
    let paidToAgentId = null; 
    if (payment.de_payment_type == "Team Member")
      paidToAgentId = await getAgentIdFromUserId(payment.de_paid_to_deUserId);
    payment.de_paid_by.map(item => {
      if (item.payment_value) {
        if (payment.de_payment_type == "Team Member") {
          const details = _.find(agent_details, { id: item.roleId });
          const { AgentId } = details;
          agents.push({
            DealAgentRef: AgentId,
            AgentType: "AgentReferral",
            AgentId: paidToAgentId,
            DealSide: item.role === "SellerAgent" || item.role === "CoSellerAgent" ? "List" : "Buy",
            Feebase: item.payment_calculated_from === 0 ? "Off_the_top" : "Off_the_agent_net",
            PercentOrAmount: item.payment_unit_type === 0 ? "Percent" : "Amount",
            Share: item.payment_value,
          });
        } else {
          agents.push({
            AgentType: "Referral",
            DealSide: item.role === "SellerAgent" || item.role === "CoSellerAgent" ? "List" : "Buy",
            PayTo: "Vendor",
            VendorName: payment.de_paid_to,
            CompanyName: payment.de_payment_company,
            Feebase: item.payment_calculated_from === 0 ? "Off_the_top" : "Off_the_agent_net",
            PercentOrAmount: item.payment_unit_type === 0 ? "Percent" : "Amount",
            Share: item.payment_value,
          });
        }
      }
    });
  }));

  return agents;
};

const getToken = async () => {
  const result = await axios.get(getTokenURL);
  const { token } = result.data;
  return token;
};

const getRoleCommission = (role) => {
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

const save = async ({ deal, is_finalized = false }) => {
  const findRes = await commissionDB.DealModel.findOne({
    where: { deal },
  });
  if (findRes === null) {
    await commissionDB.DealModel.create({ deal, is_finalized });
  } else {
    await commissionDB.DealModel.update(
      { deal, is_finalized },
      {
        where: { deal },
      }
    );
  }
};

const getRegionDetails = async (brand) => {
  try {
    const result = await rechatDB.RegionModel.findOne({
      where: { brand: brand.id },
    });
    return result?.dataValues;
  } catch (e) {
    console.log("ERROR:", e.message);
  }
};

const getOfficeDetails = async (brand) => {
  try {
    const result = await rechatDB.OfficeModel.findOne({
      where: { brand: brand.id },
    });
    return result?.dataValues;
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
      if (
        user_id !== undefined &&
        user_id !== "undefined" &&
        dataList.length > 0
      ) {
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

  const BuySideAgency = _.find(roles, isBuyside).company_title;
  const ListSideAgency = _.find(roles, isSellside).company_title;
  const BuyerAgent = _.find(roles, isBuyside).legal_full_name;
  const SellerAgent = _.find(roles, isSellside).legal_full_name;

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
    ListSideDealValue: parseFloat(ListSideDealValue.toFixed(2)),
    BuySideDealValue: parseFloat(BuySideDealValue.toFixed(2)),
    ListSideCommissionRate: parseFloat(ListSideCommissionRate.toFixed(2)),
    BuySideCommissionRate: parseFloat(BuySideCommissionRate.toFixed(2)),

    DealType: "Rentals",

    GrossCommissionPercent: parseFloat((deal.deal_type === DEAL.SELLING ? ListSideCommissionRate : BuySideCommissionRate).toFixed(2)),
    CoBrokeName: deal.deal_type === DEAL.SELLING ? BuyerAgent : SellerAgent,
    CoBrokeDealSide: deal.deal_type === DEAL.SELLING ? 'Buy' : 'List',
    CoBrokeAgency: deal.deal_type === DEAL.SELLING ? BuySideAgency : ListSideAgency,
    CoBrokeCommission: parseFloat((deal.deal_type === DEAL.SELLING ? BuySideCommissionRate : ListSideCommissionRate).toFixed(2)),
    TenantFee: 0,
    OwnerPays: 0
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

  const BuySideAgency = _.find(roles, isBuyside).company_title;
  const ListSideAgency = _.find(roles, isSellside).company_title;
  const BuyerAgent = _.find(roles, isBuyside).legal_full_name;
  const SellerAgent = _.find(roles, isSellside).legal_full_name;
  
  return {
    ContractDate,

    ListSideSalesPrice,
    BuySideSalesPrice,
    ListSideDealValue: parseFloat(ListSideDealValue.toFixed(2)),
    BuySideDealValue: parseFloat(BuySideDealValue.toFixed(2)),
    ListSideCommissionRate: parseFloat(ListSideCommissionRate.toFixed(2)),
    BuySideCommissionRate: parseFloat(BuySideCommissionRate.toFixed(2)),

    BuyerName,
    SellerName,
    EscrowOfficer,
    EscrowOfficerEmail,

    DealType: "Sales",

    GrossCommissionPercent: parseFloat((deal.deal_type === DEAL.SELLING ? ListSideCommissionRate : BuySideCommissionRate).toFixed(2)),
    CoBrokeName: deal.deal_type === DEAL.SELLING ? BuyerAgent : SellerAgent,
    CoBrokeDealSide: deal.deal_type === DEAL.SELLING ? 'Buy' : 'List',
    CoBrokeAgency: deal.deal_type === DEAL.SELLING ? BuySideAgency : ListSideAgency,
    CoBrokeCommission: parseFloat((deal.deal_type === DEAL.SELLING ? BuySideCommissionRate : ListSideCommissionRate).toFixed(2)),
    TenantFee: 0,
    OwnerPays: 0
  };
};

const getBrandsFromDeal = (brand, brands) => {
  let { parent, ..._brand } = brand;
  brands.push(_brand);
  if (brand.parent !== null) {
    getBrandsFromDeal(brand.parent, brands);
  }
};

const sync = async (deal) => {
  if (!deal.faired_at)
    return; 

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
  const uri = `${process.env.API_URL}/api/v2/dynamics/postdeal/${type}${update}`;

  const created_at = state ? state.created_at : new Date();
  const DealDate = moment.utc(created_at).format("YYYY-MM-DD");

  const isHippocket = !deal.listing;
  const ListingId = getContextFromDeal(deal, 'deal_number') ?? getContextFromDeal(deal, 'mls_number') ?? `Hippocket-${deal.number}`
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
  const state_name = getContextFromDeal(deal, "state")?.trim();
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
  
  const approvalInfo = await getApprovalInfo(deal.id);
  const ApprovalRequestDate = approvalInfo.approval_request_date;

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

  const totalPercentBuySide = _.chain(roles)
    .filter(isAgent)
    .filter(doesNeedCommission)
    .filter((role) => ["BuyerAgent", "CoBuyerAgent"].includes(role.role))
    .reduce((totalValue, item) => {
      return parseFloat((Number(totalValue) + Number(item.commission_percentage ? item.commission_percentage : Number(item.commission_dollar) / Number(sales_price) * 100)).toFixed(3));
    }, 0);
  const totalPercentSellSide = _.chain(roles)
  .filter(isAgent)
  .filter(doesNeedCommission)
  .filter((role) => ["SellerAgent", "CoSellerAgent"].includes(role.role))
  .reduce((totalValue, item) => {
    return parseFloat((Number(totalValue) + Number(item.commission_percentage ? item.commission_percentage : Number(item.commission_dollar) / Number(sales_price) * 100)).toFixed(3));
  }, 0);

  const mapInternal = (role, totalPercent) => {
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
      OfficeGCIAllocation: parseFloat((100 * Number(role.commission_percentage ? role.commission_percentage : Number(role.commission_dollar) / Number(sales_price) * 100) / totalPercent).toFixed(2)),
      CompanyName: role.company_title,
      DealSide: getDealSide(role),
      ...getRoleCommission(role),
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
      ...getRoleCommission(role),
    };
  };

  let agents = _.chain(roles)
    .filter(isAgent)
    .filter(doesNeedCommission)
    .map((role) => (isInternal(role) ? mapInternal(role, getDealSide(role) === "List" ? totalPercentSellSide : totalPercentBuySide) : mapExternal(role)))
    .value();

  const agentsFromPayments = await getAgentsFromPayments(deal.id, roles); 
  agents = [...agents, ...agentsFromPayments];

  const body = {
    listing: {
      ListingId,
      Street,
      ZipCode,
      PropertyType,
      ListingDate,
      ListingPrice,
      OriginalListingPrice: ListingPrice,
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
      ApprovalRequestDate,
      Status: approvalInfo.status !== "Approved" ? "Draft" : region_details.status,
      DealCreatedBy: "N/A",
      ProjectedClosingDate: DealDate,

      ...leaseAttributes,
      ...saleAttributes,
    },
    agents,
  };
  console.log("uri: ", uri);
  console.log("body: ", body);

  try {
    const res: any = await axios.post(uri, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200) {
      await save({ deal: deal.id });
    }
    console.log("Sync Result", res.data);
  } catch (e) {
    /*
     * When a deal goes goes from their API to D365, it's locked out and we wont be able to amend it there.
     * When this happens, mark it as finalized and we wont try sending more updates to D365.
     */
    console.log("error:", e);
    console.log("error:", e.response.data.errors);
    if (e.statusCode === 409) {
      await save({ deal });
      console.log("Sync Finalized");
      return;
    }

    // throw e;
  }
};

export default sync;
