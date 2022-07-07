import { Request, Response } from 'express'

import db from "../../config/db.config"
const { DealDataModel, RoleDataModel, RemittanceChecksModel } = db;

const getDealData = (req:Request, res: Response) => {
  // find all Customer information from 
  DealDataModel.findAll()
  .then(dataList => {
    console.log('dataList:', dataList);
      res.status(200).json({
          message: " Successfully DealDataModel data",
          customers: dataList
      });
  })
  .catch(error => {
    // log on console
    console.log(error);

    res.status(500).json({
        message: "Error!",
        error: error
    });
  });

  


  
  // res.json({ result: "result" });
}

const insertData = (req, res) => {
  console.log('request', req.body);
  DealDataModel.create({deal_id: "req.body.deal_id"})
  .then(dataList => {
    console.log('dataList:', dataList);
      res.status(200).json({
          message: " Successfully DealDataModel data",
          customers: dataList
      });
  })
  .catch(error => {
    // log on console
    console.log(error);

    res.status(500).json({
        message: "Error!",
        error: error
    });
  });
}



export default {
  getDealData,
  insertData
}
