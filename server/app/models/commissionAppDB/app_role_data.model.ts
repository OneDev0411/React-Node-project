export default (sequelize, Sequelize) => {
  const AppRoleModel = sequelize.define("app_role", {
    deal: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
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
    payment_unit_type: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    payment_value: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    payment_calculated_from: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    payment_note: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });

  return AppRoleModel;
};
