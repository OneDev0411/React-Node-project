export default (sequelize, Sequelize) => {
  const DealInfoModel = sequelize.define(
    "deal_info",
    {
      deal: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      payload: {
        type: Sequelize.JSONB,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return DealInfoModel;
};
