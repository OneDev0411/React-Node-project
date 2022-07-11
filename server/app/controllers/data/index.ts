import { Request, Response } from "express";
import db from "../../config/db.config";
import { Op } from "sequelize";
import { IDealData, IRemittanceChecks, IRoleData } from "types";

const { DealDataModel, RoleDataModel, RemittanceChecksModel } = db;

const dealDataSave = async (data: IDealData) => {
  let result: any;
  const findRes = await DealDataModel.findOne({
    where: { deal_id: data.deal_id },
  });
  if (findRes === null) {
    result = await DealDataModel.create(data);
  } else {
    result = await DealDataModel.update(data, {
      where: { deal_id: data.deal_id },
    });
  }
  return result;
};

const roleDataRemove = async (deal_id: IRoleData["deal_id"]) => {
  let findRes = await RoleDataModel.destroy({
    where: {
      deal_id: deal_id,
    },
  });
  return findRes;
};

const roleDataSave = async (data: IRoleData) => {
  let result: any;
  const findRes = await RoleDataModel.findOne({
    where: {
      [Op.and]: [{ deal_id: data.deal_id }, { role_id: data.role_id }],
    },
  });
  if (findRes == null) {
    result = await RoleDataModel.create(data);
  } else {
    result = await RoleDataModel.update(data, {
      where: {
        [Op.and]: [{ deal_id: data.deal_id }, { role_id: data.role_id }],
      },
    });
  }
  return result;
};

const remittanceChecksRemove = async (deal_id: IRoleData["deal_id"]) => {
  let findRes = await RemittanceChecksModel.destroy({
    where: {
      deal_id: deal_id,
    },
  });
  return findRes;
};

const remittanceChecksSave = async (data: IRemittanceChecks) => {
  let result: any;
  const findRes = await RemittanceChecksModel.findOne({
    where: {
      deal_id: data.deal_id,
    },
  });
  if (findRes == null) {
    result = await RemittanceChecksModel.create(data);
  } else {
    result = await RemittanceChecksModel.update(data, {
      where: {
        deal_id: data.deal_id,
      },
    });
  }
  return result;
};

const totalSaveData = async (req: Request, res: Response) => {
  try {
    const totalData = req.body.data;
    const dealData: IDealData = totalData.dealData;
    const roleData: IRoleData[] = totalData.roleData;
    const remittanceChecks: IRemittanceChecks[] = totalData.remittanceChecks;

    await dealDataSave(dealData);
    await roleDataRemove(dealData.deal_id);
    for (let i = 0; i < roleData.length; i++) {
      await roleDataSave(roleData[i]);
    }
    await remittanceChecksRemove(dealData.deal_id);
    for (let i = 0; i < remittanceChecks.length; i++) {
      await remittanceChecksSave(remittanceChecks[i]);
    }
    res.status(200).json({
      message: "successful",
    });
  } catch (error) {
    res.status(200).json({
      message: "error",
      error: error,
    });
  }
};

const dealDataRead = async (deal_id: IDealData["deal_id"]) => {
  const res = await DealDataModel.findOne({
    where: {
      deal_id: deal_id,
    },
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  });
  return res;
};

const roleDataRead = async (deal_id: IDealData["deal_id"]) => {
  const res = await RoleDataModel.findAll({
    where: { deal_id: deal_id },
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  });
  return res;
};

const remittanceChecksRead = async (deal_id: IDealData["deal_id"]) => {
  const res = await RemittanceChecksModel.findAll({
    where: { deal_id: deal_id },
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  });
  return res;
};

const totalReadData = async (req: Request, res: Response) => {
  try {
    const deal_id = req.body.deal_id;

    let dealData: IDealData = await dealDataRead(deal_id);
    let roleData: IRoleData[] = await roleDataRead(deal_id);
    let remittanceChecks: IRemittanceChecks[] = await remittanceChecksRead(
      deal_id
    );
    const totalData = {
      dealData: dealData,
      roleData: roleData,
      remittanceChecks: remittanceChecks,
    };
    res.status(200).json({
      message: "successful",
      data: totalData,
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error,
    });
  }
};

export default {
  totalSaveData,
  totalReadData,
};
