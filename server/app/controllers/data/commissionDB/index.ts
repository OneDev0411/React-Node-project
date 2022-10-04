import { Request, Response } from "express";
import {
  ICombinedDealData,
  ICommissionData,
  IDealData,
} from "../../../../type";
import db from "../../../models/commissionAppDB";
import sync from "../../../services/de_deal_sync";
import Jsonb from "jsonb-builder";
const { AppDealModel, AppRoleModel, AppRemittanceCheckModel, AppPaymentModel, DealModel } = db;

const saveAppData = async (data: any, model: any) => {
  let findRes = await model.findOne({
    where: { deal: data.deal },
  });
  if (model == AppRoleModel) {
    findRes = await model.findOne({
      where: { role_id: data.role_id },
    });
  }
  if (model == AppRemittanceCheckModel) {
    findRes = await model.findOne({
      where: { deal: data.deal, id: data.id },
    });
  }
  if (model == AppPaymentModel) {
    findRes = await model.findOne({
      where: { deal: data.deal, id: data.id },
    });
  }
  if (findRes === null) {
    await model.create(data);
  } else {
    if (model == AppRemittanceCheckModel) {
      const id = data.id;
      delete data.id;
      await model.update(data, {
        where: { id: id },
      });
    }
    else if (model == AppPaymentModel) {
      const id = data.id;
      delete data.id;
      await model.update(data, {
        where: { id: id },
      });
    }
    else if (model == AppRoleModel) {
      await model.update(data, {
        where: { role_id: data.role_id },
      });
    } else {
      await model.update(data, {
        where: { deal: data.deal },
      });
    }
  }
};

const readData = async (deal: string, model: any) => {
  const res = await model.findAll({
    where: {
      deal: deal,
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return res;
};

const deleteData = async (data: any, model: any) => {
  await model.destroy({
    where: {
      id: data.id
    },
  });
};

const saveCommissionData = async (req: Request, res: Response) => {
  try {
    let allData: ICommissionData = req.body.data;
    let dealData = { ...allData.dealData, submitted: allData.submitted };
    let roleData = allData.roleData;
    let remittanceChecks = allData.remittanceChecks;
    let payments = allData.payments;
    // save appDealData
    await saveAppData(dealData, AppDealModel);
    // save appRoleData
    const dbRoleData = await readData(dealData.deal, AppRoleModel);
    for (let k = 0; k < dbRoleData.length; k++) {
      const isExist = roleData.filter(item => item.id && item.id == dbRoleData[k].id);
      if (!isExist.length) {
        await deleteData(dbRoleData[k], AppRoleModel);
      }
    }
    for (let i = 0; i < roleData.length; i++) {
      await saveAppData(roleData[i], AppRoleModel);
    }
    // save appRemittanceCheckData
    const dbRemittanceChecks = await readData(dealData.deal, AppRemittanceCheckModel);
    for (let k = 0; k < dbRemittanceChecks.length; k++) {
      const isExist = remittanceChecks.filter(item => item.id && item.id == dbRemittanceChecks[k].id);
      if (!isExist.length) {
        await deleteData(dbRemittanceChecks[k], AppRemittanceCheckModel);
      }
    }
    for (let i = 0; i < remittanceChecks.length; i++) {
      await saveAppData(remittanceChecks[i], AppRemittanceCheckModel);
    }
    // save appPaymentData
    const dbPayments = await readData(dealData.deal, AppPaymentModel);
    for (let k = 0; k < dbPayments.length; k++) {
      const isExist = payments.filter(item => item.id && item.id == dbPayments[k].id);
      if (!isExist.length) {
        await deleteData(dbPayments[k], AppPaymentModel);
      }
    }
    for (let i = 0; i < payments.length; i++) {
      await saveAppData(payments[i], AppPaymentModel);
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

const saveApprovalDate = async (req: Request, res: Response) => {
  try {
    let deal = req.body.data;
    await saveAppData(deal, AppDealModel);
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
  let payments = await readData(deal, AppPaymentModel);
  let allData: any = null;
  if (dealData.length > 0) {
    allData = {
      dealData: dealData[0],
      roleData: roleData,
      remittanceChecks: remittanceChecks,
      payments: payments,
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

  try {
    const findRes = await AppDealModel.findOne({
      where: { deal: deal.id },
    });
    if (findRes === null) {
      await AppDealModel.create({
        deal: deal.id,
        is_finalized: false,
        object: jsonb,
      });
    } else {
      await AppDealModel.update(
        { object: jsonb },
        {
          where: { deal: deal.id },
        }
      );
    }
    console.log("succeed");
  } catch(err) {
    console.log("error: ", err);
  }
};

const handleUpsertFromWebhook = async (deal: any) => {
  // upsert data to commissionDB/de_deal
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
  // const findRes = await DealModel.findOne({
  //   where: { deal: deal.id },
  // });
  // if (findRes === null) {
  //   await DealModel.create({
  //     deal: deal.id,
  //     is_finalized: false,
  //     object: null,
  //   });
  // } else {
  //   await DealModel.update(
  //     { deal: deal.id, is_finalized: deal.is_finalized },
  //     {
  //       where: { deal: deal },
  //     }
  //   );
  // }
};

const pushAllDealData = async (data: any) => {
  for (let i = 0; i < data.length; i++) {
    await pushDealData(data[i].dataValues);
  }
};

export default {
  handleUpsertFromWebhook,
  saveCommissionData,
  saveApprovalDate,
  readCommissionData,
  readCombinedData,
  readDealData,
  sendDealData,
  pushAllDealData,
};
