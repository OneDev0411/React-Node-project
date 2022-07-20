import { Request, Response } from "express";
import { IdealData } from "../../../../type";
import db from "../../../models/commissionDB";
import sync from "../../../services/de_deal_sync";
const { DealInfoModel, CommissionDataModel } = db;

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
    let data = {
      deal_id: totalData.dealData.deal_id,
      payload: JSON.stringify(totalData),
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
      totalData = JSON.parse(data.payload);
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
    deal_id: deal.deal.id,
    payload: JSON.stringify(deal),
  };
  // upsert data to commissionDB/deal
  await saveData(data, DealInfoModel);

  // make de_deal data, sync with DE, upsert data to commissionDB/de_deal
  await sync(deal);
};

const readCombinedData = async (deal_id: string) => {
  let commissionData = await readData(deal_id, CommissionDataModel);
  let dealInfo = await readData(deal_id, DealInfoModel);
  let data = {
    commissionData: commissionData?.payload,
    dealInfo: dealInfo?.payload,
  };
  return data;
};

export default {
  handleUpsertFromWebhook,
  saveCommissionData,
  readCommissionData,
  readCombinedData,
  sendDealData,
};
