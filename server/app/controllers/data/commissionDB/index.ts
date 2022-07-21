import { Request, Response } from "express";
import { ICombinedData, IdealData } from "../../../../type";
import db from "../../../models/commissionDB";
import sync from "../../../services/de_deal_sync";
import { JSONB, Model, Sequelize } from "sequelize";
const { DealInfoModel, CommissionDataModel, DeDealModel } = db;

const saveData = async (data: IdealData, model: any) => {
  const findRes = await model.findOne({
    where: { deal_id: data.deal_id },
  });
  if (findRes === null) {
    await model.create(data);
  } else {
    await model.update(data, {
      where: { deal_id: data.deal_id },
    });
  }
};

const readData = async (deal_id: string, model: any) => {
  const res = await model.findOne({
    where: {
      deal_id: deal_id,
    },
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  });
  return res;
};

// send deal information and commission app data to DE
const sendDealData = async (deal_id: string) => {
  let data = await readCombinedData(deal_id);
  // await axios.post("http://DE-API", {
  //   data: data,
  // });
};

const saveCommissionData = async (req: Request, res: Response) => {
  try {
    let totalData = req.body.data;
    let data: IdealData = {
      deal_id: totalData.dealData.deal_id,
      object: JSON.stringify(totalData),
    };
    await saveData(data, CommissionDataModel);
    await sendDealData(data.deal_id); // send deal information and commission app data to DE company
    res.status(200).json({
      message: "successful",
      error: "no error",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "error",
      error: error,
    });
  }
};

const readCommissionData = async (req: Request, res: Response) => {
  try {
    const deal_id: string = req.body.deal_id;
    let data = await readData(deal_id, CommissionDataModel);
    let totalData;
    if (data !== null) {
      totalData = JSON.parse(data.object);
    } else {
      totalData = null;
    }
    res.status(200).json({
      message: "successful",
      data: totalData,
    });
  } catch (error) {
    console.log("error", error);
    res.status(200).json({
      message: "error",
      error: error,
    });
  }
};

const handleUpsertFromWebhook = async (deal: any) => {
  let data = {
    deal_id: deal.id,
    object: JSON.stringify(deal),
  };
  // upsert data to commissionDB/de_deal
  await saveData(data, DealInfoModel);

  // make de_deal data, sync with DE, upsert data to commissionDB/de_deal
  await sync(deal);
};

const readCombinedData = async (deal_id: string) => {
  let commissionData = await readData(deal_id, CommissionDataModel);
  let dealInfo = await readData(deal_id, DealInfoModel);
  let data: ICombinedData = {
    commissionData: commissionData?.object,
    dealInfo: dealInfo?.object,
  };
  return data;
};

const saveAllData = async (data: any, model: any) => {
  for (let i = 0; i < data.length; i++) {
    let temp = data[i].dataValues;
    const findRes = await model.findOne({
      where: { deal: temp.deal },
    });
    if (findRes === null) {
      await model.create(temp);
    } else {
      await model.update(temp, {
        where: { deal: temp.deal },
      });
    }
  }
};

export default {
  handleUpsertFromWebhook,
  saveCommissionData,
  readCommissionData,
  readCombinedData,
  sendDealData,
  saveAllData,
};
