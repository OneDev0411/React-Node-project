import rechatDB from "../models/rechatDB";
import commissionDB from "../models/commissionDB";
import rechatDBRoute from "../controllers/data/rechatDB";
import commissionDBRoute from "../controllers/data/commissionDB";

const dealSycn = async () => {
  try {
    const deDealData = await rechatDBRoute.readAllData(rechatDB.DeDealModel);
    await commissionDBRoute.saveAllData(deDealData, commissionDB.DeDealModel);
  } catch (error) {
    console.log("error", error);
  }
};

dealSycn();
