import { Request, Response } from "express";
import dataRoute from "../data/commissionDB";

const processDealWebHook = async (req: Request, res: Response) => {
  try {
    let result;
    switch (req.body.event) {
      // case "Added":
      case "Updated":
        // save
        let res = await dataRoute.handleUpsertFromWebhook(
          req.body.payload.deal
        );
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
