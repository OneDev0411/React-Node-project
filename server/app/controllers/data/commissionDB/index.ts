import { Request, Response } from "express";
import {
  ICombinedDealData,
  ICommissionData,
} from "../../../../type";
import db from "../../../models/commissionAppDB";
import sync from "../../../services/de_deal_sync";
import { getAgentIdFromUserId, getAddressFromUserId } from "../../../services/de_deal_sync";
import Jsonb from "jsonb-builder";
const { 
  AppDealModel,
  AppRoleModel,
  AppRemittanceCheckModel,
  AppPaymentModel,
  DealModel,
  AppFeeModel,
  AppDealNumberModel,
  AppNoteModel,
  AppDocStatusModel,
  AppTransCoordinatorModel,
  AppCreditModel
} = db;

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
  if (model == AppFeeModel) {
    findRes = await model.findOne({
      where: { deal: data.deal, id: data.id }
    });
  }
  if (model == AppCreditModel) {
    findRes = await model.findOne({
      where: { deal: data.deal, id: data.id }
    });
  }
  if (findRes === null) {
    if (model == AppRoleModel) {
      let agentId = null;
      let address = null;
      if (data.user_id) {
        agentId = await getAgentIdFromUserId(data.user_id);
        address = await getAddressFromUserId(data.user_id);        
      }
      if (agentId && address && data.agent_id === null) {
        data.agent_id = agentId;
        data.address = address;
      }
    }
    if (model == AppPaymentModel) {
      let address = await getAddressFromUserId(data.de_paid_to_deUserId);
      if(address) {
        data.de_office_address = address
      }
    }
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
      let address = await getAddressFromUserId(data.de_paid_to_deUserId);
      data.de_office_address = address
      await model.update(data, {
        where: { id: id },
      });
    }
    else if (model == AppRoleModel) {
      await model.update(data, {
        where: { deal: data.role_id },
      });
    }
    else if (model == AppFeeModel) {
      const id = data.id;
      delete data.id;
      await model.update(data, {
        where: { id: id }
      });
    } else if (model == AppCreditModel) {
      const id = data.id;
      delete data.id;
      await model.update(data, {
        where: {deal: data.deal, id: id}
      })
    } else {
      await model.update(data, {
        where: { deal: data.deal },
      });
    }
  }
};

const readData = async (deal: string, model: any) => {
  if (
    model == AppDealNumberModel || 
    model == AppNoteModel || 
    model == AppDocStatusModel ||
    model == AppTransCoordinatorModel
  ) {
    const res = await model.findOne({
      where: {
        deal: deal
      }
    })
    return res;
  } else {
    const res = await model.findAll({
      where: {
        deal: deal,
      },
      order: [
        ["created_at", "ASC"]
      ],
      attributes: { exclude: ["created_at", "updated_at"] },
    });
    return res;
  }
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
    let payments = [...allData.insidePayments, ... allData.outsidePayments];
    let feeData = allData.feeData;
    let dealNumberData = allData.dealNumber;
    let notes = allData.notes;
    let docStatus = allData.docStatus;
    let transCoordinator = allData.transCoordinator;
    let creditData = allData.creditData;

    //save transCoordinatorData
    await saveAppData(transCoordinator, AppTransCoordinatorModel);
    //save appDocStatsData
    await saveAppData(docStatus, AppDocStatusModel);
    //save appNotesData
    await saveAppData(notes, AppNoteModel);
    //save appDealNumberData
    await saveAppData(dealNumberData, AppDealNumberModel);
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
    // save appFeeData
    const dbFeeData = await readData(dealData.deal, AppFeeModel);
    for (let k = 0; k < dbFeeData.length; k++) {
      const isExist = feeData.filter(item => item.id && item.id == dbFeeData[k].id);
      if (!isExist.length) {
        await deleteData(dbFeeData[k], AppFeeModel);
      }
    }
    for (let i = 0; i < feeData.length; i++) {
      await saveAppData(feeData[i], AppFeeModel);
    }
    // save creditData
    const dbCreditData = await readData(dealData.deal, AppCreditModel);
    for (let k = 0; k < dbCreditData.length; k ++) {
      const isExist = creditData.filter(item => item.id && item.id === dbCreditData[k].id);
      if (!isExist.length) {
        await deleteData(dbCreditData[k], AppCreditModel);
      }
    }
    for (let i = 0; i < creditData.length; i++) {
      await saveAppData(creditData[i], AppCreditModel)
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

const approve = async (req: Request, res: Response) => {
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
  let feeData = await readData(deal, AppFeeModel);
  let dealNumberData = await readData(deal, AppDealNumberModel);
  let notes = await readData(deal, AppNoteModel);
  let docStatuses = await readData(deal, AppDocStatusModel);
  let transCoordinator = await readData(deal, AppTransCoordinatorModel);
  let creditData = await readData(deal, AppCreditModel);

  let allData: any = null;
  if (dealData.length > 0) {
    allData = {
      dealData: dealData[0],
      roleData: roleData,
      remittanceChecks: remittanceChecks,
      payments: payments,
      feeData: feeData,
      dealNumber: dealNumberData,
      notes: notes,
      docStatuses: docStatuses,
      transCoordinator: transCoordinator,
      creditData: creditData
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
    attributes: { exclude: ["id", "created_at", "updated_at"] },
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
  approve,
  readCommissionData,
  readCombinedData,
  readDealData,
  sendDealData,
  pushAllDealData,
};
