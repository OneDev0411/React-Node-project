export default (sequelize, Sequelize) => {
  const CommissionDataModel = sequelize.define("commission_data", {
    deal_id: {
      type: Sequelize.TEXT,
    },
    payload: {
      type: Sequelize.JSONB,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return CommissionDataModel;
};
