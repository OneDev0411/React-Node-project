import { Request, Response } from "express";
import { Op } from "sequelize";
import { IDealData } from "types";
import db from "../../models";
const { DealInfoModel } = db;

const saveData = async (data: any) => {
  let result: any;
  const findRes = await DealInfoModel.findOne({
    where: { deal_id: data.deal_id },
  });
  if (findRes === null) {
    result = await DealInfoModel.create(data);
  } else {
    result = await DealInfoModel.update(data, {
      where: { deal_id: data.deal_id },
    });
  }
  return result;
};

const readData = async (data: any) => {
  console.log("data", data.deal_id);
  const res = await DealInfoModel.findOne({
    where: { deal_id: data.deal_id },
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  });
  console.log("res", res);
  return res;
};

export default {
  saveData,
  readData,
};
