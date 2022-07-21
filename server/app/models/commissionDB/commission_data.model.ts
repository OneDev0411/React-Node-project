export default (sequelize, Sequelize) => {
  const CommissionDataModel = sequelize.define(
    "commission_data",
    {
      deal_id: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      payload: {
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
