import db from "../models/index";
const sync = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("SYNC SUCCESS");
  } catch (err) {
    console.log("SYNC ERROR");
    throw err;
  }
};
sync();
