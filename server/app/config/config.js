const path = require("path");
const inflection = require("inflection");

module.exports = {
  username: process.env.APP_DATABASE_CONFIG_USER_NAME,
  password: process.env.APP_DATABASE_CONFIG_PASSWORD,
  database: process.env.APP_DATABASE_CONFIG_DATABASE,
  host: process.env.APP_DATABASE_CONFIG_HOST,
  dialect: "postgres",
  models: [path.join(process.cwd(), "models")],
  modelMatch: (_filename, _member) => {
    const filename = inflection.camelize(_filename.replace(".model", ""));
    const member = _member;
    return filename === member;
  },
  timezone: "+09:00",
};
