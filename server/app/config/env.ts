/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */
import { Options } from "sequelize/types";

export const env: Options = {
  database: process.env.APP_DATABASE_CONFIG_DATABASE,
  username: process.env.APP_DATABASE_CONFIG_USER_NAME,
  password: process.env.APP_DATABASE_CONFIG_PASSWORD,
  host: process.env.APP_DATABASE_CONFIG_HOST,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
