import { makeUrl } from "../../util";
const { argv } = require("process");
const { exec } = require("child_process");
require("dotenv").config();

const migrate = (argv) => {
  switch (argv[2]) {
    case "migrate":
      exec(
        `npx sequelize db:migrate --url ${makeUrl()}`,
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
        `npx sequelize db:migrate:undo --url ${makeUrl()}`,
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
        `npx sequelize db:migrate:undo:all --url ${makeUrl()}`,
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
