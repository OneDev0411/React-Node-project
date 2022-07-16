require("dotenv").config();
const { exec } = require("child_process");

const makeUrl = () => {
  let temp = process.env.DATABASE_URL;
  let url = "";
  if (temp !== undefined) {
    let password = temp.split("@")[0].split(":")[2];
    let encodePassword = encodeURIComponent(password);
    url = temp.replace(password, encodePassword);
  }
  return url;
};

module.exports = {
  migrate: () => {
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
  },
  migrateRollback: () => {
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
  },
  migrateReset: () => {
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
  },
};
