import express from "express";

import homeRoute from "./app/controllers/home";
import dataRoute from "./app/controllers/data";
import manifestRoute from "./app/controllers/manifest";

// webhooks
import webHooks from "./app/controllers/webhooks";
const router = express.Router();

router.get("/", homeRoute);
router.post("/rechat-commission-app-data-save", dataRoute.totalSaveData);
router.post("/rechat-commission-app-data-read", dataRoute.totalReadData);

// webhooks
router.post("/deal-webhooks-endpoint", webHooks.processWebhook);
/**
 * Please don't remove this route
 */
router.get("/manifest.json", manifestRoute);

export default router;
