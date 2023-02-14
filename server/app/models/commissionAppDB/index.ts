import { Sequelize } from "sequelize-typescript";
import DealModel from "./deal.model";
import AppDealModel from "./app_deal.model";
import AppRoleModel from "./app_role_data.model";
import AppRemittanceCheckModel from "./app_remittance_check.model";
import AppPaymentModel from "./app_payment.model";
import AppFeeModel from './app_fee_model';
import AppDealNumberModel from './app_deal_number_model';
import AppNoteModel from './app_note_model';
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
  DealModel?: any;
  AppDealModel?: any;
  AppRemittanceCheckModel?: any;
  AppRoleModel?: any;
  AppPaymentModel?: any;
  AppFeeModel?: any;
  AppDealNumberModel?: any;
  AppNoteModel?: any;
}

const db: DB = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.AppDealModel = AppDealModel(sequelize, Sequelize);
db.AppRoleModel = AppRoleModel(sequelize, Sequelize);
db.AppRemittanceCheckModel = AppRemittanceCheckModel(sequelize, Sequelize);
db.AppPaymentModel = AppPaymentModel(sequelize, Sequelize);
db.DealModel = DealModel(sequelize, Sequelize);
db.AppFeeModel = AppFeeModel(sequelize, Sequelize);
db.AppDealNumberModel = AppDealNumberModel(sequelize, Sequelize);
db.AppNoteModel = AppNoteModel(sequelize, Sequelize);

// One-To-One relationships between DealModel and AppDealModel
// db.DealModel.hasOne(db.AppDealModel, {
//   sourceKey: "deal",
//   foreignKey: "deal",
// });
// db.AppDealModel.belongsTo(db.DealModel, {
//   foreignKey: "deal",
//   targetKey: "deal",
// });

export default db;
