/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */
export default (sequelize, Sequelize) => {
  const DealInfoModel = sequelize.define("deal_infos", {
    deal_id: {
      type: Sequelize.STRING,
    },
    data: {
      type: Sequelize.JSONB,
    },
  });
  return DealInfoModel;
};
