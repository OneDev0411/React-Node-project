/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

import { env } from './env'
import {Sequelize} from 'sequelize';
// import GeneralData from '../models/GeneralData.model';
// import GCIShares from '../models/GCIShares.model';
// import RemittanceChecks from '../models/RemittanceChecks.model';
// import RemittanceBankWires from '../models/RemittanceBackWires.model';
// import Payments from '../models/Payments.model';
// import RolePayments from '../models/RolePayments.model';
// @ts-ignore
const sequelize: typeof Sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.pool?.max,
    min: env.pool?.min,
    acquire: env.pool?.acquire,
    idle: env.pool?.idle
  }
});

interface DB {
  Sequelize?: typeof Sequelize
  sequelize?: any
  GCI2DE?: any
} 

const db: DB = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
// db.GCI2DE = GeneralData(sequelize, Sequelize);
// db.GCI2DE = GCIShares(sequelize, Sequelize);
// db.GCI2DE = RemittanceChecks(sequelize, Sequelize);
// db.GCI2DE = RemittanceBankWires(sequelize, Sequelize);
// db.GCI2DE = Payments(sequelize, Sequelize);
// db.GCI2DE = RolePayments(sequelize, Sequelize);

export default db;