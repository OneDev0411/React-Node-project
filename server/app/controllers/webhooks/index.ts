import { Request, Response } from "express";
import webhookHelper from "./webhookController";

const processWebhook = (req: Request, res: Response) => {
  const webhook = webhookHelper.decryptWebhookIfNeeded(req);
  console.log("webhook", webhook);
  let message: string = "";
  switch (webhook.event) {
    case "VERIFICATION_COMPLETED":
      // Do logic here for VERIFICATION_COMPLETED event
      message = "VERIFICATION_COMPLETED";
      break;
    case "VERIFICATION_REVIEWED":
      // Do logic here for VERIFICATION_REVIEWED event
      message = "VERIFICATION_REVIEWED";
      break;
    default:
      console.log("Couldn't process webhook event");
      message = "Couldn't process webhook event";
  }
  res.status(200).send(message);
};

export default {
  processWebhook,
};
