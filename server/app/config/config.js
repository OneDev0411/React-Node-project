const path = require("path");
const inflection = require("inflection");
require("dotenv").config({ path: "../../" });
module.exports = {
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "postgres",
  models: [path.join(process.cwd(), "models")],
  modelMatch: (_filename, _member) => {
    console.log("_filename", _filename, _member);
    const filename = inflection.camelize(_filename.replace(".model", ""));
    console.log("filename", filename);
    const member = _member;
    return filename === member;
  },
  timezone: "+09:00",
};
