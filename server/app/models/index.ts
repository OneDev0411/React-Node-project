import { Sequelize } from "sequelize-typescript";
import CommissionDataModel from "../models/commission_data.model";
import DealInfoModel from "../models/deal_info.model";
import { makeUrl } from "../../util";

// @ts-ignore
const sequelize: Sequelize = new Sequelize(makeUrl(), {
  dialect: "postgres",
  dialectOptions: {
    ssl: false,
  },
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

interface DB {
  Sequelize?: typeof Sequelize;
  sequelize?: any;
  CommissionDataModel?: any;
  DealInfoModel?: any;
}

const db: DB = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.CommissionDataModel = CommissionDataModel(sequelize, Sequelize);
db.DealInfoModel = DealInfoModel(sequelize, Sequelize);

export default db;
