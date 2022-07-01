import { Request, Response } from 'express'
import { Test } from '../../config/db.config'

const getData = (req, res) => {
  // find all Customer information from 
  Test.findAll()
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
