import rechatDB from "../models/rechatDB";
import commissionDB from "../models/commissionDB";
import rechatDBRoute from "../controllers/data/rechatDB";
import commissionDBRoute from "../controllers/data/commissionDB";

require("dotenv").config();

const test = async () => {
  // try {
  //   console.log("event1");
  //   const deDealData = await rechatDBRoute.readAllData(rechatDB.DeDealModel);
  //   console.log("deDealData", deDealData[0].dataValues);
  //   await commissionDBRoute.saveAllData(deDealData, commissionDB.DeDealModel);
  // } catch (error) {
  //   console.log("error", error);
  // }
};

test();
