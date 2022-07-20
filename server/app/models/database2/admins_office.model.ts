export default (sequelize, Sequelize) => {
  const AdminsOfficeModel = sequelize.define("admin_office", {
    key: {
      type: Sequelize.TEXT,
    },
    office: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return AdminsOfficeModel;
};
