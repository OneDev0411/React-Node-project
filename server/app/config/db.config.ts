/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

import { env } from "./env";
import Sequelize from "sequelize";

import DealDataModel from "../models/DealData.model";
import RoleDataModel from "../models/RoleData.model";
import RemittanceChecksModel from "../models/RemittanceChecks.model";

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
}

const db: DB = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.DealDataModel = DealDataModel(sequelize, Sequelize);
db.RoleDataModel = RoleDataModel(sequelize, Sequelize);
db.RemittanceChecksModel = RemittanceChecksModel(sequelize, Sequelize);

export default db;
