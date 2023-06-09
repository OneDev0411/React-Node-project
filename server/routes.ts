import express from "express";

import homeRoute from "./app/controllers/home";
import dataRoute from "./app/controllers/data/commissionDB";
import manifestRoute from "./app/controllers/manifest";
// webhooks
import webhooks from "./app/controllers/webhooks";
// import sync from "./app/services/de_deal_sync";
const router = express.Router();

router.get("/", homeRoute);
router.post("/rechat-commission-app-data-save", dataRoute.saveCommissionData);
router.post("/rechat-commission-app-data-read", dataRoute.readCommissionData);
router.post("/rechat-commission-app-approve", dataRoute.approve);

// webhooks
router.post("/deal-webhooks-endpoint", webhooks.processDealWebHook);
/**
 * Please don't remove this route
 */
router.get("/manifest.json", manifestRoute);

// router.get("/test", sync);

export default router;
