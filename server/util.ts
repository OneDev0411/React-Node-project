require("dotenv").config();

export const makeUrl = () => {
  let temp: any = process.env.DATABASE_URL;
  let password = temp.split("@")[0].split(":")[2];
  let encodePassword = encodeURIComponent(password);
  const url = temp.replace(password, encodePassword);
  return url;
};
