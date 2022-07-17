import { Request, Response } from "express";
import webhookHelper from "./webhookController";
import dealInfo from "./data";

const createData = (data: any) => {
  let temp = {
    deal_id: data.deal_id,
    data: JSON.stringify(data.data).toString(),
  };
  return temp;
};

const processWebhook = async (req: Request, res: Response) => {
  try {
    const webhook = webhookHelper.decryptWebhookIfNeeded(req);
    console.log("event", webhook.event);
    let result;
    switch (webhook.event) {
      case "add":
        await dealInfo.saveData(createData(req.body));
        result = "Data is saved successfully";
        break;
      // case "SEND_DEAL_INFO":
      // result = await dealInfo.readData(req.body);
      // break;
      default:
    }
    res.status(200).json({
      message: "successful",
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "error",
      error: error,
    });
  }
};

export default {
  processWebhook,
};
