/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */
export default (sequelize, Sequelize) => {
  const DealInfoModel = sequelize.define("DealInfos", {
    deal_id: {
      type: Sequelize.STRING,
    },
    data: {
      type: Sequelize.JSONB,
    },
  });
  return DealInfoModel;
};
