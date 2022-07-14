require("dotenv").config();

const { exec } = require("child_process");

module.exports = {
  migrate: () => {
    console.log("**************");
    console.log(process.env.APP_ENV);
    exec(
      `npx sequelize db:migrate --env ${process.env.APP_ENV}`,
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
      `npx sequelize db:migrate:undo --env ${process.env.APP_ENV}`,
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
      `npx sequelize db:migrate:undo:all --env ${process.env.APP_ENV}`,
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
