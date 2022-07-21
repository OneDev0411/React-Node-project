export default (sequelize, Sequelize) => {
  const DealInfoModel = sequelize.define(
    "deal_info",
    {
      deal_id: {
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
  return DealInfoModel;
};
