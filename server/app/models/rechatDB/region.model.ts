export default (sequelize, Sequelize) => {
  const RegionModel = sequelize.define(
    "region",
    {
      name: {
        type: Sequelize.TEXT,
      },
      brand: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      timezone: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "America/Chicago",
      },
      paid_by: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.TEXT,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return RegionModel;
};
