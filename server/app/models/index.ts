import Sequelize from "sequelize";

import DealDataModel from "./deal_data.model";
import RoleDataModel from "./role_data.model";
import RemittanceChecksModel from "./remitttance_checks.model";
import DealInfoModel from "./deal_info.model";
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
  DealDataModel?: any;
  RoleDataModel?: any;
  RemittanceChecksModel?: any;
  UserModel?: any;
  RolesModel?: any;
  DealInfoModel?: any;
}

const db: DB = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.DealDataModel = DealDataModel(sequelize, Sequelize);
db.RoleDataModel = RoleDataModel(sequelize, Sequelize);
db.RemittanceChecksModel = RemittanceChecksModel(sequelize, Sequelize);
db.DealInfoModel = DealInfoModel(sequelize, Sequelize);

export default db;
