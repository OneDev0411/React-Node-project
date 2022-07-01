/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

const env = require('./env.js');
 
const Sequelize = require('sequelize');
// @ts-ignore
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.Test = require('../models/test.model.js')(sequelize, Sequelize);
 
module.exports = db;