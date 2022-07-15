/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

import { env } from "../config/env";
import Sequelize from "sequelize";

import DealDataModel from "./deal_data.model";
import RoleDataModel from "./role_data.model";
import RemittanceChecksModel from "./remitttance_checks.model";
import DealInfoModel from "./deal_info.model";

// @ts-ignore
const sequelize: typeof Sequelize = new Sequelize(
  env.database,
  env.username,
  env.password,
  {
    host: env.host,
    dialect: env.dialect,
    operatorsAliases: false,

    pool: {
      max: env.pool?.max,
      min: env.pool?.min,
      acquire: env.pool?.acquire,
      idle: env.pool?.idle,
    },
  }
);

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
