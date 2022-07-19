require("dotenv").config();

export const makeUrl = (database_url: string): string => {
  let temp: string = database_url || "";
  let password: string = temp.split("@")[0].split(":")[2];
  let encodePassword: string = encodeURIComponent(password);
  let url: string = temp.replace(password, encodePassword);
  return url;
};

module.exports = {
  makeUrl,
};
