require("dotenv").config();

export const makeUrl = (): string => {
  let temp: string = process.env.DATABASE_URL || "";
  let password: string = temp.split("@")[0].split(":")[2];
  let encodePassword: string = encodeURIComponent(password);
  let url: string = temp.replace(password, encodePassword);
  return url;
};

module.exports = {
  makeUrl,
};
