/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */
require("dotenv").config();

import { Options } from "sequelize/types";

export const env: Options = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
