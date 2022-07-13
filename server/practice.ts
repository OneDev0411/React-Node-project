// import { SequelizeTypescriptMigration } from "sequelize-typescript-migration";
// import { Sequelize } from "sequelize-typescript";
// import * as path from "path";
// import { DealData } from "./app/models/deal_data.model";
// import { RoleData } from "./app/models/role_data.model";
// import { RemittanceChecks } from "./app/models/remittance_checks.model";
// const bootstrap = async () => {
//   const sequelize: Sequelize = new Sequelize({
//     username: "postgres",
//     password: "1912ab0519",
//     database: "test2",
//     host: "localhost",
//     dialect: "postgres",
//     models: [DealData, RoleData, RemittanceChecks],
//     timezone: "+09:00",
//     logging: false,
//   });
//   try {
//     // @ts-ignore
//     const result = await SequelizeTypescriptMigration.makeMigration(sequelize, {
//       outDir: path.join(__dirname, "./app/migrations"),
//     });
//     console.log(result);
//   } catch (e) {
//     console.log(e);
//   }
// };
// bootstrap();
