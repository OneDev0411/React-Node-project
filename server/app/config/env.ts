/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */
import { Options } from "sequelize/types";

export const env: Options = {
  database: "postgres",
  username: "postgres",
  password: "T-[fhK/tAcP0DgtH",
  host: "35.184.70.27",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
