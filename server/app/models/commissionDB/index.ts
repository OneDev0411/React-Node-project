import { Sequelize } from "sequelize-typescript";
import CommissionDataModel from "./commission_data.model";
import DealModel from "./deal.model";
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
  DealModel?: any;
}

const db: DB = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.CommissionDataModel = CommissionDataModel(sequelize, Sequelize);
db.DealModel = DealModel(sequelize, Sequelize);

// associations

db.DealModel.hasOne(db.CommissionDataModel, {
  sourceKey: "deal",
  foreignKey: "deal",
});
db.CommissionDataModel.belongsTo(db.DealModel, {
  foreignKey: "deal",
  targetKey: "deal",
});

export default db;
