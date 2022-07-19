import { makeUrl } from "../../util";
const { argv } = require("process");
const { exec } = require("child_process");
require("dotenv").config();

const database_url: string = process.env.DATABASE_URL1 || "";

const migrate = (argv) => {
  switch (argv[2]) {
    case "migrate":
      exec(
        `npx sequelize db:migrate --url ${makeUrl(database_url)}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`${stdout}`);
          }
          console.log(`${stdout}`);
          console.warn(`${stderr}`);
        }
      );
      break;
    case "rollback":
      exec(
        `npx sequelize db:migrate:undo --url ${makeUrl(database_url)}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`${stdout}`);
          }

          console.log(`${stdout}`);
          console.warn(`${stderr}`);
        }
      );
      break;
    case "reset":
      exec(
        `npx sequelize db:migrate:undo:all --url ${makeUrl(database_url)}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`${stdout}`);
          }

          console.log(`${stdout}`);
          console.warn(`${stderr}`);
        }
      );
      break;
  }
};

migrate(argv);
