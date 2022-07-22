import { Request, Response } from "express";
import {
  ICombinedDealData,
  ICommissionData,
  IDealData,
} from "../../../../type";
import db from "../../../models/commissionAppDB";
import sync from "../../../services/de_deal_sync";
import Jsonb from "jsonb-builder";
const { AppDealModel, AppRoleModel, AppRemittanceCheckModel, DealModel } = db;

const saveAppData = async (data: any, model: any) => {
  const findRes = await model.findOne({
    where: { deal: data.deal },
  });
  if (findRes === null) {
    await model.create(data);
  } else {
    await model.update(data, {
      where: { deal: data.deal },
    });
  }
};

const readData = async (deal: string, model: any) => {
  const res = await model.findAll({
    where: {
      deal: deal,
    },
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  });
  return res;
};

const saveCommissionData = async (req: Request, res: Response) => {
  try {
    let allData: ICommissionData = req.body.data;
    let dealData = allData.dealData;
    let roleData = allData.roleData;
    let remittanceChecks = allData.remittanceChecks;
    // save appDealData
    await saveAppData(allData.dealData, AppDealModel);
    // save appRoleData
    for (let i = 0; i < roleData.length; i++) {
      await saveAppData(roleData[i], AppRoleModel);
    }
    // save appRemittanceCheckData
    for (let i = 0; i < remittanceChecks.length; i++) {
      await saveAppData(remittanceChecks[i], AppRemittanceCheckModel);
    }
    res.status(200).json({
      message: "successful",
      error: "no error",
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error,
    });
    console.log("error", error);
  }
};

const readCombinedAppData = async (deal: string) => {
  let dealData = await readData(deal, AppDealModel);
  let roleData = await readData(deal, AppRoleModel);
  let remittanceChecks = await readData(deal, AppRemittanceCheckModel);
  let allData: any = null;
  if (dealData.length > 0) {
    allData = {
      dealData: dealData[0],
      roleData: roleData,
      remittanceChecks: remittanceChecks,
    };
  }
  return allData;
};

const readCommissionData = async (req: Request, res: Response) => {
  try {
    let deal = req.body.deal;
    let allData = await readCombinedAppData(deal);
    res.status(200).json({
      message: "successful",
      data: allData,
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error,
    });
  }
};

const readDealData = async (deal: string, model: any) => {
  const res = await model.findOne({
    where: {
      deal: deal,
    },
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  });
  return res;
};

// send deal information and commission app data to DE
const sendDealData = async (deal: string) => {
  let data = await readCombinedData(deal);
  // await axios.post("http://DE-API", {
  //   data: data,
  // });
};

const saveDealData = async (deal: any) => {
  let jsonb = new Jsonb(deal);

  const findRes = await DealModel.findOne({
    where: { deal: deal.id },
  });
  if (findRes === null) {
    await DealModel.create({
      deal: deal.id,
      is_finalized: false,
      object: jsonb,
    });
  } else {
    await DealModel.update(
      { object: jsonb },
      {
        where: { deal: deal },
      }
    );
  }
};

const handleUpsertFromWebhook = async (deal: any) => {
  // upset data to commissionDB/de_deal
  await saveDealData(deal);
  // make de_deal data, sync with DE, upsert data to commissionDB/de_deal
  await sync(deal);
};

const readCombinedData = async (deal: string) => {
  let commissionData = await readCombinedAppData(deal);
  let dealData = await readData(deal, DealModel);
  let data: ICombinedDealData = {
    commissionData: commissionData,
    dealData: dealData,
  };
  return data;
};

const pushDealData = async (deal) => {
  const findRes = await DealModel.findOne({
    where: { deal: deal.id },
  });
  if (findRes === null) {
    await DealModel.create({
      deal: deal.id,
      is_finalized: false,
      object: null,
    });
  } else {
    await DealModel.update(
      { deal: deal.id, is_finalized: deal.is_finalized },
      {
        where: { deal: deal },
      }
    );
  }
};

const pushAllDealData = async (data: any) => {
  for (let i = 0; i < data.length; i++) {
    await pushDealData(data[i].dataValues);
  }
};

export default {
  handleUpsertFromWebhook,
  saveCommissionData,
  readCommissionData,
  readCombinedData,
  sendDealData,
  pushAllDealData,
};
