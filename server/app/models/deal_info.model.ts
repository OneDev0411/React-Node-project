export default (sequelize, Sequelize) => {
  const DealInfoModel = sequelize.define("deal_info", {
    deal_id: {
      type: Sequelize.STRING,
    },
    payload: {
      type: Sequelize.JSONB,
    },
  });
  return DealInfoModel;
};
