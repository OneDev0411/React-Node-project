export default (sequelize, Sequelize) => {
  const DealInfoModel = sequelize.define("deal_info", {
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
  return DealInfoModel;
};
