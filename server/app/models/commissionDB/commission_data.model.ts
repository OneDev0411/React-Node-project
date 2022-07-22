export default (sequelize, Sequelize) => {
  const CommissionDataModel = sequelize.define(
    "commission_data",
    {
      deal: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      object: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return CommissionDataModel;
};
