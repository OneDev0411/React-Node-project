import { Sequelize } from "sequelize-typescript";
import AdminsOfficeModel from "./admins_office.model";
import AgentsOfficeModel from "./agents_office.model";
import DealModel from "./deal.model";
import OfficeModel from "./office.model";
import RegionModel from "./region.model";
import UserModel from "./user.model";
import ContactModel from "./contact.model";
import { makeUrl } from "../../../util";

const database_url: string = process.env.DATABASE_URL2 || "";

// @ts-ignore
const sequelize: Sequelize = new Sequelize(makeUrl(database_url), {
  dialect: "postgres",
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

interface DB {
  Sequelize?: typeof Sequelize;
  sequelize?: any;
  AdminsOfficeModel?: any;
  AgentsOfficeModel?: any;
  ContactModel?: any;
  DealModel?: any;
  OfficeModel?: any;
  RegionModel?: any;
  UserModel?: any;
}

const db: DB = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.AdminsOfficeModel = AdminsOfficeModel(sequelize, Sequelize);
db.AgentsOfficeModel = AgentsOfficeModel(sequelize, Sequelize);
db.ContactModel = ContactModel(sequelize, Sequelize);
db.DealModel = DealModel(sequelize, Sequelize);
db.OfficeModel = OfficeModel(sequelize, Sequelize);
db.RegionModel = RegionModel(sequelize, Sequelize);
db.UserModel = UserModel(sequelize, Sequelize);

export default db;
