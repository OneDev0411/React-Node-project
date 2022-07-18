import { Request, Response } from "express";
import dealInfo from "../data";

const processDealWebHook = async (req: Request, res: Response) => {
  try {
    let result;
    switch (req.body.event) {
      // case "Added":
      case "Updated":
        await dealInfo.saveDealFromWebhook(req.body.payload);
        result = "Data is saved successfully";
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
