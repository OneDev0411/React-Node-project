require("dotenv").config();
import appConfig from './config'

export const makeUrl = (database_url: string): string => {
  let temp: string = database_url || "";
  let password: string = temp.split("@")[0].split(":")[2];
  let encodePassword: string = encodeURIComponent(password);
  let url: string = temp.replace(password, encodePassword);
  return url;
};

// export const getContextFromDeal = (deal: any, key: string) => {
//   if (key === "list_date") {
//     return (deal["context"][key] || {})["date"];
//   }
//   if (key === "list_price") {
//     return (deal["context"][key] || {})["number"];
//   }
//   return (deal["context"][key] || {})["text"] || "";
// };

export const getContextFromDeal = (deal, key, default_value = null) => {
  const context = deal.context ? deal.context : {};

  const { text, number, date, data_type } = context[key] || {};

  if (data_type === "Text") return text;

  if (data_type === "Date" && date) return new Date(date * 1000);

  if (data_type === "Number") return parseFloat(number);

  return default_value;
};

export const getTokenURL: string =
  `${appConfig.api_url}/token?username=${appConfig.username}&password=${appConfig.password}`;

export const DEAL = {
  SELLING: "Selling",
  BUYING: "Buying",
  AGENT_DOUBLE_ENDER: "AgentDoubleEnder",
  OFFICE_DOUBLE_ENDER: "OfficeDoubleEnder",
};

export const BRAND = {
  BROKERAGE: "Brokerage",
  REGION: "Region",
  OFFICE: "Office",
  TEAM: "Team",
  PERSONAL: "Personal",
  OTHER: "Other",
};

export const removeAttribute = (model: any, removeItem: string[]) => {
  removeItem.map((item: string) => {
    model.removeAttribute(item);
  });
};
