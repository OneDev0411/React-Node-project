import express from "express";

import homeRoute from "./app/controllers/home";
import dataRoute from "./app/controllers/data";
import manifestRoute from "./app/controllers/manifest";

// webhooks
import webhooks from "./app/controllers/webhooks";
const router = express.Router();

router.get("/", homeRoute);
router.post("/rechat-commission-app-data-save", dataRoute.commissionDataSave);
router.post("/rechat-commission-app-data-read", dataRoute.commissionDataRead);

// webhooks
router.post("/deal-webhooks-endpoint", webhooks.processDealWebHook);
/**
 * Please don't remove this route
 */
router.get("/manifest.json", manifestRoute);

export default router;
