import { Request, Response } from "express";
import dataRoute from "../data/commissionDB";

const processDealWebHook = async (req: Request, res: Response) => {
  try {
    let deal = req.body.payload.deal;
    switch (req.body.event) {
      case "Added":
      case "Updated":
        // save
        await dataRoute.handleUpsertFromWebhook(deal);
        await dataRoute.sendDealData(deal.id);
        break;
      default:
    }
    res.status(200).json({
      message: "successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      error: error,
    });
  }
};

export default {
  processDealWebHook,
};
