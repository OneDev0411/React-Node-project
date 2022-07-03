/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

import { env } from './env'
import GCI2DE from '../models/GCI2DE.model';
import {Sequelize} from 'sequelize';
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
 
db.GCI2DE = GCI2DE(sequelize, Sequelize);

export default db;