export default (sequelize, Sequelize) => {
  const DeDealModel = sequelize.define("de_deal", {
    deal: {
      type: Sequelize.UUID,
    },
    is_finalized: {
      type: Sequelize.BOOLEAN,
    },
  });
  return DeDealModel;
};
