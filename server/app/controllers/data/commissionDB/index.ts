import { Request, Response } from "express";
import { ICombinedData, ICommissionData, IDealData } from "../../../../type";
import db from "../../../models/commissionDB";
import sync from "../../../services/de_deal_sync";
import Jsonb from "jsonb-builder";
const { CommissionDataModel, DealModel } = db;

const readData = async (deal: string, model: any) => {
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

const saveCommissionData = async (req: Request, res: Response) => {
  try {
    let totalData = req.body.data;
    let data: ICommissionData = {
      deal: totalData.dealData.deal,
      object: new Jsonb(totalData),
    };
    const findRes = await CommissionDataModel.findOne({
      where: { deal: data.deal },
    });
    if (findRes === null) {
      await CommissionDataModel.create(data);
    } else {
      await CommissionDataModel.update(data, {
        where: { deal: data.deal },
      });
    }
    await sendDealData(data.deal); // send deal information and commission app data to DE company
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
    const deal: string = req.body.deal;
    let data = await readData(deal, CommissionDataModel);
    let totalData;
    if (data !== null) {
      totalData = new Jsonb(data.object);
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
  let commissionData = await readData(deal, CommissionDataModel);
  let dealData = await readData(deal, DealModel);
  let data: ICombinedData = {
    commissionData: commissionData?.object,
    dealData: dealData?.object,
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
