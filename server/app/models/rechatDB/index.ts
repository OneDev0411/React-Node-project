import { Sequelize } from "sequelize-typescript";
import AdminsOfficeModel from "./admins_office.model";
import AgentsOfficeModel from "./agents_office.model";
import DeDealModel from "./de_deal.model";
import OfficeModel from "./office.model";
import RegionModel from "./region.model";
import UserModel from "./user.model";
import ContactModel from "./contact.model";
import { makeUrl, removeAttribute } from "../../../util";

const database_url: string = process.env.DATABASE_URL2 || "";

// @ts-ignore
const sequelize: Sequelize = new Sequelize(makeUrl(database_url), {
  dialect: "postgres",
  dialectOptions: {
    ssl: true,
  },
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
  DeDealModel?: any;
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
db.DeDealModel = DeDealModel(sequelize, Sequelize);
db.OfficeModel = OfficeModel(sequelize, Sequelize);
removeAttribute(db.OfficeModel, ["id", "created_at", "updated_at"]);
db.RegionModel = RegionModel(sequelize, Sequelize);
removeAttribute(db.RegionModel, ["id", "created_at", "updated_at"]);
db.UserModel = UserModel(sequelize, Sequelize);

// set foreign key

export default db;
