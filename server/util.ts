import { IdealData } from "type";

require("dotenv").config();

export const makeUrl = (database_url: string): string => {
  let temp: string = database_url || "";
  let password: string = temp.split("@")[0].split(":")[2];
  let encodePassword: string = encodeURIComponent(password);
  let url: string = temp.replace(password, encodePassword);
  return url;
};

export const getContextFromDeal = (deal: any, key: string) => {
  return deal["context"][key]["text"];
};

export const DEAL = {
  SELLING: "Selling",
  BUYING: "Buying",
  AGENT_DOUBLE_ENDER: "Agent_double_ender",
  OFFICE_DOUBLE_ENDER: "Office_double_ender",
};

export const BRAND = {
  REGION: "Region",
  OFFICE: "Office",
};
