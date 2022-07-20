import { Request, Response } from "express";
import { Op } from "sequelize";
import { IdealData } from "../../../../type";
import db from "../../../models/database2";
import { Model } from "sequelize";
import axios from "axios";

const saveDealData = async (data: IdealData, model: any) => {
  const findRes = await model.findAll({});
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

export default {};
