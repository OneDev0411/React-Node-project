/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */
import { Options } from "sequelize/types";

export const env: Options = {
  database: "rechat",
  username: "postgres",
  password: "1912ab0519",
  host: "localhost",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
