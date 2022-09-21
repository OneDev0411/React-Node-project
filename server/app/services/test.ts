import commissionAppDB from "../models/commissionAppDB";
import commissionDBRoute from "../controllers/data/commissionDB";
import sync from "./de_deal_sync";

const testSync = async () => {
  try {
    const deDealData = await commissionDBRoute.readDealData('0087360e-37ea-11ed-a79a-0e4bb9531bd9', commissionAppDB.AppDealModel);
    await sync(deDealData.object.config);
    console.log("SYNC SUCCESS");
  } catch (err) {
    console.log("SYNC ERROR");
    throw err;
  }
};

testSync();
