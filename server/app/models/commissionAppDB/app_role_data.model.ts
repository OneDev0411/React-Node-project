export default (sequelize, Sequelize) => {
  const AppRoleModel = sequelize.define(
    "app_role", 
    {
      deal: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      agent_id: {
        type: Sequelize.TEXT,
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
      address: {
        type: Sequelize.TEXT,
      },
      user_id: {
        type: Sequelize.TEXT,
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return AppRoleModel;
};
