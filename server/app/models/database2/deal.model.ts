export default (sequelize, Sequelize) => {
  const DeDealModel = sequelize.define("deal", {
    id: {
      type: Sequelize.UUID,
    },
    deal: {
      type: Sequelize.UUID,
    },
    is_finalized: {
      type: Sequelize.BOOLEAN,
    },
  });
  return DeDealModel;
};
