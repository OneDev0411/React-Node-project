import { Request, Response } from 'express'
import db from "../../config/db.config"
import { Op, STRING } from "sequelize"

const { DealDataModel, RoleDataModel, RemittanceChecksModel } = db;


const dealDataSave = async(data:any) => {
  let result:any;
  const findRes = await DealDataModel.findOne({
    where: { deal_id: data.deal_id }
  })
  if(findRes === null) {
    result = await DealDataModel.create(data)  
  }
  else {
    result = await DealDataModel.update(data, {
      where: { deal_id: data.deal_id }
    })
  }
  return result;
}

const roleDataSave = async(data:any) => {
  let result: any;
  const findRes = await RoleDataModel.findOne({
    where: { 
      [Op.and] : [
        { deal_id: data.deal_id },
        { role_id: data.role_id }
      ]
    }
  })
  if(findRes == null) {
    result = await RoleDataModel.create(data);
  }
  else {
    result = await RoleDataModel.update(data, {
      where: { 
        [Op.and] : [
          { deal_id: data.deal_id },
          { role_id: data.role_id }
        ]
      }
    })
  }
  return result;
}

const remittanceChecksSave = async(data:any) => {
  let result: any;
  const findRes = await RemittanceChecksModel.findOne({
    where: { 
      [Op.and] : [
        { deal_id: data.deal_id },
        { check_id: data.check_id }
      ]
    }
  })
  if(findRes == null) {
    result = await RemittanceChecksModel.create(data);
  }
  else {
    result = await RemittanceChecksModel.update(data, {
      where: { 
        [Op.and] : [
          { deal_id: data.deal_id },
          { check_id: data.check_id }
        ]
      }
    })
  }
  return result;
}

const totalSaveData = async(req: Request, res: Response) => {
 
  try {
    const totalData = req.body.data;
    const dealData = totalData.dealData;
    const roleData = totalData.roleData;
    const remittanceChecks = totalData.remittanceChecks;

    let dealRes = await dealDataSave(dealData);
    for(let i = 0; i < roleData.length; i++){
      await roleDataSave(roleData[i]);
    }    
    for(let i = 0; i < remittanceChecks.length; i++){
      await remittanceChecksSave(remittanceChecks[i]);
    }
    res.status(200).json({
      message: "successful",
    })
    
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error
    });
  }
  
}

export default {
  totalSaveData

}
