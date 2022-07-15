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
  const webhook = webhookHelper.decryptWebhookIfNeeded(req);
  let result;
  switch (webhook.event) {
    case "DEAL_DATA":
      dealInfo.saveData(createData(req.body));
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
};

export default {
  processWebhook,
};
