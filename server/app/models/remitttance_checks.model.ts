export default (sequelize, Sequelize) => {
  const RemittanceChecksModel = sequelize.define("remittance_checks", {
    deal_id: {
      type: Sequelize.TEXT,
    },
    check_num: {
      type: Sequelize.INTEGER,
    },
    check_date: {
      type: Sequelize.DATE,
    },
    check_receive_date: {
      type: Sequelize.DATE,
    },
    amount: {
      type: Sequelize.FLOAT,
    },
  });
  return RemittanceChecksModel;
};
