export default (sequelize, Sequelize) => {
  const RegionModel = sequelize.define("region", {
    name: {
      type: Sequelize.TEXT,
    },
    brand: {
      type: Sequelize.UUID,
    },
    timezone: {
      type: Sequelize.TEXT,
    },
    paid_by: {
      type: Sequelize.TEXT,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return RegionModel;
};
