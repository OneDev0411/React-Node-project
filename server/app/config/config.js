const path = require("path");
const inflection = require("inflection");

module.exports = {
  username: "postgres",
  password: "1912ab0519",
  database: "test6",
  host: "localhost",
  dialect: "postgres",
  models: [path.join(process.cwd(), "models")],
  modelMatch: (_filename, _member) => {
    const filename = inflection.camelize(_filename.replace(".model", ""));
    const member = _member;
    return filename === member;
  },
  timezone: "+09:00",
};
