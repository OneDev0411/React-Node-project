import { Request, Response } from "express";
import { Op } from "sequelize";
import { IdealData } from "../../../type";
import db from "../../models";
import { Model } from "sequelize";
const { DealInfoModel, CommissionDataModel } = db;

const saveDealData = async (data: IdealData, model: any) => {
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

const readDealData = async (deal_id: string, model: any) => {
  const res = await model.findOne({
    where: {
      deal_id: deal_id,
    },
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  });
  return res;
};

const saveCommissionData = async (req: Request, res: Response) => {
  try {
    let totalData = req.body.data;
    let data = {
      deal_id: totalData.dealData.deal_id,
      payload: JSON.stringify(totalData),
    };
    await saveDealData(data, CommissionDataModel);
    res.status(200).json({
      message: "successful",
      error: "no error",
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error,
    });
  }
};

const readCommissionData = async (req: Request, res: Response) => {
  try {
    const deal_id: string = req.body.deal_id;
    let data = await readDealData(deal_id, CommissionDataModel);
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

const saveDealFromWebhook = async (payload: any) => {
  let data = {
    deal_id: payload.deal.id,
    payload: JSON.stringify(payload),
  };
  await saveDealData(data, DealInfoModel);
};

export default {
  saveDealFromWebhook,
  saveCommissionData,
  readCommissionData,
};
