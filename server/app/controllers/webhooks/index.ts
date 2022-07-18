import { Request, Response } from "express";
import webhookHelper from "./webhookController";
import dealInfo from "./data";

const createData = (data: any) => {
  let temp = {
    deal_id: data.payload.deal.id,
    data: JSON.stringify(data.payload),
  };
  return temp;
};

const processWebhook = async (req: Request, res: Response) => {
  try {
    const webhook = webhookHelper.decryptWebhookIfNeeded(req);
    let result: string = "";
    switch (webhook.event) {
      case "Updated":
        await dealInfo.saveData(createData(req.body));
        result = "Deal information is updated successfully";
        break;
      default:
    }
    console.log("event", result);
    res.status(200).json({
      message: "successful",
      error: "no error",
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "error",
      error: error,
      data: null,
    });
  }
};

export default {
  processWebhook,
};
