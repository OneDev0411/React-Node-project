export default (sequelize, Sequelize) => {
  const OfficeModel = sequelize.define(
    "office",
    {
      brand: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      admin_role: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      business_locations: {
        type: Sequelize.TEXT,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return OfficeModel;
};
