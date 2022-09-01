export default (sequelize, Sequelize) => {
  const AppRoleModel = sequelize.define("app_role", {
    deal: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    role_id: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
    },
    legal_full_name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    role: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    share_percent: {
      type: Sequelize.NUMERIC,
    },
    share_value: {
      type: Sequelize.NUMERIC,
    },
    note: {
      type: Sequelize.TEXT,
    },
    inside_payment_unit_type: {
      type: Sequelize.INTEGER,
    },
    inside_payment_value: {
      type: Sequelize.INTEGER,
    },
    inside_payment_calculated_from: {
      type: Sequelize.INTEGER,
    },
    inside_payment_note: {
      type: Sequelize.TEXT,
    },
    outside_payment_unit_type: {
      type: Sequelize.INTEGER,
    },
    outside_payment_value: {
      type: Sequelize.INTEGER,
    },
    outside_payment_calculated_from: {
      type: Sequelize.INTEGER,
    },
    outside_payment_note: {
      type: Sequelize.TEXT,
    },
  });

  return AppRoleModel;
};
