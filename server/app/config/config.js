const path = require("path");
const inflection = require("inflection");

module.exports = {
  username: "postgres",
  password: "T-[fhK/tAcP0DgtH",
  database: "postgres",
  host: "35.184.70.27",
  dialect: "postgres",
  models: [path.join(process.cwd(), "models")],
  modelMatch: (_filename, _member) => {
    const filename = inflection.camelize(_filename.replace(".model", ""));
    const member = _member;
    return filename === member;
  },
  timezone: "+09:00",
};
