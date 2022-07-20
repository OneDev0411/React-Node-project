require("dotenv").config();

export const makeUrl = (database_url: string): string => {
  let temp: string = database_url || "";
  let password: string = temp.split("@")[0].split(":")[2];
  let encodePassword: string = encodeURIComponent(password);
  let url: string = temp.replace(password, encodePassword);
  return url;
};

export const getContextFromDeal = (deal: any, key: string) => {
  // console.log('deal:', deal);
  // console.log('key:', key);
  // console.log('context:', deal.context);
  // console.log('key:', deal.context[key]);
  // console.log('text:', (deal.context[key] || {})['text']);
  // if (deal.context[key] === undefined) {
  //   return "";
  // }
  return (deal["context"][key] || {})["text"] || "";
}

export const getTokenURL:string = 'https://staging.webapi.elliman.com/token?username=emil@rechat.com&password=Skiing4-Monetize-Excitable';

export const DEAL = {
  SELLING: "Selling",
  BUYING: "Buying",
  AGENT_DOUBLE_ENDER: "Agent_double_ender",
  OFFICE_DOUBLE_ENDER: "Office_double_ender",
}


export const BRAND = {
  REGION: "Region",
  OFFICE: "Office",
}
