import { Request, Response } from "express";
import dataRoute from "../data";

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
