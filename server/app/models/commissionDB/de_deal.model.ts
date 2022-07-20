export default (sequelize, Sequelize) => {
  const DeDealModel = sequelize.define("de_deal", {
    deal: {
      type: Sequelize.UUID,
    },
    is_finalized: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return DeDealModel;
};
