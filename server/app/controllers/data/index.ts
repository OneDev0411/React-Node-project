import { Request, Response } from 'express'

import db from "../../config/db.config"
const { GCI2DE } = db;

const getData = (req:Request, res: Response) => {
  // find all Customer information from 
  GCI2DE.findAll()
    .then(dataList => {
      console.log('dataList:', dataList);
        res.status(200).json({
            message: " Successfully Get data",
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

export default {
  getData,
}
