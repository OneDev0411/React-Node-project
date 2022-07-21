import { Sequelize } from "sequelize-typescript";
import CommissionDataModel from "./commission_data.model";
import DealInfoModel from "./deal_info.model";
import DeDealModel from "./de_deal.model";
import { makeUrl } from "../../../util";

const database_url: string = process.env.DATABASE_URL1 || "";

// @ts-ignore
const sequelize: Sequelize = new Sequelize(makeUrl(database_url), {
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
  DeDealModel?: any;
}

const db: DB = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.CommissionDataModel = CommissionDataModel(sequelize, Sequelize);
db.DealInfoModel = DealInfoModel(sequelize, Sequelize);
db.DeDealModel = DeDealModel(sequelize, Sequelize);

// associations
db.DeDealModel.hasOne(db.DealInfoModel, {
  sourceKey: "deal",
  foreignKey: "deal_id",
});
db.DealInfoModel.belongsTo(db.DeDealModel, {
  foreignKey: "deal_id",
  targetKey: "deal",
});

db.DeDealModel.hasOne(db.CommissionDataModel, {
  sourceKey: "deal",
  foreignKey: "deal_id",
});
db.CommissionDataModel.belongsTo(db.DeDealModel, {
  foreignKey: "deal_id",
  targetKey: "deal",
});

export default db;
