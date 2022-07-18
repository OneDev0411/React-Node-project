import { SequelizeTypescriptMigration } from "sequelize-typescript-migration-fix";
import * as path from "path";
import db from "../models";

const bootstrap = async () => {
  try {
    // @ts-ignore
    const result = await SequelizeTypescriptMigration.makeMigration(
      db.sequelize,
      {
        outDir: path.join(__dirname, "../migrations"),
      }
    );
    console.log(result);
  } catch (e) {
    console.log("error", e);
  }
};
bootstrap();
