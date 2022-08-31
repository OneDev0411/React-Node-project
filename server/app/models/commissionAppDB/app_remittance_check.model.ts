export default (sequelize, Sequelize) => {
  const AppRemittanceCheckModel = sequelize.define("app_remittance_check", {
    deal: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    check_num: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    check_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    check_receive_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    amount: {
      type: Sequelize.NUMERIC,
      allowNull: false,
    },
    deal_side: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return AppRemittanceCheckModel;
};
