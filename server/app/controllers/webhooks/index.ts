import { Request, Response } from "express";
<<<<<<< HEAD
import dataRoute from "../data/database1";
=======
import dataRoute from "../data";
>>>>>>> 3b3c32964d967eb681eb39cfc938f8ae7848de8f

const processDealWebHook = async (req: Request, res: Response) => {
  try {
    let result;
    switch (req.body.event) {
      // case "Added":
      case "Updated":
        let res = await dataRoute.saveDealFromWebhook(req.body.payload);
        if (res !== null) {
          result = "Data is saved successfully";
          let deal_id = req.body.payload.deal.id;
          dataRoute.sendDealData(deal_id);
        } else {
          result = "Data isn't saved";
        }

        break;
      default:
    }
    res.status(200).json({
      message: "successful",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error,
    });
  }
};

export default {
  processDealWebHook,
};
